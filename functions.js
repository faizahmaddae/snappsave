const cheerio = require('cheerio');

function _0xe91c(d, e, f) {
    var g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'['split']('');
    var h = g['slice'](0, e);
    var i = g['slice'](0, f);
    var j = d['split']('')['reverse']()['reduce'](function (a, b, c) {
        if (h['indexOf'](b) !== -1) return a += h['indexOf'](b) * (Math['pow'](e, c))
    }, 0);
    var k = '';
    while (j > 0) {
        k = i[j % f] + k;
        j = (j - (j % f)) / f
    }
    return k || '0'
}

function eval(h, u, n, t, e, r) {
    r = "";
    for (var i = 0, len = h.length; i < len; i++) {
        var s = "";
        while (h[i] !== n[e]) {
            s += h[i];
            i++
        }
        for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
        r += String.fromCharCode(_0xe91c(s, e, 10) - t)
    }
    return decodeURIComponent(escape(r))
}


// get params from code string
function getParams(data) {

    var codeString = data;
    var iStart = codeString.indexOf(')}("');
    var params = codeString.slice(iStart + 3, codeString.length - 2);
    params = params.replaceAll('"', "");

    var args = params.split(','); // [ 'AAAbbbcccDDDKKKOOO', '75', 'SqEyfRUvZ', '15', '6', '28' ]
    return args;
}


function parseFB(data) {

    var response = {};
    response['status'] = 'success';
    response['error'] = null;
    response['website'] = 'facebook';
    response['data'] = [];

    const $ = cheerio.load(data);

    var download_box = $('.download-box');
    var thumbnail = $(download_box).find('img').attr('src');

    // find table with first tr
    var table = $('table').find('tbody').find('tr').first();

    var video_url = $(table).find('td').find('a').attr('href');

    //  if video_url finded
    if (video_url == undefined || video_url == null || video_url == '') {
        response['status'] = 'error';
        response['error'] = 'not_found';
        return response;
    } else {
        response['data'].push({
            'thumbnail': thumbnail,
            'video_url': video_url,
            is_video: true,
        });
    }
    return response;
}


function parseInsta(data) {

    var response = {};
    response['status'] = 'success';
    response['error'] = null;
    response['website'] = 'instagram';
    response['data'] = [];

    const $ = cheerio.load(data);

    var download_box = $('.download-box');

    var items = $(download_box).find('.download-items');

    if( items.length == 0 ){
        response['status'] = 'error';
        response['error'] = 'not_found';
        return response;
    }
    
    items.each((i, el) => {
        var thumbnail = $(el).find('img').attr('src');
        var img_url = $(el).find('.download-items__btn').find('a').attr('href');

        // if finded dev.download-items__thumb.video its a video
        var is_video = $(el).find('.download-items__thumb.video').length > 0 ? true : false;

        if (is_video) {
            response['data'].push({
                thumbnail: thumbnail.replaceAll("&dl=1", ""),
                video_url: img_url.replaceAll("&dl=1", ""),
                is_video: is_video,
            });
        } else {
            response['data'].push({
                thumbnail: thumbnail.replaceAll("&dl=1", ""),
                image_url: img_url.replaceAll("&dl=1", ""),
                is_video: is_video,
            });
        }
    });
    return response;
}

function parseTiktok(data) {

    var response = {};
    response['status'] = 'success';
    response['error'] = null;
    response['website'] = 'tiktok';
    response['data'] = [];

    const $ = cheerio.load(data);

    var download_box = $('.download-box');

    var tiktok_video_url = $(download_box).find('a.is-success').attr('href');

    if (tiktok_video_url == undefined || tiktok_video_url == null || tiktok_video_url == '') {
        response['status'] = 'error';
        response['error'] = 'not_found';
        return response;
    } else {
        response['data'].push({
            thumbnail: null,
            video_url: tiktok_video_url,
            is_video: true,
        });
    }
    return response;
}

module.exports = {
    getParams,
    eval,
    parseFB,
    parseInsta,
    parseTiktok
}
