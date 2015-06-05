var _ = require('lodash');
var $ = require('jquery');

var log = require('../common/log');
var VkAudio = require('../common/vkAudio');
var vow = require('vow');

document.addEventListener('DOMContentLoaded', onDomReady);

let bgUrl = chrome.extension.getURL('images/cassette.png');

function onDomReady() {
    setInterval(processAudio, 250);
    log('inited');

    processAudio();
}

function processSingleAudio(audioNode) {
    let $audio = $(audioNode);

    let vkAudio = new VkAudio($audio);

    var $downloadLink = $('<a>', {
            'class': 'mine_download fl_r'
        })
        .css('background-image', `url(${bgUrl})`)
        .appendTo($audio.find('.actions'));

    audioNode.setAttribute('data-mined', 'true');

    $downloadLink.on('click', () => {
        vkAudio.download();

        return false;
    });

    return vkAudio.obtainFileSize().then((vkAudio) => {
        var $bpm = $('<div>', {
            'class': 'mine-bpm'
        }).text(vkAudio.getBpm());

        $audio.find('.info').append($bpm);

        return vkAudio;
    });
}

function _processAudio(nodes) {
    var promises = _(nodes).take(10).map(e => processSingleAudio(e)).value();

    var nextNodes = _.slice(nodes, 10);

    return vow.all(promises).then(function () {
        if (nextNodes.length > 0) {
            return _processAudio(nextNodes);
        }

        return arguments[0];
    }, function (promises) {
        return _processAudio();
    });
}

function processAudio() {
    log('processing audio');

    var nodes = _(document.getElementsByClassName('audio'))
        .filter(e => !e.getAttribute('data-mined'))
        .value();

    _processAudio(nodes);
}

//<div class="msaudioinfo" id="241238_352591675x" style="margin-left: 33px;"><b>128</b> kbps (3.71 MB)</div>
