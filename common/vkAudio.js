var _ = require('lodash');
var log = require('./log');
var vow = require('vow');
var $ = require('jquery');

class VkAudio {
    constructor($node) {
        this._$node = $node;

        this._url = this._parseUrl();
        this._name = this._parseName();
        this._duration = this._parseDuration();

        //log(`constructing VK audio`, this);
    }

    getUrl() {
        return this._url;
    }

    _parseUrl() {
        return this._$node.find('[type=hidden][id^=audio]').val();
    }

    _parseName() {
        return _.trim(this._$node.find('.title_wrap').text());
    }

    _parseDuration() {
        var durationString = this._$node.find('.duration').text();

        let parts = String(durationString).split(':');
        let i = parts.length;

        var multiplier = 1;
        var secondsLength = 0;

        while (i--) {
            secondsLength += multiplier * parts[i];
            multiplier *= 60;
        }

        return secondsLength;
    }
    
    _calculateBpm() {
        return Math.floor(this._fileSize * 8 / 1000) / this._duration;
    }

    obtainFileSize() {
        var that = this;

        return new vow.Promise(function(resolve, reject) {
            $.ajax(that._url, {
                method: 'HEAD',
                complete: function(xhr) {
                    that._fileSize = xhr.getResponseHeader('Content-Length');
                    that._bpm = that._calculateBpm();

                    log(`file size: ${that._fileSize}, bpm: ${that._bpm} for "${that._name}"`);

                    resolve(that);
                }
            })
        });
    }

    download() {
        log('on download link click');

        let url = this._url;
        let name = this._name;

        let request = {
            'source': 'vk',
            'action': 'download',
            'data': { url, name }
        };

        log('sending request', request);
        chrome.extension.sendRequest(request);
    }

    getBpm() {
        return Math.floor(this._bpm);
    }

    formatBpmString() {
        return `${this._bpm} kbps`;
    }
}

module.exports = VkAudio;
