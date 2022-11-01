var { src, dest, parallel } = require('gulp');
var gulp = require('gulp');
var minify = require('gulp-csso');
var typescript = require('gulp-typescript');
var htmlValidator = require('gulp-w3c-html-validator');
var cssValidator = require('gulp-w3c-css');
var uncommentIT = require('gulp-uncomment-it');
var beautify = require('gulp-jsbeautifier');

gulp.task('cgol-ts-to-js-converter', function () {
    return src('../../src_Workspace/ts/*ts')
        .pipe(typescript({
            noImplicitAny: true,
            target: 'ES2015'
        }))
        .pipe(beautify())
        .pipe(dest('../../dest_Build/js'));
});

gulp.task('cgol-html-validate-w3c', function () {
    return src('../../src_Workspace/html/*html')
        .pipe(htmlValidator())
        .pipe(beautify())
        .pipe(dest('../../dest_build/html'));
});

gulp.task('cgol-css-validate-w3c', function () {
    return src('../../src_Workspace/css/*.css')
        .pipe(minify())
        .pipe(cssValidator())
        .pipe(beautify())
        .pipe(dest('../../dest_build/log'));
});

gulp.task('cgol-css-minify', function () {
    return src('../../src_Workspace/css/*.css')
        .pipe(minify())
        .pipe(uncommentIT())
        .pipe(beautify())
        .pipe(dest('../../dest_build/css'));
});

gulp.task('cgol-move-gulpfile', function () {
    return (src('../../src_Workspace/js/gulpfile.js'))
        .pipe(dest('../../dest_build/js')
        .pipe(beautify()));
})

gulp.task('cgol-build', gulp.parallel(['cgol-ts-to-js-converter', 'cgol-html-validate-w3c', 'cgol-css-minify', 'cgol-move-gulpfile']))