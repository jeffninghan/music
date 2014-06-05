var express = require('express');
var router = express.Router();
var download = require('../download/run');
var search = require('../search/search');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
    var artist = (req.session !== undefined) ? req.session.artist : null
    var albums = (req.session !== undefined) ? req.session.albums : null
	res.render('index', { title: 'Music Downloading',  artist: artist, albums: albums});
});

// router.get('/artist', function(req, res) {

// 	res.render('artist', { title: 'Music Downloading', artist: artist, albums: albums, songs: songs });	
// });

router.post('/', function(req, res) {
	req.session.artist = req.body.artist
	var artist = req.body.artist
	search.artistAlbumSearch(artist, function(albums) {
		var a = []
		async.forEachSeries(albums, function(album, cbk) {
			search.albumSearch(artist, album, function(tracks) {
				a.push({name: album, tracks: tracks})
				cbk()
			})
		}, function() {
			req.session.albums = a
			res.redirect('/');
		})
	});
});

router.get('/restart', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/')
	})
})

router.post('/download', function(req, res) {
	console.log(req.body)
	res.redirect('/')
})

module.exports = router;
