/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible for creating multiple tasks,
  each task has been broken out into its own file in gulp/tasks.
  Any files in that directory get automatically required below.
*/

import gulp from 'gulp';
import requireDir from 'require-dir';
import runSequence from 'run-sequence';
import shell from 'shelljs';
import {
  getConfigKeys
} from './_config/gulp/config';
import { gitCheckout } from './_config/gulp/tasks/functions';

const env = getConfigKeys();

requireDir('./_config/gulp/tasks', { recurse: true });

// git commands
gulp.task('gitsend', () => {
  const dateString = new Date().toISOString().substring(0, 10);
  shell.exec('git add . && git commit -am "initial commit ' + dateString + '" && git push');
});

gulp.task('gitdev', () => {
  shell.exec('git checkout development');
});

gulp.task('gitmaster', () => {
  shell.exec('git checkout master && git merge development && git commit -am"merged with development for production" && git push -u origin master');
});

// Run the default gulp task
gulp.task('default', ['serve', 'watch', 'gulpWatch']);

/**
 *
 *  Build.
 * 
 */

// Run pre build tasks
gulp.task('prebuild', (cb) => {
  env.environment = 'production';
  runSequence('clean:site', 'clean:cache', 'copy', 'sass', 'criticalCSS', ['js', 'legacyJS'], ['html', 'xml'], 'images', 'copy:fonts', 'jekyll', cb);
});

// Run the project build
gulp.task('build:test', (cb) => {
  runSequence(gitCheckout('build-testing'), 'prebuild', 'gitsend', 'jekyll:check', 'site:testing', 'gitdev', cb);
});

// Run final build -- runs the pre build task then merges development branch with master
gulp.task('build', (cb) => {
  runSequence('gitmaster', 'prebuild', 'gitsend', cb);
});