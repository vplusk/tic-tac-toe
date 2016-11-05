var express = require("express");
var app = express();
var request = require("request");
var FeedParser = require('feedparser');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + "/"));

var urls = [{
	name: 'Mashable',
	url: 'http://feeds2.feedburner.com/Mashable'
},{
	name: 'jQuery',
	url: 'http://feeds2.feedburner.com/jquery/'
},
{
	name: 'ycombinator',
	url: 'http://news.ycombinator.com/rss'
}];

app.get('/channels', function(req, res) {
	res.send(urls);
});

app.get('/channels/:id', function(req, res) {
	console.log('req.params.id', req.params.id, '\n');
	var index = req.params.id;
	var url = urls[index];
	console.log('channel', url['url']);
	var mainRequest = request(url['url']);

	var feedparser = new FeedParser();
	mainRequest.on('error', function(error) {
		// handle any request errors
	});
	mainRequest.on('response', function(res) {
		var stream = this;
		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
			stream.pipe(feedparser);
	});
	var arr = [];
	feedparser.on('readable', function() {    
		var stream = this;
		var meta = this.meta
		var item;
		while (item = stream.read()) {
			arr.push(item);
		}
	});
	feedparser.on('end', function() {
		res.send(arr);
	})
});

app.post('/channels', function(req, res) {
	console.log(req.body);
    //res.end();
    urls.push(req.body);
    console.log(urls);
});

app.delete('/delete/:index', function(req, res) {
	urls.splice(req.params.index, 1);
	res.send(urls);
});

app.listen(8080);

app.listen(app.get('port'), function() {
	console.log('Server is running on port 8080');
});
