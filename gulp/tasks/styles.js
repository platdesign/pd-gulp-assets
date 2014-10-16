'use strict';
var path = require('path');


module.exports = {

	plugins: [
		'gulp-ruby-sass',
		'gulp-autoprefixer',
		'gulp-minify-css',
		'lazypipe',
		'gulp-livereload',
		'del'
	],

	registerTasks: function(gulp, plugin) {
		var sassCachePath = path.join(this.basedir, '.sass-cache');

		var src = path.join(this.basedir, 'src', 'scss', '**', '*.scss');
		var dest = path.join(this.basedir, 'build', 'css');

		var gulp 			= plugin('gulp');
		var sass 			= plugin('gulp-ruby-sass');
		var autoprefixer 	= plugin('gulp-autoprefixer');
		var minifyCSS 		= plugin('gulp-minify-css');
		var lazypipe 		= plugin('lazypipe');
		var livereload 		= plugin('gulp-livereload');
		var del 			= plugin('del');

		var compile = function(){

			var task = lazypipe()
				.pipe(sass)
				.pipe(autoprefixer, 'last 2 versions', '> 1%', 'ie 8')
			;
			return task();

		};



		gulp.task('styles-clean', function(){
			return del([dest]);
		});

		gulp.task('styles-dev-run', function(){

			livereload.listen();

			return gulp.src(src)
				.pipe( compile() )
				.pipe( gulp.dest(dest) )
				.pipe( livereload({ auto: true }) );

		});

		gulp.task('styles-dev', ['styles-clean', 'styles-dev-run'], function() {
			gulp.watch(src, ['styles-dev-run']);
		});

		gulp.task('styles-build-run', function(){
			return gulp.src(src)
				.pipe( compile() )
				.pipe( minifyCSS() )
				.pipe( gulp.dest(dest) );

		})

		gulp.task('styles-build', ['styles-clean', 'styles-build-run'], function() {

			// Delete sass-cache
			return del([
				sassCachePath
			]);

		});


	}

};
