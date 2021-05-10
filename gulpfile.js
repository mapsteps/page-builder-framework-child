const { src, dest, watch, parallel } = require('gulp');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
var manifest = require('./manifest.json');
var config = manifest.config;

function compileStyleSCSS() {
	return src(['assets/scss/style.scss'])
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(dest('./'))
		.pipe(browserSync.stream());
}

function buildSiteJS() {
	return src([
		'assets/js/*.js'
	])
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(dest('js'))
		.pipe(browserSync.reload({ stream: true }));
}

function serveBrowserSync(cb) {
	browserSync.init({
		proxy: config.url,
		ui: {
			port: 3060,
		},
		notify: true,
	});

	cb();
}

function reloadPage(cb) {
	browserSync.reload();
	cb();
}

function watchChanges(cb) {
	watch(['assets/js/*.js'], parallel(buildSiteJS));

	watch(['assets/scss/style.scss', 'assets/scss/**/*.scss'], parallel(compileStyleSCSS));

	watch(['**/*.php'], parallel(reloadPage));

	cb();
}

function mainTasks(cb) {
	buildSiteJS();
	compileStyleSCSS();

	cb();
}

exports.default = parallel(serveBrowserSync, mainTasks, watchChanges);
