
var gulp 		= require('gulp');
var taskLoader 	= require('./gulp/utils/task-loader.js')(gulp);
var path 		= require('path');

taskLoader.requireDir(path.join(__dirname, 'gulp', 'tasks'));
taskLoader.run(__dirname);

gulp.task('dev', [
	'js-dev',
	'styles-dev',
	'jade-dev',
	'gfx-dev'
]);

gulp.task('build', [
	'js-build',
	'styles-build',
	'jade-build',
	'gfx-build'
]);
