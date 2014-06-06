var passwords = require('../passwords');
var LastfmAPI = require('lastfmapi');
var async = require('async');

var lfm = new LastfmAPI({
    'api_key' : passwords.lastfm_apikey,
    'secret' : passwords.lastfm_secret
});

exports.artistAlbumSearch = function(art, cbk) {
	lfm.artist.getTopAlbums({
		artist : art
	}, function(err, artist) {
		if (err) {
			if (VERBOSE) console.log(ERROR.fm_get_albums);
			return cbk(err, null)
		}
		else {
			var albums = []
			async.forEachSeries(artist.album, function(album, cbk1) {
				albums.push(album.name);
				cbk1()
			}, function() {
				return cbk(null, albums)
			})
		}
	});	
};

// exports.trackSearch = function(artist, track, cbk) {
// 	lfm.track.getInfo({
// 		artist: artist,
// 		track: track
// 	}, function(err, track) {
// 		return cbk(track)
// 	});
// };

exports.albumSearch = function(artist, album, cbk) {
	lfm.album.getInfo({
		artist: artist,
		album: album
	}, function(err, album) {
		if (err) {
			if (VERBOSE) { console.log(ERROR.fm_get_album_tracks)}
			return cbk(err, null);
		}
		else {
			var tracks = []
			async.forEachSeries(album.tracks.track, function(track, cbk1) {
				tracks.push(track.name)
				cbk1()
			}, function() {
				return cbk(null, tracks)
			})
		}
	});
};