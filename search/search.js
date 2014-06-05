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
		async.forEachSeries(album.tracks.track, function(track, cbk1) {           //something wrong with async i think
			tracks.push(track.name)
			cbk1()
		}, function() {
			return cbk(tracks)
		})
	});
};

// lfm.album.getInfo({
//     'artist' : 'Vampire Weekend',
//     'album' : 'Modern Vampires of the City'
// }, function (err, album) {
//     if (err) { throw err; }
//     for (var i = 0; i < album.tracks.track.length; i ++) {
//     	console.log(album.tracks.track[i])
//     }
//     //console.log(track);
// });

// lfm.track.getInfo({
// 	'artist' : 'Walk the Moon',
// 	'track' : 'Jenny'
// }, function(err, track) {
// 	console.log(track)
// })

// lfm.artist.getTopAlbums({
// 	'artist' : 'Kanye West'
// }, function(err, artist) {
// 	for (var i = 0; i < artist.album.length; i ++) {
// 		console.log(artist.album[i].name)
// 	}
// 	//console.log(artist)
// })