var _ = require('lodash');
var $ = require('jquery');

var log = require('../common/log');
var VkAudio = require('../common/vkAudio');

document.addEventListener('DOMContentLoaded', onDomReady);

function onDomReady() {
    setInterval(processAudio, 250);
    log('inited');

    processAudio();
}

function processSingleAudio(audioNode) {
    let $audio = $(audioNode);

    let vkAudio = new VkAudio($audio);

    let bgUrl = chrome.extension.getURL('images/cassette.png');

    var $downloadLink = $('<a>', {
        'class': 'mine_download fl_r'
    }).css({
        background: `url("${bgUrl}")`,
        width: '30px',
        height: '30px',
        padding: '0',
        'margin-right': '10px',
        display: 'none',
        'opacity': '0.8'
    }).appendTo($audio.find('.actions'))
        .hover(() => $downloadLink.css('opacity', '1'), () => $downloadLink.css('opacity', '0.8'));

    $audio.hover(() => $downloadLink.show(), () => $downloadLink.hide());

    audioNode.setAttribute('data-mined', 'true');

    $downloadLink.on('click', () => {
        vkAudio.download();

        return false;
    });

    vkAudio.obtainFileSize().done(() => {
        var $bpm = $('<div>', {
            'class': 'mine-bpm'
        }).css({
            'float': 'left',
            'position': 'relative',
            'margin-top': '-7px',
            'color': 'rgb(119, 119, 119)'
        })
            .append($('<b>').css('margin-right', '3px').text(vkAudio.getBpm()))
            .append('kbsp');

        $audio.find('.info').after($bpm);
    });
}

function processAudio() {
    log('processing audio');

    _(document.getElementsByClassName('audio'))
        .filter(e => !e.getAttribute('data-mined'))
        .each(e => processSingleAudio(e))
        .value();
}

//<div class="msaudioinfo" id="241238_352591675x" style="margin-left: 33px;"><b>128</b> kbps (3.71 MB)</div>
