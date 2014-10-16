'use strict';

var fs = require('fs');
var path = require('path');
var execSync = require('exec-sync');


var exec = function(command) {
	var sys = require('sys');
	require('child_process').exec(command, function puts(error, stdout, stderr) { sys.puts(stdout) });
};

module.exports = function(gulp){

	var __taskModules = [];


	function getAllPluginNames() {
		var result = [];
		__taskModules.forEach(function(m){
			if(m.plugins) {
				result.push.apply(result, m.plugins);
			}
		});
		return result.filter(function(value, index, self){
			return self.indexOf(value) === index;
		});
	}

	function _moduleExists(name) {
		try {
			return require.resolve( name );
		} catch( e ) {
			return false;
		}
	}

	function _installMissingPlugins(allplugins, done) {
		var _missing = [];

		allplugins.forEach(function(pluginname){
			if( !_moduleExists(pluginname) ) {
				_missing.push(pluginname);
			}
		});

		if( _missing.length ) {

			var readline = require('readline');

			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			var colorRed='\x1b[31m%s\x1b[0m';
			var colorCyan='\x1b[36m%s\x1b[0m';

			console.log(colorRed, 'Missing plugins found');
			_missing.forEach(function(pluginname){
				console.log('---> '+pluginname);
			});

			try {
				console.log(colorCyan, 'Installing plugins');
				execSync('npm install '+_missing.join(' ')+' --save --silent');

			} catch(err) {
				console.log(colorRed, 'Error while installing plugins.');
				console.log(err);
				process.exit(1);
			}

		}
	}





	function requireDir(dirpath) {
		fs.readdirSync(dirpath).forEach(function(item){
			var itempath = path.join(dirpath, item);
			var stat = fs.statSync(itempath);

			if( stat && !stat.isDirectory() && item.substr(0,1)!=='.') {
				__taskModules.push( require(itempath) );
			}
		});
	}





	function _run(basedir) {

		// Checks for missing plugins and installs them
		_installMissingPlugins( getAllPluginNames() );

		// Call registerTasks of each taskModule
		__taskModules.forEach(function(m){
			if(m.registerTasks) {
				m.registerTasks.apply({basedir:basedir}, [gulp, function(pluginname){
					return require(pluginname);
				}]);
			}
		});

	}

	return {
		requireDir: requireDir,
		run: _run
	};

};
