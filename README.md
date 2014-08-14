###music downloading off youtube

###### Download FFMPEG and make a file called setup.js in /lib of the following form:
```
module.exports = 

{
	DOWNLOAD_DIR: 'path to song directory',
	YOUTUBE_BASE: 'https://www.youtube.com/watch?v=',
	FFMPEG_DIR: 'path to ffmpeg',
	VERBOSE: true
}

```
###### Then, make a file called passwords.js in /lib of the following form:
```
module.exports = { 	lastfm_apikey: 'api key from lastfm',
					lastfm_secret: 'secret from lastfm',
					youtube: 'youtube secret',
					mongo: 'mongo hq database http'
}
```
###### Make sure to npm install before running npm start. Go to localhost:3000 and start downloading!

####TODO:
######update artist database when new album released (batch server)
######use echoprint to make a song recognition module

###testing master 