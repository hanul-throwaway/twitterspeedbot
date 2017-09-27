const speedTest = require('speedtest-net');
const logUpdate = require('log-update');
const console = require('console');

const twit = require('twit');
const twitterConfig = require('./twitter-config')

const Twitter = new twit(twitterConfig);

speedTest()
    .on('downloadprogress', progress => {
        logUpdate('Download progress:' + progress + '%');
        if (progress == 100) logUpdate.done()
    })
    .on('uploadprogress', progress => {
        logUpdate('Upload progress:' + progress + '%');
        if (progress == 100) logUpdate.done()
    })
    .on('bestservers', servers => {
        servers.map((server) => {
            console.log(`Server: ${server.name}, URL: ${server.url}, Ping: ${server.bestPing}`);
        })
    })
    .on('data', data => {
        console.dir(data);
        let speeds = data['speeds'];
        let server = data['server'];

        let statusText = `Testing Server: ${server.host}
        Avg. Download: ${speeds.download}Mb/s
        Avg. Upload: ${speeds.upload}Mb/s`

        Twitter.post(
            'statuses/update',
            {
                status: statusText
            }, function (err, data, response) {
                if(err) console.log('Error:',err);
                console.log('Done', data);
            })
    })