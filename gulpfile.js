const { src, dest, watch, series } = require('gulp'); //Load gulp API
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss'); //Use js plugin
const autoprefixer = require('autoprefixer'); //Add vendor prefix
const cssnano = require('cssnano'); //Minifies css
const babel = require('gulp-babel'); //Transform syntax/Polyfill
const terser = require('gulp-terser'); //Minifies js
const browsersync = require('browser-sync').create(); //Create a browsersync instance

function scssTask() {
  return src('app/scss/style.scss', {sourcemaps: true})
    .pipe( sass() )
    .pipe( postcss([autoprefixer(), cssnano()]) )
    .pipe( dest('dist', {sourcemaps: '.'}) );
}

function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe( babel({ presets: ['@babel/preset-env'] }) )
    .pipe( terser() )
    .pipe( dest('dist', { sourcemaps: '.' }) );
}

function browserSyncServe(cb) {
  // Starts a server
	browsersync.init({
		server: {
			baseDir: '.',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});
	cb();
}

function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

function watchTask() {
	watch('*.html', browserSyncReload);
	watch(
		['app/scss/**/*.scss', 'app/**/*.js'],
		series(scssTask, jsTask, browserSyncReload)
	);
}

exports.default = series( scssTask, jsTask, browserSyncServe, watchTask);