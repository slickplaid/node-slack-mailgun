var gulp = require('gulp');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var minimist = require('minimist');
var opts = minimist(process.argv.slice(2));
var fs = require('fs');

gulp.task('bump-version', function() {
  var type = 'patch';

  if (opts._.indexOf('minor') > -1) {
    type = 'minor';
  } else if (opts._.indexOf('major') > -1) {
    type = 'major';
  }

  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({
      type: type
    }).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function() {
  return gulp.src('.')
    .pipe(git.commit('[Prerelease] Bumped version number', {
      args: '-a'
    }));
});

gulp.task('push-changes', function(cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function(cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function(error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {
      args: '--tags'
    }, cb);
  });

  function getPackageJsonVersion() {
    //We parse the json file instead of using require because require caches multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  }
});

gulp.task('release', function(callback) {
  runSequence(
    // 'build', // buildall

    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function(error) {
      if (error) {
        // eslint-disable-next-line
        console.log(error.message);
      } else {
        // eslint-disable-next-line
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('minor', function() {
  return true;
});

gulp.task('major', function() {
  return true;
});

gulp.task('patch', function() {
  return true;
});

gulp.task('default', /*['build'],*/ function() {
  return true;
});