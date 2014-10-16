'use strict';
var path = require('path');


module.exports = {

	plugins: [
		'gulp-ignore',
		'gulp-jade',
		'gulp-minify-css',
		'lazypipe',
		'del'
	],

	registerTasks: function(gulp, plugin) {
		var src = path.join(this.basedir, 'src', 'jade', '**', '*.jade');
		var dest = path.join(this.basedir, 'build', 'html');

		var ignore 		= plugin('gulp-ignore');
		var	jade		= plugin('gulp-jade');
		var lazypipe 	= plugin('lazypipe');
		var del 		= plugin('del');


		var compile = function() {
			var task = lazypipe()
				.pipe( ignore.exclude, '**/_*.jade' )
				.pipe( jade )
			;
			return task();
		};




		gulp.task('jade-clean', function(){
			return del([dest]);
		});

		gulp.task('jade-dev-run', function(){
			return gulp.src(src)
				.pipe(compile())
				.pipe( gulp.dest(dest) );
		});

		gulp.task('jade-dev', ['jade-clean', 'jade-dev-run'], function() {

			gulp.watch(src, ['jade-dev-run']);

		});


		gulp.task('jade-build', ['jade-clean'], function() {

			return gulp.src(src)
				.pipe(compile())
				.pipe( gulp.dest(dest) );

		});







	}

};
