'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');

//  Clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/**/*.scss", ['sass']);
    gulp.watch("app/js/**/*.js").on('change', browserSync.reload);;
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./app/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("./app/css"))
        .pipe(browserSync.stream());
});


// html build
gulp.task('html', ['clean'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});

// final build
gulp.task('build', ['clean', 'html'], function () {
    
    // css
    gulp.src(['./dist/css/*.css'])
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))

    // js
    gulp.src(['./dist/js/*.js'])
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js'))
    
    // everything else
    gulp.src(['./app/*.json'])
        .pipe(gulp.dest('dist'))
    gulp.src(['./app/img/**'])
        .pipe(gulp.dest('dist/img'))
    gulp.src(['./app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task('default', ['serve']);

gulp.task('run', ['build'],  function() {
    browserSync.init({
        server: "./dist"
    });
});
