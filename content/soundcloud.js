var _ = require('lodash');

chrome.runtime.onMessage.addListener((response = {}) => {
    if (response.cookies) {
        console.dir(response.cookies);
    }
});

_.delay(() => {
    console.log('>>>', 'Soundcloud script started.');

    console.log('>>>', 'Trying to read cookies.');

    var request = { action: 'cookies', details: { domain: 'soundcloud.com' }};

    chrome.runtime.sendMessage(request, (response) => {
        debugger;
        console.log(response.farewell);
    });

}, 3000);