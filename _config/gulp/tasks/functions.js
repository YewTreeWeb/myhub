import notify from 'gulp-notify';
import git from 'gulp-git';

/**
 * Error catch function
 */
export function handleErrors() {
  const args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}

// Create if in array function check.
Array.prototype.contains = function ( needle ) {
  var i;
  for (i in this) {
      if (this[i] === needle) return true;
  }
  return false;
};

/**
 * Git checkout branch
 */
export function gitCheckout(name) {
  let check = Array();
  if (check.contains(`${name}`)) {
    git.checkout(`${name}`, function (err) {
      if (err) throw err;
    });
  } else {
    git.checkout(`${name}`, {args:'-b'}, function (err) {
      if (err) throw err;
      check.push(`${name}`);
    });
  }
}
