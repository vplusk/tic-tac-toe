var path = require('path'),
	express = require('express'),
	app = express(),
	staticPath = path.normalize(__dirname),
	bodyParser = require('body-parser'),
	server = app.listen(7777);

app.use(express.static(staticPath));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

module.exports = app;