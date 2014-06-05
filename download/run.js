var fs = require('fs');
var d = require('./download');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var DOWNLOAD_DIR = d.download_dir();

// Music Download
exports.run = function(artist, songs, cbk) {
	async.forEachSeries(songs, function(song, cbk1) {
		d.download(artist, song, function() {
			var proc = new ffmpeg({source:DOWNLOAD_DIR + artist + '-' + song +'.mp4'})
			proc.setFfmpegPath('C:/Programming/web/music/ffmpeg/bin/ffmpeg')
			proc.withAudioCodec('libmp3lame')
			proc.on('end', function() {
					fs.unlink(DOWNLOAD_DIR + artist + '-' + song +'.mp4', function() {
						cbk1();
					})
			    })
			proc.saveToFile(DOWNLOAD_DIR + artist + '-' + song +'.mp3')		
		});	
	}, function() {
		console.log('download/run.js: done downloading requested songs')
		cbk();
	});
};