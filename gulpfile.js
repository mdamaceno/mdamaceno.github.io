var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('html', () => {
    return gulp.src('./views/pages/*.hbs')
        .pipe(handlebars({}, {
            ignorePartials: true,
            batch: ['./views/partials']
        }))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clear', function() {
    del([
        './dist'
    ]);
});
