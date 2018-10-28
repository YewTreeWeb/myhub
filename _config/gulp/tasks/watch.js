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
  // gulp.watch(settings.jekyllWatch, ['jekyll-rebuild']);
  gulp.start('watch');
});

gulp.task('watch:scriptsfile', () => {
  return $.watch(paths.includeFoldeName + '/scripts-dev.+(html|md|MD|markdown|MARKDOWN)', () => {
    gulp.start('copy:scriptsfile');
  });
});

gulp.task('watch:jekyll', () => {
  return $.watch(settings.jekyllWatch, () => {
    gulp.start('jekyll-rebuild');
  });
});

gulp.task('watch:fonts', () => {
  return $.watch(paths.fontFiles + '/**/*', {
    base: '.'
  })
    .pipe(gulp.dest(paths.siteAssetsDir + paths.fontFolderName))
    .pipe($.size({
      title: 'fonts'
    }));
});

gulp.task('watch:styles', () => {
  return $.watch([paths.scssFilesGlob, paths.sassFilesGlob], () => {
    gulp.start('sass');
  });
});

gulp.task('watch:scripts', () => {
  return $.watch(paths.jsFilesGlob, () => {
    gulp.start('js');
  });
});

gulp.task('watch:images', () => {
  return $.watch(paths.imageFilesGlob, () => {
    gulp.start('images');
  });
});

gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:fonts', 'watch:images', 'watch:scriptsfile', 'watch:jekyll']);

gulp.task('jekyll-rebuild', ['jekyll'], () => {
  browserSync.reload();
});