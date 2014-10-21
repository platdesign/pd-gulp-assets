'use strict';
var path = require('path');


module.exports = {

	plugins: [
		'gulp-uglify',
		'gulp-jshint',
		'jshint-stylish',
		'gulp-browserify',
		'gulp-ignore',
		'gulp-notify',
		'gulp-js-include',
		'lazypipe',
		'del'
	],

	registerTasks: function(gulp, plugin) {
		var src = path.join(this.basedir, 'src', 'js', '**', '*.js');
		var dest = path.join(this.basedir, 'build', 'js');


		var uglify 		= plugin('gulp-uglify');
		var jshint 		= plugin('gulp-jshint');
		var stylish 	= plugin('jshint-stylish');
		var browserify 	= plugin('gulp-browserify');
		var ignore 		= plugin('gulp-ignore');
		var notify 		= plugin('gulp-notify');
		var jsInclude 	= plugin('gulp-js-include');
		var lazypipe 	= plugin('lazypipe');
		var del 		= plugin('del');

		var errorHandler = function(error) {
			console.error(error.message);
			var args = Array.prototype.slice.call(arguments);

			notify.onError({
				title: 'Compile Error',
				message: '<%= error.message %>'
			}).apply(this, args);

			// Keep gulp from hanging on this task
			this.emit('end');
		};






		var compile = function() {
			var task = lazypipe()
				.pipe( ignore.exclude, '**/_*.js' )
				.pipe( jsInclude )
				.pipe(browserify, {
					insertGlobals : false,
					debug : false
				})
			;
			return task();
		};


		gulp.task('js-clean', function(cb){
			del([dest], cb);
		});

		gulp.task('js-dev-run', ['js-clean'], function(){
			gulp.src(src)
				.pipe( jshint() )
				.pipe( jshint.reporter(stylish) )
				.pipe(compile())
				.on('error', errorHandler)
				.pipe( gulp.dest( dest ));
		});

		gulp.task('js-dev', ['js-dev-run'], function(){
			gulp.watch(src, ['js-dev-run'])
		});


		gulp.task('js-build', ['js-clean'], function(){

			return gulp.src( src )
				.pipe( jshint() )
				.pipe( jshint.reporter(stylish) )
				.pipe(compile())
				.on('error', errorHandler)
				.pipe(uglify())
				.pipe( gulp.dest( dest ));

		});







	}

};
