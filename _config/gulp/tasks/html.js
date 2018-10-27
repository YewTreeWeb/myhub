import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors
} from './functions';

const env = getConfigKeys();

const settings = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: false,
  removeAttributeQuotes: false,
  removeRedundantAttributes: false,
  minifyJS: true,
  minifyCSS: true
}

// minifies and gzips HTML files for production
gulp.task('html', () => {
  return gulp.src(paths.siteHtmlFilesGlob)
    .pipe($.plumber())
    .pipe($.htmlAutoprefixer())
    .pipe($.if(env.minify, htmlmin(settings).on('error', handleErrors)))
    .pipe(size({
      title: 'optimized HTML'
    }))
    .pipe(gulp.dest(paths.siteFolderName));
});


// Minifies XML and JSON files for production
gulp.task('xml', () => {
  return gulp.src(paths.xmlFilesGlob)
    .pipe($.plumber())
    .pipe($.prettyData({
      type: 'minify',
      preserveComments: true
    }).on('error', handleErrors))
    .pipe(size({
      title: 'optimized XML'
    }))
    .pipe(gulp.dest(paths.siteFolderName));
});
