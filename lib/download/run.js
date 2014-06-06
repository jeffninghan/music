var fs = require('fs');
var d = require('./download');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var FFMPEG_DIR = require('../setup').FFMPEG_DIR

// Music Download
exports.run = function(artist, songs, cbk) {
	if (VERBOSE) console.log('download/run.js: Beginning to download songs from YouTube')
	var miss = []
	async.forEachSeries(songs, function(song, cbk1) {
		d.download(artist, song, function(missed, dir) {
			if (missed) {
				if (VERBOSE) console.log('lib/download/run: Missed ' + missed)
				miss.push(missed);
				cbk1()
			}
			else {
				if (VERBOSE) console.log('/lib/download/run: converting ' + song.name + ' to mp3')
				var proc = new ffmpeg({source:dir + song.name +'.mp4'})
				proc.setFfmpegPath(FFMPEG_DIR)
				proc.withAudioCodec('libmp3lame')
				proc.addOption('-metadata', 'album=' + song.album)
				proc.addOption('-metadata', 'artist=' + artist)
				proc.addOption('-metadata', 'track=' + song.track)
				proc.on('end', function() {
						fs.unlink(dir + song.name +'.mp4', function() {
							cbk1();
						})
				    })
				proc.saveToFile(dir + song.name +'.mp3')	
			}	
		});	
	}, function() {
		console.log('download/run.js: done downloading requested songs')
		cbk(miss);
	});
};