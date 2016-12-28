'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    browserSync = require('browser-sync');


  gulp.task('css', function () {
      return gulp.src('src/scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
    //   .pipe(autoprefixer('last 4 version'))
      .pipe(gulp.dest('dist/css'))
      .pipe(cssnano())
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.reload({stream:true}));
  });

gulp.task('browser-sync',['css'], function() {
    browserSync.init(null, {
        server: {
            baseDir: "dist"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'browser-sync'], function () {
    gulp.watch("src/scss/*.scss", ['css']);
    gulp.watch("dist/*.html", ['bs-reload']);
});
