
// artist is an object of form Artist schema
exports.findAlbum = function(artist, album) {
	for (var i = 0; i < artist.albums.length; i ++) {
		if (album === artist.albums[i].name) {
			return true
		}
		return false
	}
}