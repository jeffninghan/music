var mongoose = require('mongoose');
var schema = new mongoose.Schema({ name: String, albums: [{ name: String, tracks: Array}] });
var Artist = mongoose.model('Artist', schema);
var util = require('../utils/utilities')

exports.newArtist = function(artist, albums, cbk) {
	var artist = new Artist({name: artist, albums: albums})
	artist.save(function() {
		return cbk()
	})
};

exports.findArtist = function(artist, cbk) {
	Artist.find({name: artist}, function(err, res) {
		if (res.length) {
			return cbk(true)
		}
		return cbk(false)
	})
}

exports.getArtistAlbums = function(artist, cbk) {
	Artist.find({name: artist}, function(err, res) {
		return cbk(res[0].albums)
	})
}

exports.findArtistAlbum = function(artist, album, cbk) {
	Artist.find({name: artist}, function(err, res) {
		if (res.length) {
			var found = util.findAlbum(res[0], album)
			return cbk(found)
		}
		return cbk(false)
	})	
}

