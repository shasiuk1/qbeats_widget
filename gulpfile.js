var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var sequence = require('run-sequence');
var cssnano = require('gulp-cssnano');
var del = require('del');

var SRC = "src";
var DEST = "dist";

var errorHandler = function (title) {
  return function (error) {
    gutil.log(gutil.colors.red('[' + title + ']'), error.toString());
    this.emit('end');
  }
};

var clean = function(params) {
  if (typeof params === "string") {
    params = new Array(params);
  }

  return del(params).then(function (paths) {
    console.log('>>> Files and folders that would be deleted:\n', paths.join('\n'));
  });
};

var processSass = function(src, dest) {
  return gulp.src(src)
    .pipe(sass())
      .on('error', errorHandler('Sass Processing Error!'))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cssnano())
    .pipe(gulp.dest(dest));
};

var lintSass  = function(src) {
  return gulp.src(src)
    .pipe(scsslint())
      .on('error', errorHandler('Sass Linting!'));
};

var processJs = function(src, dest) {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-class-properties']
    }))
      .on('error', errorHandler('JS Error!'))
    .pipe(gulp.dest(dest));
};

var processHtml = function(src, dest) {
  return gulp.src(src)
    .on('error', errorHandler('Html Processing Error!'))
    .pipe(gulp.dest(dest));
};

gulp.task('clean', clean.bind(null, DEST + '/'));
gulp.task('process:html', processHtml.bind(null, SRC + '/index.html', DEST));
gulp.task('process:sass', processSass.bind(null, SRC + '/styles/widget.scss', DEST));
gulp.task('lint:sass', lintSass.bind(null, SRC + '/styles/**/*.scss'));
gulp.task('process:js', processJs.bind(null, SRC + '/js/widget.js', DEST));

gulp.task('watch', function() {
  gulp.watch(SRC + '/styles/**/*.scss', ['lint:sass', 'process:sass']);
});

gulp.task('default', ['clean'], function() {
  sequence(
    ['process:html', 'process:sass', 'process:js'],
    'watch'
  )
});
