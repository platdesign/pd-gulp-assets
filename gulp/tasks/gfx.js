'use strict';
var path = require('path');

module.exports = {

	plugins: [
		'gulp-imagemin',
		'imagemin-pngcrush',
		'del'
	],

	registerTasks: function(gulp, plugin) {
		var src = path.join(this.basedir, 'src', 'gfx', '**','*');
		var dest = path.join(this.basedir, 'build', 'gfx');

		var imagemin 	= plugin('gulp-imagemin');
		var pngcrush 	= plugin('imagemin-pngcrush');
		var del 		= plugin('del');


		gulp.task('gfx-clean', function(){
			return del([dest]);
		});



		gulp.task('gfx-dev-run', function(){
			return gulp.src(src).pipe( gulp.dest(dest) );
		});

		gulp.task('gfx-dev', ['gfx-clean', 'gfx-dev-run'], function(){
			gulp.watch(src, ['gfx-dev-run']);
		});

		gulp.task('gfx-build', function(){
			return gulp.src(src)
				.pipe(imagemin({
					progressive: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngcrush()]
				}))
				.pipe(gulp.dest(dest));
		});

	}

};
