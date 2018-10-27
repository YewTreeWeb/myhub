module.exports = {

  /**
   * Concat Files
   * 
   * Concatenation for JS and Sass/SCSS files.
   */
  concat: true,

  /**
   * Lint
   * 
   * Linting JS, Pug and Sass/SCSS files.
   */
  lint: false,

  /**
   * minify
   * 
   * Minification of CSS, JS and HTML files.
   */
  minify: true,

  /**
   * sourcemaps
   * 
   * Sourcemapping JS and Sass/SCSS.
   */
  sourcemaps: false,

  /**
   * purge
   * 
   * Purge unsused css.
   */
  purge: true,

  /**
   * Revisioning
   * 
   * Static asset revisioning by appending content hash to filenames
   * **Warning**: Must be false if concat is set to false.
   */
  revisioning: true,

  /**
   * Watch
   * 
   * Watch source files and recompile on any change.
   */
  watch: false,

  /**
   * Browsersync
   * 
   * Sync file changes to reload the browser automatically.
   */
  sync: false,
  port: 4000,
  open: false,
  debug: false
};
