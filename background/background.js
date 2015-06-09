var _ = require('lodash');
var log = require('../common/log');

chrome.webRequest.onCompleted.addListener(function (details) {
    console.dir(details);
}, {urls: ['<all_urls>']});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    log('request received', request);

    switch (request.action) {
        case 'download':
            if ('vk' == request.source) {
                let data = request.data;
                let { url, name } = data;

                log(`downloading from vk "${name}" with url "${url}"`);

                var ext = _.last(url.split('?')[0].split('.'));
                var filename = `${name}.${ext}`;

                chrome.downloads.download({ url, filename });
            }

        break;

        case 'cookies':
            let details = request.details || {};

            chrome.cookies.getAll(details, (cookies) => {
                log(`cookies retrieved`);
                console.dir(cookies);

                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { cookies });
                });
            });
    }
});
