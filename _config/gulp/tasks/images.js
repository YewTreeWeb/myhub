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

const settings = {
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
    }),
    imageminWebp({
      quality: 50
    })
  ],
  webp: [
    imageminWebp({
      quality: 50
    })
  ]
}

gulp.task('images', () => {
  gulp.src(paths.imageFilesGlob)
    .pipe($.watch(paths.imageFilesGlob))
    .pipe($.plumber())
    .pipe($.changed(paths.siteAssetsDir + paths.imageFolderName, { hasChanged: $.changed.compareContents }).on('error', handleErrors))
    .pipe($.cache(imagemin(settings.imgMin, {
      verbose: true
    })).on('error', handleErrors))
    .pipe(gulp.dest(paths.siteAssetsDir + paths.imageFolderName + '/'))
    .pipe($.if(env.stream, stream()))
    .pipe(gulp.dest(paths.imageFiles + '/min/'));
});

// gulp.task('webp', () => {
//   gulp.src(paths.imageFilesGlob)
//     .pipe($.plumber())
//     // .pipe($.webp())
//     .pipe($.imagemin(settings.webp, {
//       verbose: true
//     }).on('error', handleErrors))
//     .pipe(gulp.dest(paths.siteAssetsDir + paths.imageFolderName + '/'))
//     .pipe(gulp.dest(paths.imageFiles + '/webp/'));
// });