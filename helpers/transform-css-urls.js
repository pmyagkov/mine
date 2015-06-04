var through = require('through2');

var PLUGIN_NAME = 'transform-css-urls';
var URL_REGEX = /url\(["']([^"]+)["']\)/;

function transformCssUrls(ext_id) {
    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }
        if (file.isNull()) {
            return cb(null, file);
        }

        var content = file.contents.toString('utf8');
        content = content.replace(URL_REGEX, "url(\"chrome-extension://" + ext_id + "/$1\")");
        file.contents = new Buffer(content);

        return cb(null, file);
    });
}

module.exports = transformCssUrls;