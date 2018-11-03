import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import runSequence from 'run-sequence';
import shell from 'shelljs';
import {
  getConfigKeys
} from '../config';
const date = new Date().toISOString().substring(0, 10);

const env = getConfigKeys();

// Run git commit without checking for a message using raw arguments
gulp.task('commit', () => {
  shell.exec('git commit -am "initial commit: ' + date + '" --quiet');
});

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('add', () => {
  shell.exec('git add . &> /dev/null');
});

// Run git pull
// branch is the current branch & remote branch to pull from
gulp.task('pull', () => {
  $.git.pull('origin', (err) => { // Apply branch name to pull. 
    if (err) console.log(err);
  });
});

// Run git push
// branch is the current branch & remote branch to push to
gulp.task('push', () => {
  $.git.push('origin', function (err) {
    if (err) throw err;
  });
});

// Checkout and merge with master.
gulp.task('gitmaster', () => {
  $.git.checkout('master', (err) => {
    if (err) throw err;
  });
  $.git.merge('development', function (err) {
    if (err) throw err;
  });
});

// Checkout dev branch.
gulp.task('gitdev', () => {
  $.git.checkout('development', (err) => {
    if (err) throw err;
  });
});

// Git sequence.
gulp.task('gitget', (cb) => {
  runSequence('add', 'commit', 'pull', cb);
});

gulp.task('gitsend', (cb) => {
  runSequence('add', 'commit', 'push', cb);
});
