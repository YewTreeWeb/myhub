import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import {
  getConfigKeys
} from '../config';
import paths from '../paths';

import runSequence from 'run-sequence';

// Reload Browser
const browserSync = require('browser-sync').create();

const env = getConfigKeys();

const settings = {
  jekyllWatch: [
    '*.html',
    '*.+(md|MD|markdown|MARKDOWN)',
    '_config.yml',
    '_config.dev.yml',
    '_*/*.+(html|json|JSON|yml|yaml|md|MD|markdown|MARKDOWN)',
    '!_site/**/*',
    '!' + paths.includeFoldeName + '/scripts-dev.+(html|md|MD|markdown|MARKDOWN)'
  ]
};

const syncOptions = {
  port: env.port, // change port to match default Jekyll
  ui: {
    port: env.port + 1
  },
  server: {
    baseDir: '_site'
  },
  files: '_site/**/*',
  logFileChanges: (env.debug) ? true : false,
  logLevel: (env.debug) ? 'debug' : '',
  notify: env.notify,
  open: env.open // Toggle to automatically open page when starting.
};

gulp.task('serve', ['sass', 'js', 'jekyll'], () => {
  browserSync.init(syncOptions);
});

gulp.task('watch:fonts', () => {
  return $.watch(paths.fontFiles + '/**/*', () => {
    gulp.start('reload:fonts');
  });
});

gulp.task('watch:jsVendors', () => {
  return $.watch(paths.vendorFiles + paths.jsPattern, () => {
    gulp.start('copy:jsVendors');
  });
});

gulp.task('watch:cssVendors', () => {
  return $.watch(paths.cssVendorFiles + paths.cssPattern, () => {
    gulp.start('copy:cssVendors');
  });
});

gulp.task('watch:images', () => {
  return $.watch(paths.imageFilesGlob, () => {
    gulp.start('reload:images');
  });
});

// gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:fonts', 'watch:images', 'watch:scriptsfile', 'watch:jekyll']);

gulp.task('watch', () => {
  gulp.watch([paths.scssFilesGlob, paths.sassFilesGlob], ['sass']);
  gulp.watch(paths.fontFiles + '**/*', ['reload:fonts']);
  gulp.watch(paths.jsFilesGlob, ['reload:js']);
  gulp.watch(paths.imageFilesGlob, ['reload:images']);
  gulp.watch(paths.includeFoldeName + '/scripts-dev.+(html|md|MD|markdown|MARKDOWN)', ['copy:scriptsfile']);
  gulp.watch(settings.jekyllWatch, ['jekyll-rebuild']);
});

gulp.task('gulpWatch', (cb) => {
  runSequence(['watch:fonts', 'watch:jsVendors', 'watch:cssVendors', 'watch:images'], cb);
});

/**
 * Reload tasks
 */

// Fonts
gulp.task('reload:fonts', ['copy:fonts'], (done) => {
  browserSync.reload();
  done();
});
// JS
gulp.task('reload:js', ['js'], (done) => {
  browserSync.reload();
  done();
});
// Images
gulp.task('reload:images', ['images'], (done) => {
  browserSync.reload();
  done();
});
// Jekyll
gulp.task('jekyll-rebuild', ['jekyll'], (done) => {
  browserSync.reload();
  done();
});