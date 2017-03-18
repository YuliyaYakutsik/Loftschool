const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');

/* ------ Конфигурация и настройка сборки  -------- */
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Пути к нашим внешним плагинам и библиотекам javascript
var vendorJs = [
  'app/bower/jquery/dist/jquery.min.js', 
  ];
// Пути к нашим внешним плагинам и библиотекам css
var vendorCss = [
  'app/bower/normalize-css/normalize.css', 
  ];

// Запускаем сервер. Предварительно выполнив задачи ['html', 'styles', 'images',
// 'buildJs', 'vendor-js'] Сервер наблюдает за папкой "./dist". Здесь же
gulp.task('browser-sync', [
  'html',
  'styles',
  'images',
  'build:js',
  'fonts'
], function () {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
// наблюдаем и обновляем страничку
  browserSync.watch([
    './dist/**/*.*', '!**/*.css'
  ], browserSync.reload);
});

// перенос страничек
gulp.task('html', function(){
  return gulp.src('app/pages/**/*.*')
    .pipe(gulp.dest('dist'));
});

// перенос шрифтов
gulp.task('fonts', function(){
  return gulp.src('app/usedfonts/**/*.*')
    .pipe(gulp.dest('dist/usedfonts'));
});

// перенос и оптимизация картинок
gulp.task('images', function () {
  return gulp
    .src('app/pictures/**/*.{png,svg,jpg}')
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/pictures/'));
});

// Style
gulp.task('styles', function(){
  return gulp.src(['app/css/main.scss'])
  .pipe(plumber({
    errorHandler: notify.onError(function (err) {
      return {title: 'Style', message: err.message}
    })
  }))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(sass())
  .pipe(autoprefixer('last 2 versions'))
  .pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
});

//Модули javascript. С минификацией и переносом
gulp.task('build:js', function () {
  return gulp
    .src("app/js/main.js")
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: 'javaScript', message: err.message}
      })
    }))
    .pipe(gulp.dest('dist/js'));
});

/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', function () {
  return gulp
    .src(vendorJs)
    .pipe(gulp.dest('dist/js'));
});
/* -------- Объединение всех стилей подключаемых плагинов в один файл -------- */
gulp.task('vendor:css', function () {
  return gulp
    .src(vendorCss)
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function () {
  gulp.watch("app/pages/**/*.html", ['html']);
  gulp.watch("app/css/**/*.scss", ['styles']);
  gulp.watch("app/js/**/*.js", ['build:js']);
  gulp.watch("app/pictures/**/*.*", ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);

// Очистка папки dist
gulp.task('clean', function () {
  return del(['dist'], {force: true}).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});

// Выполнить билд проекта
gulp.task('build', function (callback) {
  runSequence(['clean'], [
    'html',
    'styles',
    'images',
    'build:js',
    'vendor:js',
    'vendor:css',
    'fonts'
  ], callback);
});