const gulp = require('gulp')
const pug = require('gulp-pug')
const del = require('del')
const concatCss = require('gulp-concat-css');
const concatJs = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const util = require('gulp-util');

var production = !!util.env.production;

gulp.task('build', ['pug', 'css', 'js'])

gulp.task('pug', () => {
    gulp.src(['./src/**/*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('css', () => {
    // build CSS
    del(['./dist/assets/css/**/*.css'])
    gulp
        .src('./src/assets/css/**/*.css')
        .pipe(concatCss('bundle.css'))
        .pipe(production ? cleanCSS({ compatibility: 'ie8' }) : util.noop())
        .pipe(gulp.dest('./dist/assets/css'))
})

gulp.task('js', () => {
    // build JS
    del(['./dist/assets/js/**/*.js'])
    gulp
        .src('./src/assets/js/**/*.js')
        .pipe(concatJs('bundle.js'))
        .pipe(production ? uglify() : util.noop())
        .pipe(gulp.dest('./dist/assets/js'))
})
