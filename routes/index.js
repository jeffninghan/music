var express = require('express');
var router = express.Router();
var download = require('../lib/download/run');
var utils = require('../lib/utils/utilities');

/* GET home page. */
router.get('/', function(req, res) {
    var artist = (req.session !== undefined) ? req.session.artist : null
    var albums = (req.session !== undefined) ? req.session.albums : null
	res.render('index', { title: 'Music Downloading',  artist: artist, albums: albums});
});

router.post('/', function(req, res) {
	req.session.artist = req.body.artist
	utils.getSongList(req, req.session.artist, function(err, albums) {
		if (err) { 
			req.session.err = err;
			res.redirect('/error')
		}
		else {
			if (albums !== null) {
				req.session.albums = albums
				res.redirect('/')
			}
			else {
				res.redirect('/notfound')
			}
		}
	})
});

router.get('/restart', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/')
	})
});

router.get('/download', function(req, res) {
	download.run(req.session.artist, req.session.download, function(miss) {
		res.render('download', {miss: miss})
	})
});

router.post('/download', function(req, res) {
	var music = Object.keys(req.body)
	utils.getSongs(req, music, function(err, songs) {
		if (err) {
			req.session.err = err;
			res.redirect('/error');
		}
		else {
			req.session.download = songs
			res.redirect('/download')
		}
	})
});

router.get('/error', function(req, res) {
	if (VERBOSE) console.log(req.session.err);
	res.render('error', { title: 'Error Occured!', err: req.session.err})
})

router.get('/notfound', function(req, res) {
	res.render('notfound', { title: 'Not Found', artist: req.session.artist})
})
module.exports = router;
