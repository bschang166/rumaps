'use strict';

var
  http = require('http'),
  express = require('express'),

  fs = require('fs'),
  morgan = require('morgan'),
  serve_static = require('serve-static'),

  app = express(),
  server = http.createServer(app);

app.use(morgan());
app.use(serve_static(__dirname + '/public'));
app.use(serve_static('./' + 'bower_components'));

app.get('/', function (req, res) {
  res.redirect('index.html');
});

app.get('/map/kml/:name', function (req, res) {
  fs.readFile('./kml/' + req.params.name + '.kml', function (err, data) {
    if (err) {throw err}
    res.set('Content-Type', 'text/kml');
    res.location(req.params.name);
    res.send(data);
  });
});

server.listen(3000, function () {
  console.log('Server listening on port 3000...');
});