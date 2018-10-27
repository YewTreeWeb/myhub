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
import {
  errorHandler,
  getConfigKeys
} from './_config/gulp/config';
import { gitCheckout } from './_config/gulp/tasks/functions';

const env = getConfigKeys();

requireDir('./_config/gulp/tasks', { recurse: true });

// Run the default gulp task
gulp.task('default', ['gitRemind', 'gitCron', 'serve']);

/**
 *
 *  Build.
 * 
 */

// Run pre build tasks
gulp.task('prebuild', (cb) => {
  env.environment = 'production';
  runSequence('gitget', 'clean:site', 'clean:cache', 'copy', 'sass', 'criticalCSS', ['js', 'legacyJS'], ['html', 'xml'], 'images', 'copy:fonts', 'jekyll', cb);
});

// Run the project build
gulp.task('build:test', (cb) => {
  runSequence(gitCheckout('build-testing'), 'prebuild', 'gitsend', 'jekyll:check', 'site:testing', 'gitdev', cb);
});

// Run final build -- runs the pre build task then merges development branch with master
gulp.task('build', (cb) => {
  runSequence('prebuild', 'gitmaster', 'gitsend', cb);
});