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

app.get('/geojson/:name', function (req, res) {
  res.sendfile("./geojson/" + req.params.name + ".geojson");
});

server.listen(3000, function () {
  console.log('Server listening on port 3000...');
});