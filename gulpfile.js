var _ = require('lodash');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var babelify = require('babelify');
var concat = require('gulp-concat');
var browserify = require('browserify');
var copy = require('gulp-contrib-copy');
var source = require('vinyl-source-stream');

var stylus = require('gulp-stylus');
var newer = require('gulp-newer');

var fs = require('fs');
var transformCssUrls = require('./helpers/transform-css-urls');

var BUILD_FOLDER = '_built';

function getExtensionId() {
    return fs.readFileSync('extension_id');
}

var EXTENSION_ID = getExtensionId();

function buildScript(taskName, path) {
    var fileName = _.last(path.split('/'));

    gulp.task(taskName, function() {
        return browserify(path, { debug: true })
            .transform(babelify)
            .bundle()
            //.pipe(babel())
            .pipe(source(fileName))

            //.pipe(sourcemaps.init())
            //.pipe(concat('vk.js'))
            //.pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(BUILD_FOLDER));
    });
}

buildScript('vk', './content/vk.js');
buildScript('bg', './background/background.js');

gulp.task('css', function () {
    return gulp.src(['content/*.styl'])
        .pipe(newer({
            dest: BUILD_FOLDER,
            ext: 'css'
        }))
        .pipe(stylus())
        .pipe(transformCssUrls(EXTENSION_ID))
        .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('static', function() {
    return gulp.src(['manifest.json', 'background/background.html'])
        .pipe(newer(BUILD_FOLDER))
        .pipe(copy())
        .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('images', function() {
    return gulp.src('images/*')
        .pipe(newer(BUILD_FOLDER + '/images'))
        .pipe(gulp.dest(BUILD_FOLDER + '/images'));
});

gulp.task('default', ['static', 'vk', 'bg', 'images', 'css']);

gulp.task('watch', ['default'], function() {
    gulp.watch(['./content/*.js', './content/*.styl', './background/*', './common/*', './manifest*'], ['default']);
});
