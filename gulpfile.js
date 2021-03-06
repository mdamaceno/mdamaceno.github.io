const gulp = require('gulp')
const pug = require('gulp-pug')
const del = require('del')
const concatCss = require('gulp-concat-css')
const concatJs = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const util = require('gulp-util')
const webserver = require('gulp-webserver')
const rename = require('gulp-rename')
const sass = require('gulp-sass');

var production = !!util.env.production

gulp.task('build', ['pug', 'fonts', 'sass', 'js', 'images'])

gulp.task('pug', () => {
    gulp.src(['./src/!(_)*.pug'])
        .pipe(pug({
            pretty: !production
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('fonts', () => {
    del(['./dist/assets/fonts/**/*'])
    gulp.src([
            './src/assets/bower_components/font-awesome/fonts/**/*'
        ])
        .pipe(gulp.dest('./dist/font-awesome/fonts'))
})

gulp.task('sass', () => {
    // build CSS
    del(['./dist/assets/css/**/*.css'])
    gulp
        .src([
            './src/assets/bower_components/skeleton/css/normalize.css',
            './src/assets/bower_components/skeleton/css/skeleton.css',
            './src/assets/bower_components/font-awesome/css/font-awesome.css',
            './src/assets/sass/**/*.scss'
        ])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concatCss('bundle.css'))
        .pipe(production ? cleanCSS({ compatibility: 'ie8' }) : util.noop())
        .pipe(gulp.dest('./dist/assets/css'))
})

gulp.task('js', () => {
    // build JS
    del(['./dist/assets/js/**/*.js'])
    gulp
        .src([
            './src/assets/js/**/*.js'
        ])
        .pipe(concatJs('bundle.js'))
        .pipe(production ? uglify() : util.noop())
        .pipe(gulp.dest('./dist/assets/js'))
})

gulp.task('images', () => {
    // Copy images
    del(['./dist/assets/images/**/*.{jpg,jpeg,png,webp,svg}'])
    gulp
        .src([
            './src/assets/images/**/*.{jpg,jpeg,png,webp,svg}'
        ])
        .pipe(gulp.dest('./dist/assets/images'))
})

gulp.task('webserver', function() {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: false,
            port: 8080
        }))
})

gulp.task('watch', () => {
    gulp.watch('src/assets/js/**/*.js', ['js'])
    gulp.watch('src/assets/sass/**/*.scss', ['sass'])
    gulp.watch('src/**/*.pug', ['pug'])
    gulp.watch('src/images/**/*.{jpg,jpeg,png,webp,svg}', ['images'])
})

gulp.task('default', ['sass', 'js', 'pug', 'fonts', 'images', 'webserver', 'watch'])
