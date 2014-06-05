var passwords = require('../passwords');
var LastfmAPI = require('lastfmapi');
var async = require('async');

var lfm = new LastfmAPI({
    'api_key' : passwords.lastfm_apikey,
    'secret' : passwords.lastfm_secret
});

exports.artistAlbumSearch = function(artist, cbk) {
	lfm.artist.getTopAlbums({
		artist : artist
	}, function(err, artist) {
		var albums = []
		async.forEachSeries(artist.album, function(album, cbk1) {
			albums.push(album.name);
			cbk1()
		}, function() {
			return cbk(albums)
		})
	});	
};

exports.trackSearch = function(artist, track, cbk) {
	lfm.track.getInfo({
		artist: artist,
		track: track
	}, function(err, track) {
		return cbk(track)
	});
};

exports.albumSearch = function(artist, album, cbk) {
	lfm.album.getInfo({
		artist: artist,
		album: album
	}, function(err, album) {
		var tracks = []
		async.forEachSeries(album.tracks.track, function(track, cbk1) {
			tracks.push(track.name)
			cbk1()
		}, function() {
			return cbk(tracks)
		})
	});
};