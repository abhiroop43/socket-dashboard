// Dependencies
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//Download this bootstrap theme https://bootswatch.com/flatly/bootstrap.min.css and replace in lib/bootstrap/dist/css//

var paths = {
    index: './view/index.html',
    sources: [
        './app/app.js',
        './app/services/uacacc-service.js',
        './app/controllers/zone-controller.js',
        './app/controllers/parking-space-controller.js',
        './app/controllers/zone-info-controller.js'
    ],
    jsDest: './dist/scripts',
    cssDest: './dist/styles'
};

gulp.task('concat-scripts', function () {
    return gulp.src(paths.sources)
        .pipe(concat('custom-scripts.js'))
        .pipe(rename('custom-scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task('inject-vendor', function () {
    return gulp.src(paths.index)
        .pipe(wiredep({
            ignorePath: '..'
        }))
        .pipe(gulp.dest('./view'));
});

gulp.task('inject-own', function () {
    return gulp.src(paths.index)
        .pipe(inject(gulp.src(paths.sources, { read: false })))
        .pipe(gulp.dest('./view'));
});

// Task
gulp.task('default', function () {

    // listen for changes
    livereload.listen();
    // configure nodemon
    nodemon({
        // the script to run the app
        script: 'app.js',
        ext: 'js'
    }).on('restart', function () {
        // when the app has restarted, run livereload.
        gulp.src('app.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    })
});

gulp.task('serve', function () {
    runSequence('inject-vendor', 'inject-own', 'default');
});