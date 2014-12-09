'use strict';

/**
 * Dependencies
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
    return gulp.src(['test/test-*.js'], { read: false })
        .pipe(mocha({
            reporter: 'dot',
            globals: {
                chai: require('chai')
            }
        }));
});

gulp.task('watch-test', function() {
    gulp.watch(['generators/**', 'test/**'], ['test']);
});

gulp.task('default', ['test']);
