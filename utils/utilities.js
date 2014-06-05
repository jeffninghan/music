var search = require('../search/search');
var async = require('async');
var songEngine = require('../db/songEngine')

var removeDuplicates = function(arr) {
	arr.filter(function(elem, pos) {
    	return arr.indexOf(elem) == pos;
	});
	return arr
};

var flatten = function(arr) {
	return [].concat.apply([], arr)
};

// artist is an object of form Artist schema
exports.findAlbum = function(artist, album) {
	for (var i = 0; i < artist.albums.length; i ++) {
		if (album === artist.albums[i].name) {
			return true
		}
		return false
	}
}
// get song list from request and remove duplicates
exports.getSongs = function(req, music, cbk) {
	var songs = []
	for (var i = 0; i < music.length; i ++) {
		if (music[i].indexOf('Album: ') !== -1) {
			for (var j = 0; j < req.session.albums.length; j ++) {
				if (req.session.albums[j].name === music[i].replace('Album: ', '')) {
					songs.push(req.session.albums[j].tracks)
					break
				}
			}
		}
		else {
			songs.push(music[i])
		}
	}
	songs = removeDuplicates(songs);
	songs = flatten(songs);
	cbk(songs);
}

exports.getSongList = function(artist, cbk) {
	songEngine.findArtist(artist, function(found) {
		if (found) {
			songEngine.getArtistAlbums(artist, function(albums) {
				return cbk(albums) //req.session.albums = albums;
			})
		}
		else {
			search.artistAlbumSearch(artist, function(albums) {
				var a = []
				async.forEachSeries(albums, function(album, cbk1) {
					search.albumSearch(artist, album, function(tracks) {
						a.push({name: album, tracks: tracks})
						cbk1()
					})
				}, function() {
					return cbk(a) //req.session.albums = a
				});
			});
		}
	})
}


