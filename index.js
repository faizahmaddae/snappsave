const express = require('express')
const app = express()
const port = 3000

// axios
const axios = require('axios');
// cheerio
const cheerio = require('cheerio');

// functions.js 
const functions = require('./functions.js');

// clear console
console.clear();

app.get('/', (req, res) => {
    res.send(`hello`)
})


app.get('/api', async (req, res) => {

    var fb_url = 'https://www.facebook.com/reel/1028002425277840';
    // fb_url = 'https://www.facebook.com/photo.php?fbid=1478529732919755&set=a.108024456636963&type=3&mibextid=Nif5oz';
    var insta_url = 'https://www.instagram.com/p/CqslAWptPoI/';
    var tiktok_url = 'https://www.tiktok.com/@angelitomallorquin32/video/7249089724835466523?is_from_webapp=1&sender_device=pc';
    var action = 'https://snapsave.app/action.php?lang=en';

    var data = {};

    var url = req.query.url ?? insta_url;
    var website = req.query.website ?? 'instagram';

    // axios
    await axios.post(action, { url: url }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Host': 'snapsave.app',
            'Origin': 'https://snapsave.app',
            'Referer': 'https://snapsave.app/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        },
    }).then(response => {

        // console.log(response.data);

        var args = functions.getParams(response.data);
        var h = args[0];
        var u = args[1];
        var n = args[2];
        var t = args[3];
        var e = args[4];
        var r = args[5];

        var result = functions.eval(h, u, n, t, e, r);

        result = result.replace(/\\("|')/g, "'");

        // check website
        if (website == 'facebook') {
            var fb_result = functions.parseFB(result);
            data = fb_result;
        } else if (website == 'instagram') {
            var insta_result = functions.parseInsta(result);
            data = insta_result;
        } else if (website == 'tiktok') {
            var tiktok_result = functions.parseTiktok(result);
            data = tiktok_result;
        } else {
            data = { status: 'error', error: 'website_not_found' };
        }

        // facebook
        // var fb_result = functions.parseFB(result);
        // insta 
        // var insta_result = functions.parseInsta(result);
        // tiktok
        // var tiktok_result = functions.parseTiktok(result);
        // data = tiktok_result;

    }).catch(error => {
        console.log(`Error: ${error}`);
    })

    res.send({ data: data })
})



function log(data) {
    console.log(data);
}


app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}/api/`)
})