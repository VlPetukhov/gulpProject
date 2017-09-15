'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    preFixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourceMap = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssMin = require('gulp-minify-css'),
    rimRaf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/'
    },
    src: {
        html: ['src/**/*.html', '!src/template/**/*.html'],
        js: ['src/js/**/*.js', '!src/js/partials/**/*.js'],
        style: 'src/style/main.scss'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss'
    },
    clean: './build'
};

gulp.task(
    'webserver',
    function () {
        browserSync({
            server: {
                baseDir: './build'
            },
            host: 'localhost',
            port: 3000,
            tunnel: true
        });
    }
);

gulp.task(
    'html:build',
    function () {
        gulp.src(path.src.html)
            .pipe(rigger())
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));
    }
);

gulp.task(
    'js:build',
    function () {
        gulp.src(path.src.js)
            .pipe(rigger())
            .pipe(sourceMap.init())
            .pipe(uglify())
            .pipe(sourceMap.write())
            .pipe(gulp.dest(path.build.js))
            .pipe(reload({stream: true}))
    }
);

gulp.task(
    'style:build',
    function () {
        gulp.src(path.src.style)
            .pipe(sourceMap.init())
            .pipe(sass())
            .pipe(preFixer())
            .pipe(cssMin())
            .pipe(sourceMap.write())
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}))
    }
);

gulp.task(
    'build',
    [
        'html:build',
        'js:build',
        'style:build'
    ]
);

gulp.task(
    'watch',
    function () {
        watch(
            [path.watch.js],
            function (ev, callback) {
                gulp.start('js:build');
            }
        );
        watch(
            [path.watch.html],
            function (ev, callback) {
                gulp.start('html:build');
            }
        );
        watch(
            [path.watch.style],
            function (ev, callback) {
                gulp.start('js:style');
            }
        );
    }
);

gulp.task(
    'clean',
    function (callback) {
        rimRaf(path.clean, callback);
    }
);

gulp.task(
    'default',
    [
        'build',
        'webserver',
        'watch'
    ]
);
