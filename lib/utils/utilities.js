var search = require('../search/search');
var async = require('async');
var songEngine = require('../db/songEngine')
var fs = require('fs');
var DOWNLOAD_DIR = require('../setup').DOWNLOAD_DIR

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
					for (var k = 0; k < req.session.albums[j].tracks.length; k++) {
						songs.push({name: req.session.albums[j].tracks[k], album: req.session.albums[j].name, track: String(k+1) + '/' + String(req.session.albums[j].tracks.length)})
					}
					break
				}
			}
		}
		else {
			songs.push({name: music[i], album: null, track: null})
		}
	}
	songs = removeDuplicates(songs);
	songs = flatten(songs);
	if (VERBOSE) console.log(songs); 	
	cbk(null, songs);
}

exports.getSongList = function(req, art, cbk) {
	search.artistName(art, function(err, name) {
		if (err) return cbk(err, name);
		else {
			var artist = name
			req.session.artist = name;
			if (VERBOSE) console.log('/lib/utils/utilities: Requested artist name is ' + artist)
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
	})                                     
}

exports.directory = function(artist, album, cbk) {
	var dir = DOWNLOAD_DIR+artist+'/'
	if (album) {
		var dir = dir+album+'/'
		fs.exists(DOWNLOAD_DIR+artist, function(ex1) {
			if (ex1) {
				fs.exists(DOWNLOAD_DIR+artist+'/'+album, function(ex2) {
					if (!ex2) {
						fs.mkdir(DOWNLOAD_DIR+artist+'/'+album, function() {
							return cbk(dir)
						})
					}
					return cbk(dir)
				})
			}
			else {
				fs.mkdir(DOWNLOAD_DIR+artist, function() {
					fs.mkdir(DOWNLOAD_DIR+artist+'/'+album, function() {
						return cbk(dir)
					})
				})
			}
		})		
	}
	else {
		fs.exists(DOWNLOAD_DIR+artist, function(ex1) {
			if (ex1) {
				return cbk(dir)
			}
			else {
				fs.mkdir(DOWNLOAD_DIR+artist+'/', function() {
					return cbk(dir)
				})
			}
		})
	}

}