var fs = require('fs');
var d = require('./download');
var async = require('async');
var ffmpeg = require('fluent-ffmpeg');
var DOWNLOAD_DIR = d.download_dir();
var passwords = require('./passwords')
var songs = ['Anna Sun', 'Tightrope'];
var artist = 'Walk the Moon'
// // Music Download
// async.forEachSeries(songs, function(song, cbk) {
// 	d.download(artist, song, function() {
// 		var proc = new ffmpeg({source:DOWNLOAD_DIR + artist + '-' + song +'.mp4'})
// 		proc.setFfmpegPath('C:/Programming/web/music/ffmpeg/bin/ffmpeg')
// 		proc.withAudioCodec('libmp3lame')
// 		proc.on('end', function() {
// 				fs.unlink(DOWNLOAD_DIR + artist + '-' + song +'.mp4', function() {
// 					cbk();
// 				})
// 		    })
// 		proc.saveToFile(DOWNLOAD_DIR + artist + '-' + song +'.mp3')		
// 	})	
// })


// Music album search
var LastfmAPI = require('lastfmapi');
var lfm = new LastfmAPI({
    'api_key' : passwords.lastfm_apikey,
    'secret' : passwords.lastfm_secret
});
lfm.album.getInfo({
    'artist' : 'Walk the Moon',
    'album' : 'Walk the Moon'
}, function (err, track) {
    if (err) { throw err; }
    for (var i = 0; i < track.tracks.track.length; i ++) {
    	console.log(track.tracks.track[i])
    }
    //console.log(track);
});