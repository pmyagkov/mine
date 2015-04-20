var _ = require('lodash');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var babelify = require('babelify');
var concat = require('gulp-concat');
var browserify = require('browserify');
var copy = require('gulp-contrib-copy');
var source = require('vinyl-source-stream');

var BUILD_FOLDER = '_built';

function buildScript(taskName, path) {
    gulp.task(taskName, function() {
        return browserify(path, { debug: true })
            .transform(babelify)
            .bundle()
            //.pipe(babel())
            .pipe(source(_.last(path.split('/'))))

            //.pipe(sourcemaps.init())
            //.pipe(concat('vk.js'))
            //.pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(BUILD_FOLDER));
    });
}

buildScript('vk', './content/vk.js');
buildScript('bg', './background/background.js');

gulp.task('static', function() {
    return gulp.src(['manifest.json', 'background/background.html'])
        .pipe(copy())
        .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('images', function() {
    return gulp.src('images/*')
        .pipe(gulp.dest(BUILD_FOLDER + '/images'));
});

gulp.task('default', ['static', 'vk', 'bg', 'images']);

gulp.task('watch', ['default'], function() {
    gulp.watch(['./content/*.js', './background/*', './common/*', './manifest*'], ['default']);
});
