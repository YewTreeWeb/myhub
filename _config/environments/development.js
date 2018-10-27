module.exports = {

  /**
   * Project Type
   * 
   * Set the type of project, whether it will be worked on by a team or an indivual.
   * 
   * For a team project: true
   * For indivual project: false
   */
  project: false,

  /**
   * Concat Files
   * 
   * Concatenation for JS and Sass/SCSS files.
   */
  concat: false,

  /**
   * Lint
   * 
   * Linting JS, Pug and Sass/SCSS files.
   */
  lint: true,

  /**
   * minify
   * 
   * Minification of CSS, JS and HTML files.
   */
  minify: false,

  /**
   * sourcemaps
   * 
   * Sourcemapping JS and Sass/SCSS.
   */
  sourcemaps: true,

  /**
   * purge
   * 
   * Purge unsused css.
   */
  purge: false,

  /**
   * Revisioning
   * 
   * Static asset revisioning by appending content hash to filenames
   * **Warning**: Must be false if concat is set to false.
   */
  revisioning: false,

  /**
   * Watch
   * 
   * Watch source files and recompile on any change.
   */
  watch: true,

  /**
   * Browsersync
   * 
   * Sync file changes to reload the browser automatically.
   */
  sync: true,
  port: 4000,
  open: false,
  notify: true,
  debug: true
};
