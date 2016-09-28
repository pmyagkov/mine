var _ = require('lodash');
var $ = require('jquery');

var log = require('../common/log');
var VkAudio = require('../common/vkAudio');
var vow = require('vow');

const AUDIO_PROCESSING_INTERVAL = 1000;
const AUDIO_BATCH_COUNT = 20;

document.addEventListener('DOMContentLoaded', onDomReady);

let bgUrl = chrome.extension.getURL('images/cassette.png');

function onDomReady() {
    log('inited');

    processAudio();

    setInterval(processAudio, AUDIO_PROCESSING_INTERVAL);
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

    log(`take ${AUDIO_BATCH_COUNT} from ${nodes.length}`);

    return vow.all(promises).then(function () {
        if (nextNodes.length > 0) {
            return _processAudio(nextNodes);
        }

        console.warn('PROMISE RESOLVED');
        return vow.resolve();
    }, () => console.warn('PROMISE FAILED'));
}

let audioProcessing = false;

function processAudio() {
    if (audioProcessing) {
        log('processing audio BLOCKED');
        return;
    } else {
        log('processing audio LAUNCHED');
    }

    audioProcessing = true;

    var nodes = _(document.getElementsByClassName('audio'))
        .filter(e => !e.getAttribute('data-mined'))
        .value();

    let continuation = () => audioProcessing = false;

    return _processAudio(nodes).then(continuation, continuation);
}

//<div class="msaudioinfo" id="241238_352591675x" style="margin-left: 33px;"><b>128</b> kbps (3.71 MB)</div>
