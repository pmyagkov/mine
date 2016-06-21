var _ = require('lodash');
var $ = require('jquery');

var log = require('../common/log');
var VkAudio = require('../common/vkAudio');
var vow = require('vow');

const AUDIO_PROCESSING_INTERVAL = 1000;
const AUDIO_BATCH_COUNT = 10;

document.addEventListener('DOMContentLoaded', onDomReady);

let bgUrl = chrome.extension.getURL('images/cassette.png');

function onDomReady() {
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

    log(audioNode.innerText, audioNode.getAttribute('data-mined'));
    if (audioNode.getAttribute('data-mined')) {
        console.trace(audioNode.innerText);
    }

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
    var nextNodes = _.slice(nodes, AUDIO_BATCH_COUNT);
    var promises = _.take(nodes, AUDIO_BATCH_COUNT).map(e => processSingleAudio(e));

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

    return _processAudio(nodes).then(() => {
      setTimeout(processAudio, AUDIO_PROCESSING_INTERVAL);
    });
}

//<div class="msaudioinfo" id="241238_352591675x" style="margin-left: 33px;"><b>128</b> kbps (3.71 MB)</div>
