import fs from 'fs';
import gulp from 'gulp';
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', '-', '@*/gulp{-,.}*'],
  replaceString: /\bgulp[\-.]/
});
import shell from 'shelljs';
import ssri from 'ssri';
import runSequence from 'run-sequence';
import {
  errorHandler,
  getConfigKeys
} from '../config';
import paths from '../paths';
import {
  handleErrors,
  reload
} from './functions';
import pkg from '../../../package.json';

const env = getConfigKeys();

const jversion = pkg.dependencies.jquery;
const modernizrVersion = pkg.dependencies.modernizr;

let versions = [jversion, modernizrVersion];
versions = versions.map(version => {
  return version.replace(/(~|\^)/g, '');
});

// Copy Fonts
gulp.task('copy:fonts', () => {
  return gulp.src(paths.fontFiles + '/**/*', {
    base: '.'
  })
    .pipe(gulp.dest(paths.siteAssetsDir + paths.fontFolderName))
    .pipe($.size({
      title: 'fonts'
    }))
    .pipe(gulp.dest(paths.jekyllAssetsDir + paths.fontFolderName));
});

// Create htaccess file
gulp.task('copy:.htaccess', () =>
  fs.access('./.htaccess', (err, cb) => {
    if (err) {
      return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
        .pipe($.replace(/# ErrorDocument/g, 'ErrorDocument'))
        .pipe(gulp.dest('./'));
    } else {
      return cb;
    }
  })
);

// Compiles scripts.html to include version numbers
gulp.task('copy:scriptsfile', () => {
  const hash = ssri.fromData(
    fs.readFileSync('node_modules/jquery/dist/jquery.min.js'), {
      algorithms: ['sha256']
    }
  );

  gulp.src(paths.includeFoldeName + '/scripts-dev.html')
    .pipe($.plumber())
    .pipe($.replace(/{{JQUERY_VERSION}}/g, versions[0]))
    .pipe($.replace(/{{JQUERY_SRI_HASH}}/g, hash.toString()))
    .pipe($.replace(/{{MODERNIZR_VERSION}}/g, versions[1]))
    .pipe($.rename('scripts.html'))
    .pipe(gulp.dest(paths.includeFoldeName));
});

// Copy jQuery from Node Modules to JS Vendor
gulp.task('copy:jquery', () => {
  return gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe($.rename(`jquery-${versions[0]}.min.js`))
    .pipe(gulp.dest(paths.vendorFiles));
});

// Copy JavaScript files from Node Modules to JS Vendor
gulp.task('copy:scripts', () => {
  let scripts = {
    ext: [
      'node_modules/html5shiv/dist/html5shiv.min.js',
      'node_modules/jquery-migrate/dist/jquery-migrate.min.js',
      'node_modules/outdated-browser/outdatedbrowser/outdatedbrowser.min.js',
      'node_modules/scrollreveal/dist/scrollreveal.min.js',
      'node_modules/slick-carousel/slick/slick.min.js',
      'node_modules/lazysizes/lazysizes.min.js'
    ]
  };
  return gulp.src(scripts.ext)
    .pipe(gulp.dest(paths.vendorFiles));
});

// Copy all scripts to Jekyll Assets
gulp.task('copy:jsVendors', ['modernizr', 'jsVendors'], () => {
  const vendors = [
    paths.vendorFiles + '/vendors.min.js',
    paths.vendorFiles + `/jquery-${versions[0]}.min.js`,
    paths.vendorFiles + `/modernizr-${versions[1]}.min.js`,
    paths.vendorFiles + '/html5shiv.min.js'
  ];

  if (!fs.existsSync(paths.jekyllVendorFiles)) {
    shell.exec('mkdir ' + paths.jekyllVendorFiles);
  }

  return gulp.src(vendors)
    .pipe(gulp.dest(paths.jekyllAssetsDir + paths.scriptFolderName));
});

// Copy SCSS/Sass files from Node Modules to Sass Vendors
gulp.task('copy:bourbon', () => {
  return gulp.src('node_modules/bourbon/core/*')
    .pipe(gulp.dest(paths.sassVendorFiles + '/bourbon'));
});

gulp.task('copy:family', () => {
  return gulp.src('node_modules/family.scss/source/src/_family.scss')
    .pipe(gulp.dest(paths.sassVendorFiles + '/family'));
});

gulp.task('copy:hamburgers', () => {
  return gulp.src('node_modules/hamburgers/_sass/hamburgers/*')
    .pipe(gulp.dest(paths.sassVendorFiles + '/hamburgers'));
});

gulp.task('copy:hover', () => {
  return gulp.src('node_modules/hover.css/scss/*')
    .pipe(gulp.dest(paths.sassVendorFiles + '/hover'));
});

gulp.task('copy:mini', () => {
  return gulp.src('node_modules/mini.css/src/mini/*')
    .pipe(gulp.dest(paths.sassVendorFiles + '/mini'));
});

gulp.task('copy:outdatedbrowser', () => {
  return gulp.src('node_modules/outdated-browser/outdatedbrowser/outdatedbrowser.scss')
    .pipe(gulp.dest(paths.sassVendorFiles + '/outdatedbrowser'));
});

gulp.task('copy:slick', () => {
  return gulp.src(['node_modules/slick-carousel/slick/slick-theme.scss', 'node_modules/slick-carousel/slick/slick.scss'])
    .pipe(gulp.dest(paths.sassVendorFiles + '/slick'));
});

gulp.task('copy:typesettings', () => {
  return gulp.src(['node_modules/typesettings/typesettings/*', 'node_modules/typesettings/_typesettings.scss'])
    .pipe(gulp.dest(paths.sassVendorFiles + '/typesettings'));
});

gulp.task('copy:include', () => {
  return gulp.src('node_modules/include-media/dist/_include-media.scss')
    .pipe(gulp.dest(paths.sassVendorFiles + '/include-media'));
});

gulp.task('copy:sassyinputs', () => {
  return gulp.src('node_modules/sassy-inputs/sass/*')
    .pipe(gulp.dest(paths.sassVendorFiles + '/sassy-inputs'));
});

gulp.task('copy:images', () => {
  gulp.src([paths.imageFiles + '/*.*', '!' + paths.imageFiles + '/*.webp', '!' + paths.imageFiles + '/origin'])
    .pipe($.plumber())
    .pipe(gulp.dest(paths.imageFiles + '/origin'));
});

// Copy all styles
gulp.task('copy:styles', ['copy:bourbon', 'copy:family', 'copy:hamburgers', 'copy:hover', 'copy:mini', 'copy:outdatedbrowser', 'copy:slick', 'copy:typesettings', 'copy:include', 'copy:sassyinputs']);

// Main copy task
gulp.task('copy', (cb) => {
  runSequence('copy:.htaccess', ['copy:scripts', 'copy:jquery', 'copy:styles'], 'copy:scriptsfile', 'copy:jsVendors', 'copy:fonts', cb);
});
