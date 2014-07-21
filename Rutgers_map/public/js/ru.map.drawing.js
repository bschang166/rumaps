/*
  ru.map.drawings.js
  Retrieves map kml data from server and draws polygon onto map
  
  refactor, documentation
  
  remove kml html jquery leftover
*/

'use strict';

ru.map.drawing = (function () {
  var
    map,
    polyline, polylineOptions,
    polygon, polygonOptions,
    jqueryMap = {},
    placemarkList = [],

    KmlParser = ru.util.KmlParser,

    setJqueryMap,
    getMapKml, parseMapKml,
    drawPolygonToMap,
    initModule;

  setJqueryMap = function () {
    jqueryMap = {
      wrapper: $('#wrapper')
    };
  };

  getMapKml = function () {
    $.ajax({
      type: 'GET',
      url: '/map/kml/test'
    }).then(
      function (kmlData) {
        var parsedData = parseMapKml(null, kmlData);
        drawPolygonToMap(parsedData, map);
      },
      function (err) {
        throw err;
      }
    )
  }

  parseMapKml = function (err,kmlData) {
    if (err) throw err;

    var results = new KmlParser(kmlData).parse();
    return results;
  }
  //------------------- BEGIN DRAWINGS FUNCTIONS-------------------

  drawPolygonToMap = function (polygonEntries, map) {
    for (var i = 0, n = polygonEntries.length; i < n; i++) {
      var
        entry, polygon;

      entry = polygonEntries[i];

      polygon = new google.maps.Polygon({
        paths: entry.coords,
        title: entry.title,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      polygon.setMap(map);
    }
  }
  //------------------- END DRAWINGS FUNCTIONS-------------------

  //------------------- BEGIN EVENT HANLDERS-------------------
  //------------------- END EVENT HANLDERS-------------------

  initModule = function () {
    var parsedData;

    map = ru.map.getMap();
    setJqueryMap();

    getMapKml();

  }

  return {
    initModule: initModule
  };

}());