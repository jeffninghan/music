var mongoose = require('mongoose');
var schema = new mongoose.Schema({ name: String, albums: [{ name: String, tracks: Array}] });
var Artist = mongoose.model('Artist', schema);
var util = require('../utils/utilities')

exports.newArtist = function(artist, albums, cbk) {
	var artist = new Artist({name: artist, albums: albums})
	artist.save(function(err) {
		if (err) {
			if (VERBOSE) console.log(ERROR.db_artist_save);
			return cbk(err)
		}
		else {
			return cbk(null)
		}
	})
};

exports.findArtist = function(artist, cbk) {
	Artist.find({name: artist}, function(err, res) {
		if (err) {
			if (VERBOSE) console.log(ERROR.db_artist_find);
			return cbk(err, null)
		}
		else {
			if (res.length) {
				return cbk(null, true)
			}
			return cbk(null, false)			
		}
	})
}

exports.getArtistAlbums = function(artist, cbk) {
	Artist.find({name: artist}, function(err, res) {
		if (err) {
			if (VERBOSE) console.log(ERROR.db_artist_album_get);
			return cbk(err, null)
		}
		else {
			if (res.length) return cbk(null, res[0].albums);
			return cbk(null, null) // no artist found
		}
	})
}

exports.findArtistAlbum = function(artist, album, cbk) {
	Artist.find({name: artist}, function(err, res) {
		if (err) {
			if (VERBOSE) console.log(ERROR.db_artist_album_find);
			return cbk(err, null)
		}
		else {
			if (res.length) {
				var found = util.findAlbum(res[0], album)
				return cbk(null, found)
			}
			return cbk(null, false)
		}
	})	
}

