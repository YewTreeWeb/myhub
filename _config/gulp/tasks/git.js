import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import runSequence from 'run-sequence';
import notifier from 'node-notifier';
import shell from 'shelljs';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';

const cron = require('node-cron');

const env = getConfigKeys();

const endTasks = [{
  name: 'styles'
}, {
  name: 'js'
}, {
  name: 'images'
}, {
  name: 'fonts'
}, {
  name: 'clean'
}, {
  name: 'build'
}];

// Run git commit without checking for a message using raw arguments
gulp.task('commit', () => {
  shell.exec('git commit -m "initial commit: ' + date);
  // return gulp.src(paths.assetsDir + paths.allPattern)
  //   .pipe($.git.commit(undefined, {
  //     args: '-m "initial commit: "' + date,
  //     disableMessageRequirement: true
  //   }));
});

// Run git add
// src is the file(s) to add (or ./*)
gulp.task('add', () => {
  shell.exec('git add .');
  // return gulp.src('.' + paths.allPattern)
  //   .pipe($.plumber())
  //   .pipe($.git.add());
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

// Tag the repo with a version
const getTagMessage = () => {
  const dateString = new Date().toISOString().substring(0, 10);
  const tagMessage = `${dateString}: Tag for env: ${env}`;
  return tagMessage;
};

gulp.task('git-tag', (cb) => {
  if (env.environment === 'development') {
    const randomHash = Math.random().toString(36).substring(7).substring(0, 8);
    $.git.tag(`${env}.${randomHash}`, getTagMessage(), function (error) {
      if (error) {
        return cb(error);
      }
      $.git.push('origin', {
        args: '--tags'
      }, cb);
    });
  }
});

// Run node cron to remind user to perform a git commit.
cron.schedule('0 */15 * * * *', (err) => {
  if (err) throw err;

  const action = 'Let\'s do it';
  notifier.notify({
    title: 'Git',
    message: 'You\'re doing a great job! Let\'s not hide it, why not do a git commit and show everyone?',
    sound: 'Funk',
    closeLabel: 'No thanks I\'ll do it later.',
    actions: action
  }, function(err, response, metadata) {
    if (err) throw err;

    if (metadata.activationValue !== action) {
      return; // No need to continue
    }

    notifier.notify(
      {
        title: 'Commit Message',
        message: 'What commit message would you like to put?',
        sound: 'Funk',
        // case sensitive
        reply: true
      },
      function(err, response, metadata) {
        if (err) throw err;
        
        shell.exec('git add . && git commit -am"' + metadata.activationValue + '" && git push');
      }
    );
    
  });
});

// If project isn't set to team then set a cron job to run git every two hours.
if (env.project === false) {
  cron.schedule('0 0 */2 * * *', (err) => {
    if (err) throw err;
    console.log('\nGit Cron Started\n');
    gulp.start('gitsend');
    console.log('\nGit Cron Finished\n');
  });
}

gulp.task('notify', () => {
  const action = 'Let\'s do it';
  notifier.notify({
    title: 'Git',
    message: 'You\'re doing a great job! Let\'s not hide it, why not do a git commit and show everyone?',
    sound: 'Funk',
    closeLabel: 'No thanks I\'ll do it later.',
    actions: action
  }, function(err, response, metadata) {
    if (err) throw err;

    if (metadata.activationValue !== action) {
      return; // No need to continue
    }

    notifier.notify(
      {
        title: 'Commit Message',
        message: 'What commit message would you like to put?',
        sound: 'Funk',
        // case sensitive
        reply: true
      },
      function(err, response, metadata) {
        if (err) throw err;
        
        shell.exec('git add . && git commit -am"' + metadata.activationValue + '" && git push');
      }
    );
    
  });
});