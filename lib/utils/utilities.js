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
	cbk(null, songs);
}

exports.getSongList = function(artist, cbk) {
	songEngine.findArtist(artist, function(err, found) {
		if (err) return cbk(err, found);
		if (found) {
			if (VERBOSE) console.log('Looking in mongo db');
			songEngine.getArtistAlbums(artist, function(err1, albums) {
				if (err) return cbk(err1, albums);
				else {
					return cbk(null, albums)
				}
			})
		}
		else {
			if (VERBOSE) console.log('Looking in last.fm database');
			search.artistAlbumSearch(artist, function(err1, albums) {
				if (err1) return cbk(err1, albums);
				else {
					var a = []
					async.forEachSeries(albums, function(album, cbk1) {
						search.albumSearch(artist, album, function(err2, tracks) {
							if (err2) cbk1(); 
							else {
								a.push({name: album, tracks: tracks})
								cbk1()
							}
						})
					}, function() {
						songEngine.newArtist(artist, a, function(err3) {
							if (err3) return cbk(err3, null);
							return cbk(null, a) //req.session.albums = a
						})
					});
				}
			});
		}
	})
}


