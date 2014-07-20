'use strict';

ru.map.drawing = (function () {
  var
    map,
    polyline, polylineOptions,
    polygon, polygonOptions,
    jqueryMap = {},
    placemarkList = [],

    setJqueryMap,
    getMapKml, parseMapKml,
    setDrawingConfig,
    addLatLng,
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
        parseMapKml(kmlData);
      },
      function (err) {
        throw err;
      }
    )
  }

  parseMapKml = function (kmlData) {

    /*
      need to extract:
      <Placemark> separates each entry
      -<name>
      -<Polygon> <coordinates>
    */
    var
      wrapper = jqueryMap.wrapper,
      placemarks;

    wrapper.html(kmlData);

    placemarks = wrapper.find('placemark');
    
    for (var i = 0, n = placemarks.length; i < n; i++) {
      var
        element, coordinates,
        placemark = {};

      element = placemarks.eq(i);
      placemark.title = element.find('name').text();
      
      coordinates = element.find('coordinates').text().split(',0.0 ');

      coordinates.forEach(function (coordset,i) {
        var
          coords,
          lat, long;

        coords = coordset.split(',');
        long = parseFloat(coords[0]);
        lat = parseFloat(coords[1]);

        coordinates[i] = new google.maps.LatLng(lat, long);
      });

      placemark.coords = coordinates;

      placemarkList.push(placemark);

    }
    for (var i = 0, n = placemarkList.length; i < n; i++) {
      var
        placemark, polygon;

      placemark = placemarkList[i];

      polygon = new google.maps.Polygon({
        paths: placemark.coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      polygon.setMap(map);
    }

  }
  //------------------- BEGIN DRAWINGS CONFIG-------------------
  polylineOptions = {
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  };
  polyline = new google.maps.Polyline(polylineOptions);

  setDrawingConfig = function () {
    polyline.setMap(map);
  }
  //------------------- END DRAWINGS CONFIG-------------------

  //------------------- BEGIN EVENT HANLDERS-------------------
  addLatLng = function (event) {
    var
      path, marker;

    path = polyline.getPath();

    path.push(event.latLng);

    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
  }
  //------------------- END EVENT HANLDERS-------------------

  initModule = function () {
    map = ru.map.getMap();
    setJqueryMap();

    getMapKml();
    setDrawingConfig();

    google.maps.event.addListener(map, 'click', addLatLng);
  }

  return {
    initModule: initModule
  };

}());