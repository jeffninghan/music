var express = require('express');
var router = express.Router();
var download = require('../download/run');
var search = require('../search/search');
var async = require('async');
var songEngine = require('../db/songEngine')

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
	songEngine.findArtist(artist, function(found) {
		if (found) {
			songEngine.getArtistAlbums(artist, function(albums) {
				req.session.albums = albums;
				res.redirect('/')
			})
		}
		else {
			search.artistAlbumSearch(artist, function(albums) {
				var a = []
				async.forEachSeries(albums, function(album, cbk) {
					search.albumSearch(artist, album, function(tracks) {
						a.push({name: album, tracks: tracks})
						cbk()
					})
				}, function() {
					req.session.albums = a
					songEngine.newArtist(req.session.artist, req.session.albums, function () {
						res.redirect('/');
					});
				});
			});
		}
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
	songs = [].concat.apply([], songs);
	songs = songs.filter(function(elem, pos) {
    			return songs.indexOf(elem) == pos;
			});
	req.session.download = songs
	res.redirect('/download')
});

module.exports = router;
