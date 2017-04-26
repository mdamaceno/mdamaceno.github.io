var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var concatCss = require('gulp-concat-css');
var concatJs = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var util = require('gulp-util');
var del = require('del');
var webserver = require('gulp-webserver');

var production = !!util.env.production;

gulp.task('webserver', () => {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: false
        }));
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

gulp.task('html', () => {
    // build HTML
    del(['./dist/**/*.html'])
    gulp
        .src('./src/*.hbs')
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: ['./src/partials']
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('./src/assets/css/**/*.css', ['css']);
    gulp.watch('./src/assets/js/**/*.js', ['js']);
    gulp.watch('./src/**/*.hbs', ['html']);
})

gulp.task('default', ['css', 'js', 'html', 'webserver', 'watch']);

gulp.task('clear', function() {
    del([
        './dist/*'
    ]);
});
