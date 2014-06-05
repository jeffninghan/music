var express = require('express');
var router = express.Router();
var download = require('../download/run');
var utils = require('../utils/utilities');

/* GET home page. */
router.get('/', function(req, res) {
    var artist = (req.session !== undefined) ? req.session.artist : null
    var albums = (req.session !== undefined) ? req.session.albums : null
	res.render('index', { title: 'Music Downloading',  artist: artist, albums: albums});
});

router.post('/', function(req, res) {
	req.session.artist = req.body.artist
	var artist = req.body.artist
	utils.getSongList(artist, function(albums) {
		req.session.albums = albums
		res.redirect('/')
	})
});

router.get('/restart', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/')
	})
});

router.get('/download', function(req, res) {
	download.run(req.session.artist, req.session.download, function() {
		res.render('download')
	})
});

router.post('/download', function(req, res) {
	var music = Object.keys(req.body)
	utils.getSongs(req, music, function(songs) {
		req.session.download = songs
		res.redirect('/download')
	})
});

module.exports = router;
