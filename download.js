var fs = require('fs');
var ytdl = require('ytdl');
var youtube = require('youtube-node');
var BASE = 'https://www.youtube.com/watch?v='
youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
var DOWNLOAD_DIR = 'C:/Programming/web/music/songs/'

exports.download_dir = function() {
	return DOWNLOAD_DIR
}

exports.download = function(artist, song, cbk) {
	youtube.search(artist + ' ' + song +' lyrics', 5, function(resultData) {
		console.log(resultData.items[0].id.videoId)
	    var req = ytdl(BASE + resultData.items[0].id.videoId, { filter: function(format) { return format.container === 'mp4'; } })
	    var ws = fs.createWriteStream(DOWNLOAD_DIR + 'song.mp4')
	    req.pipe(ws)
	    ws.on('close', function() {
			fs.rename(DOWNLOAD_DIR + 'song.mp4', DOWNLOAD_DIR + artist + '-' + song + '.mp4', function() {
				return cbk();
			})
	    })
	});	
}
