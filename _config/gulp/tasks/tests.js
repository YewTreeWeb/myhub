import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import shell from 'shelljs';
import runSequence from 'run-sequence';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors
} from './functions';

/**
 * Task: accessibility-test
 *
 * Runs the accessibility test against WCAG standards.
 *
 * Tests we're ignoring and why:
 *   1. WCAG2A.Principle1.Guideline1_3.1_3_1.H49.I: it's common practice (and,
 *   arguably, more semantic) to use <i> for icons.
 *   2. WCAG2A.Principle1.Guideline1_3.1_3_1.H48: This is throwing a false
 *   positive. We have marked up our menus as unordered lists.
 *   3. WCAG2A.Principle1.Guideline1_3.1_3_1.H49.AlignAttr: Sadly, we must
 *   ignore this test if we are to use our emoji plugin.
 *   4. WCAG2A.Principle1.Guideline1_3.1_3_1.H73.3.NoSummary: We can't use
 *   table summaries in kramdown in our blog posts.
 *   5. WCAG2A.Principle1.Guideline1_3.1_3_1.H39.3.NoCaption: We can't use
 *   table captions in kramdown in our blog posts.
 *   6. WCAG2A.Principle1.Guideline1_3.1_3_1.H42: This throws a lot of false
 *   positives for text that should not be headings.
 *
 * We're also skipping redirect pages like /news/* and /team/*.
 */
gulp.task('accessibility', () => {
  return gulp.src(paths.htmlTestFiles)
    .pipe($.plumber())
    .pipe($.accessibility({
      force: false,
      accessibilityLevel: 'WCAG2A',
      reportLevels: {
        notice: true,
        warning: true,
        error: true
      },
      ignore: [
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H49.I',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H48',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H49.AlignAttr',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H73.3.NoSummary',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H39.3.NoCaption',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H42'
      ]
    }))
    .on('error', handleErrors)
    .pipe($.accessibility.report({
      reportType: 'txt'
    }))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(gulp.dest('reports/accessibility'))
    .pipe($.notify("Accessibility test finished. Please view the generated report."));
});

// Markdown linting
gulp.task('markdown', () => {
  shell.exec('bundle exec mdl . -c .mdlrc --git-recurse');
});

// Sass linting
gulp.task('sass:lint', ['sass'], () => {
  return gulp.src([paths.scssFilesGlob, paths.sassFilesGlob])
    .pipe($.plumber())
    .pipe($.sassLint({
      config: '.sass-lint.yml'
    }))
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
    .pipe($.bemlinter())
    .pipe($.bemlinter.format())
    .pipe($.bemlinter.failOnError());
});

// JavaScript Linting
gulp.task('js:lint', ['js'], () => {
  return gulp.src(paths.jsFilesGlob)
    .pipe($.plumber())
    .pipe($.if(env.lint, $.jscs({
      fix: true
    })))
    .pipe($.if(env.lint, $.jscs.reporter()))
    .pipe($.if(env.lint, $.jscs.reporter('fail')))
    .pipe($.if(env.lint, $.eslint()))
    .pipe($.if(env.lint, $.eslint.format()))
    .pipe($.if(env.lint, $.eslint.failOnError()));
});

gulp.task('site:testing', (cb) => {
  runSequence('sass:lint', 'js:lint', 'accessibility', 'markdown', cb);
});
