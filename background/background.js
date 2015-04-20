var _ = require('lodash');
var log = require('../common/log');

chrome.extension.onRequest.addListener(function(request, c, b) {
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
    }
});
