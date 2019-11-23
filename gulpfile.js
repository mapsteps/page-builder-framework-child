var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var manifest = require('./assets/manifest.json');
var config = manifest.config;

// Scripts task.
gulp.task('scripts', function() {
	gulp.src('assets/js/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(gulp.dest('js'))
	.pipe(reload({ stream: true }))
});

// Styles task.
gulp.task('styles', function() {
	return gulp.src('assets/scss/style.scss')
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(gulp.dest(''))
	.pipe(reload({ stream: true }))
});

// Browsersync.
gulp.task('serve', function() {
	browserSync.init( {
		proxy: "http://" + config.url,
		host: config.host,
		notify: false,
	});
});

// Watch tasks.
gulp.task('watch', function() {
	// Scripts & styles.
	gulp.watch('assets/js/*.js', ['scripts']);
	gulp.watch('assets/scss/**/*.scss', ['styles']);
	// Browsersync.
	gulp.watch('**/*.php').on('change', reload);
});

// Gulp.
gulp.task('default', ['scripts', 'styles', 'watch', 'serve']);
