import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import runSequence from 'run-sequence';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors
} from './functions';

// Reload Browser
const browserSync = require('browser-sync').create();

const env = getConfigKeys();

const settings = {
  jekyllWatch: [
    '*.html',
    '*.+(md|MD|markdown|MARKDOWN)',
    '_pages/*',
    '_posts/*',
    '_data/*',
    '_layouts/*.html',
    '_includes/*.html',
    '_config.yml',
    '_config.dev.yml',
    '!' + paths.includeFoldeName + '/scripts-dev.+(html|md|MD|markdown|MARKDOWN)'
  ]
};

const syncOptions = {
  files: ['_site' + '/**'],
  port: env.port, // change port to match default Jekyll
  ui: {
    port: env.port + 1
  },
  server: {
    baseDir: '_site'
  },
  ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
  logFileChanges: (env.debug) ? true : false,
  logLevel: (env.debug) ? 'debug' : '',
  injectChanges: true,
  notify: env.notify,
  open: env.open // Toggle to automatically open page when starting.
};

gulp.task('serve', ['jekyll'], () => {
  browserSync.init(syncOptions);

  // gulp.watch([paths.scssFilesGlob, paths.sassFilesGlob], ['sass']);
  // gulp.watch(paths.jsFilesGlob, ['js']);
  // gulp.watch(paths.imageFilesGlob, ['images']);
  // gulp.watch(paths.includeFoldeName + '/scripts-dev.+(html|md)', ['copy:scriptsfile']);
  gulp.watch(settings.jekyllWatch, ['jekyll-rebuild']);
  gulp.start('gulpWatch');
});

gulp.task('jekyll-rebuild', ['jekyll'], () => {
  browserSync.reload();
});

gulp.task('stylesWatch', (done) => {
  return $.watch([paths.scssFilesGlob, paths.sassFilesGlob], function () {
    gulp.start('styles');
    done();
  });
});

gulp.task('scriptsWatch', (done) => {
  return $.watch(paths.jsFilesGlob, function () {
    gulp.start('scripts');
    done();
  });
});

gulp.task('imagesWatch', (done) => {
  return $.watch(paths.imageFilesGlob, function () {
    gulp.start('image:optimise');
    done();
  });
});

gulp.task('gulpWatch', ['stylesWatch', 'scriptsWatch', 'imagesWatch']);