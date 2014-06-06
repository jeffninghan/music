var fs = require('fs');
var ytdl = require('ytdl');
var youtube = require('youtube-node');
var passwords = require('../passwords')
var BASE = require('../setup').YOUTUBE_BASE //https://www.youtube.com/watch?v='
youtube.setKey(passwords.youtube);
var DOWNLOAD_DIR = require('../setup').DOWNLOAD_DIR; //'C:/Programming/web/music/songs/'
var utils = require('../utils/utilities');

exports.download_dir = function() {
	return DOWNLOAD_DIR
}

exports.download = function(artist, song, cbk) {
	youtube.search(artist + ' ' + song.name +' lyrics', 5, function(resultData) {
		if (!resultData.items.length) {
			cbk(song.name, null)
		}
		else {
			if (VERBOSE) console.log('lib/download/download.js: Downloading ' + song.name + ' with ID: ' + resultData.items[0].id.videoId);
		    var dir = ''
		    utils.directory(artist, song.album, function(dir) {
			    var req = ytdl(BASE + resultData.items[0].id.videoId, { filter: function(format) { return format.container === 'mp4'; } })
			    var ws = fs.createWriteStream(dir + 'song.mp4')
			    req.pipe(ws)
			    ws.on('close', function() {
					fs.rename(dir + 'song.mp4', dir + song.name + '.mp4', function() {
						return cbk(null, dir);
					})
			    })
		    })
		}
	});	
}
