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
import pkg from '../../../package.json';
import modernizr from 'modernizr';
import modernizrConfig from '../../../modernizr-config.json';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import through from 'through2';
import runSequence from 'run-sequence';
import {
  handleErrors
} from './functions';

// Reload Browser
const browserSync = require('browser-sync').create();
const stream = browserSync.stream();

const env = getConfigKeys();

const mode = (env.environment === 'development') ? 'development' : 'production';
const jversion = pkg.dependencies.jquery;
const modernizrVersion = pkg.dependencies.modernizr;

let versions = [jversion, modernizrVersion];
versions = versions.map(version => {
  return version.replace(/(~|\^)/g, '');
});

const webpackConfig = {
  mode: mode,
  entry: {
    main: './' + paths.jsFiles + '/kubix.js'
  },
  output: {
    filename: 'kubix.js'
  },
  module: {
    rules: [{
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
          'babel-preset-env'
        ].map(require.resolve)
      }
    }]
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: 'source-map'
};

const settings = {
  scripts: [
    paths.jsFilesGlob,
    '!' + paths.vendorFiles + '/**/*'
  ]
}

gulp.task('js', () => {
  return gulp.src(settings.scripts)
    .pipe($.plumber())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe($.if(env.sourcemaps, $.sourcemaps.init({
      loadMaps: true
    }))) // Start sourcemap.
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.if(env.minify, $.uglify({
      preserveComments: 'some'
    })))
    .pipe($.if(env.minify, $.rename({
      suffix: '.min'
    })))
    .pipe($.if(env.sourcemaps, through.obj(function (file, enc, cb) {
      // Dont pipe through any source map files as it will be handled
      // by gulp-sourcemaps
      const isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) this.push(file);
      cb();
    })))
    .pipe($.if(env.sourcemaps, $.sourcemaps.write('.'))) // Create the sourcemap.
    .pipe(gulp.dest(paths.siteAssetsDir + paths.scriptFolderName))
    .pipe($.if(env.sync, stream))
    .pipe($.size({
      showFiles: true
    }))
    .pipe(gulp.dest('./' + paths.jekyllAssetsDir + paths.scriptFolderName));
});

gulp.task('legacyJS', () => {
  return gulp.src(config.legacyJS)
    .pipe($.plumber())
    .pipe($.changed(paths.siteAssetsDir + paths.scriptFolderName + '/legacy', {
      hasChanged: $.changed.compareContents
    }).on('error', handleErrors))
    .pipe($.concat('legacy.min.js').on('error', handleErrors))
    .pipe($.uglify().on('error', handleErrors))
    .pipe($.size({
      showFiles: true
    }))
    .pipe(gulp.dest('./' + paths.jekyllAssetsDir + paths.scriptFolderName + '/legacy'));
});

gulp.task('scripts', (cb) => {
  if (env.project) {
    runSequence('gitget', 'js', 'gitsend', cb);
  } else {
    gulp.start('js');
    cb();
  }
});

// Build Modernizr script
gulp.task('modernizr', (done) => {
  modernizr.build(modernizrConfig, (code) => {
    fs.writeFile(`${paths.vendorFiles}/modernizr-${versions[1]}.min.js`, code, done);
  });
});

// Concat vendor scripts into one
gulp.task('jsVendors', () => {
  const vendors = [
    paths.vendorFiles + '/**/*',
    '!' + `jquery-${versions[0]}.min.js`,
    '!' + `modernizr-${versions[1]}.min.js`,
    '!html5shiv.min.js'
  ];

  return gulp.src(vendors)
    .pipe($.plumber())
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(paths.vendorFiles));
});