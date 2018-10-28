import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import shell from 'shelljs';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors
} from './functions';

const env = getConfigKeys();

// gulp jekyll -- runs Jekyll build with development environment
// gulp jekyll --env production -- runs Jekyll build with production settings
gulp.task('jekyll', () => {
  const JEKYLL_ENV = (env.environment === 'production') ? 'JEKYLL_ENV=production' : ''
  const build = (env.environment === 'development') ? 'jekyll build --verbose --config _config.yml,_config.dev.yml' : 'jekyll build';

  shell.exec(JEKYLL_ENV + 'bundle exec ' + build);
});

// gulp jekyll:check -- after production build run tests with html-proofer
gulp.task('jekyll:check', (done) => {
  shell.exec('bundle exec rake test');
  done();
});

