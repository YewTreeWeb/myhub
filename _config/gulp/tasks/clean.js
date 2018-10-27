import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import del from 'del';
import runSequence from 'run-sequence';
import inquirer from 'inquirer';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors,
  gitCheckout
} from './functions';

const env = getConfigKeys();

// gulp clean:assets deletes all SCSS, Sass, CSS, JS assets
gulp.task('clean:assets', () => {
  return del([paths.sassFiles + '/**/*', paths.cssFiles + '/**/*', paths.jsFiles + '/**/*']);
});

// gulp clean:fonts removes all fonts
gulp.task('clean:fonts', () => {
  return del(paths.fontFiles + '/**/*');
});

// gulp clean:images delete all site images
gulp.task('clean:images', () => {
  return del(paths.imageFilesGlob);
});

// gulp clean:cache deletes all cache
gulp.task('clean:cache', () => {
  $.cache.clearAll();
});

// gulp clean:site removes files within _site
gulp.task('clean:site', () => {
  return del(paths.siteDir + '/**/*');
});

// gulp clean:layouts deletes all layout files
gulp.task('clean:layouts', () => {
  return del(paths.assetsDir + paths.layoutFoldeName + '/**/*');
});

// gulp clean:pages deletes all pages within _pages folder
gulp.task('clean:pages', () => {
  return del(paths.assetsDir + paths.pageFolderName + '/**/*');
});

// gulp clean:posts deletes all posts
gulp.task('clean:posts', () => {
  return del(paths.mdFilesGlob);
});

// gulp clean:includes deletes all files within _includes folder
gulp.task('clean:includes', () => {
  return del(paths.assetsDir + paths.includeFolderName + '/**/*');
});

// gulp clean:data remove all files within the _data folder
gulp.task('clean:data', () => {
  return del(paths.dataFiles + '/**/*');
});

// gulp clean:md delete all site markdown files
gulp.task('clean:md', () => {
  return del('.' + paths.markdownPattern);
});

// gulp clean:site removes files within _site
const purgecheck = {
  type: 'confirm',
  message: 'Do you really want to delete all files for this project? Be careful as this cannot be undone!',
  default: true,
  name: 'delete'
};
gulp.task('clean', ['gitget'], (callback) => {
  inquirer.prompt([purgecheck])
    .then(answers => {
      if (answers.delete) {
        runSequence(gitCheckout('restart'), 'clean:assets', 'clean:fonts', 'clean:images', 'clean:site', 'clean:layouts', 'clean:pages', 'clean:posts', 'clean:includes', 'clean:data', 'clean:md', 'clean:cache', 'gitsend', callback);
        done();
      } else {
        console.log('\nPurge aborted... phewww that was a close one!\n'); // Callback message.
      }
    });
});
