import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  rename: {
    'gulp-sass-lint': 'sassLint',
    'gulp-group-css-media-queries': 'gcmq',
    'gulp-sass-glob': 'sassGlob'
  },
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import autoprefixer from 'autoprefixer';
import rucksack from 'rucksack-css';
import {
  getConfigKeys
} from '../config';
import paths from '../paths';
import { handleErrors } from './functions';

// Reload Browser
const browserSync = require('browser-sync').create();
const stream = browserSync.stream;

const env = getConfigKeys();

const settings = {
  sassSrc: [
    paths.sassFiles + '/main.scss',
    paths.sassFiles + '/main.sass'
  ],
  fallbacks: true
};

const prefixer = {
  browsers: [
    'last 15 versions',
    '>1%',
    'ie >= 11',
    'ie_mob >= 10',
    'firefox >= 30',
    'Firefox ESR',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 9',
    'android >= 4.4',
    'bb >= 10'
  ],
  grid: true,
  cascade: false
};

const cssimport = {
  matchPattern: "*.css" // process only css
};

const criticalPages = [{
  url: 'http://localhost:4000/index.html',
  name: 'index'
}];

gulp.task('sass', () => {
  return gulp.src(settings.sassSrc)
    .pipe($.plumber())
    .pipe($.if(env.sourcemaps, $.sourcemaps.init()))
    .pipe($.cssimport(cssimport)) // Parses a CSS file, finds imports, grabs the content of the linked file and replaces the import statement with it.
    .pipe($.sassGlob())
    .pipe($.sass({
      errLogToConsole: true,
      outputStyle: 'nested'
    }).on('error', handleErrors))
    .pipe($.postcss([
      rucksack(settings.fallbacks),
      autoprefixer(prefixer)
    ]))
    .pipe($.gcmq())
    .pipe($.csscomb())
    .pipe($.if(env.purge, $.purgecss({
      content: ['**/*.html'],
      fontFace: false,
      rejected: false
    })))
    .pipe($.if(env.sourcemaps, $.sourcemaps.write('.')))
    .pipe($.if(env.minify, $.uglifycss()))
    .pipe($.if(env.minify, $.rename({
      suffix: '.min'
    })))
    .pipe(gulp.dest(paths.siteAssetsDir + paths.cssFolderName))
    .pipe(gulp.dest(paths.jekyllAssetsDir + paths.cssFolderName))
    .pipe($.if(env.sync, stream()));
});

gulp.task('criticalCSS', () => {
  criticalPages.map((page) => {
    return gulp.src(paths.cssFiles + '/main.css')
      .pipe($.plumber())
      .pipe($.penthouse({
        out: page.name + '.css',
        url: page.url,
        width: 1920,
        height: 1080,
        userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' // pretend to be googlebot when grabbing critical page styles.
      }).on('error', handleErrors))
      .pipe($.uglifycss())
      .pipe(gulp.dest(paths.siteAssetsDir + paths.cssFolderName + '/critical'))
      .pipe(gulp.dest(paths.includeFoldeName + '/critical'))
      .pipe($.size({
        showFiles: true
      }));
  });
});