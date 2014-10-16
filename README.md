#pd-gulp-assets

My bootstrap of creating/building assets in web-projects

Installs dependencies automatically on `gulp <taskname>`.

## How to use

	$ git clone https://github.com/platdesign/pd-gulp-assets assets 
	$ npm install && cd assets
	$ gulp dev			// For watching in dev process
	$ gulp build		// For creating a build

## Creating a task-module

	$ cd gulp/tasks
	
Task-modules are common js-modules which return an object like the following one:

	module.exports = {
		plugins: ['gulp-uglify'],
		registerTasks: function(gulp, plugin) {

			// Requires plugin after installing it if needed
			var uglify = plugin('gulp-uglify');
			
			// Creating task
			gulp.task('myTask', function(){
				return gulp.src('./**/*.js')
					.pipe( uglify )
					.pipe( gulp.dest('./') );
			});			
		}
	};
	
	

##Contact##

- [mail@platdesign.de](mailto:mail@platdesign.de)
- [platdesign](https://twitter.com/platdesign) on Twitter