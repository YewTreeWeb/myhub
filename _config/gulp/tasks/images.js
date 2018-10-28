import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import imageminPngquant from 'imagemin-pngquant';
import imageminZopfli from 'imagemin-zopfli';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGiflossy from 'imagemin-giflossy';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import runSequence from 'run-sequence';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import { handleErrors } from './functions';

// Reload Browser
const browserSync = require('browser-sync').create();
const stream = browserSync.stream;

const env = getConfigKeys();
const mode = (env.environment === 'development') ? 'development' : 'production';

const settings = {
  src: [
    paths.imageFiles + '/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|tif|TIF)',
    '!' + paths.imageFiles + '/origin/*'
  ],
  imgMin: [
    imageminPngquant({
      speed: 1,
      quality: 98 // lossy settings
    }),
    imageminZopfli({
      more: true
    }),
    imageminGiflossy({
      optimizationLevel: 3,
      optimize: 3, // keep-empty: Preserve empty transparent frames
      lossy: 2
    }),
    $.imagemin.svgo({
      plugins: [{
          removeViewBox: true
        },
        {
          cleanupIDs: true
        }
      ]
    }),
    $.imagemin.jpegtran({
      progressive: true
    }),
    imageminMozjpeg({
      quality: 90
    })
  ]
};

gulp.task('images:optimise', () => {
  gulp.src(settings.src)
    .pipe($.plumber())
    .pipe($.changed(paths.jekyllAssetsDir + paths.imageFolderName, { hasChanged: $.changed.compareContents }).on('error', handleErrors))
    .pipe($.cache($.imagemin(settings.imgMin, {
      verbose: true
    })).on('error', handleErrors))
    .pipe($.if(mode === 'development', gulp.dest(paths.siteAssetsDir + paths.imageFolderName + '/')))
    .pipe(gulp.dest(paths.jekyllAssetsDir + paths.imageFolderName))
    .pipe(gulp.dest(paths.imageFiles))
    .pipe($.if(env.stream, stream()));
});

gulp.task('images:webp', () => {
  gulp.src(settings.src)
    .pipe($.plumber())
    .pipe($.changed(paths.jekyllAssetsDir + paths.imageFolderName, { hasChanged: $.changed.compareContents }).on('error', handleErrors))
    .pipe($.cache($.webp()).on('error', handleErrors))
    .pipe($.if(mode === 'development', gulp.dest(paths.siteAssetsDir + paths.imageFolderName + '/')))
    .pipe(gulp.dest(paths.jekyllAssetsDir + paths.imageFolderName))
    .pipe(gulp.dest(paths.imageFiles))
    .pipe($.if(env.stream, stream()));
});

gulp.task('images', (cb) => {
  runSequence('copy:images', 'images:optimise', 'images:webp', cb);
});