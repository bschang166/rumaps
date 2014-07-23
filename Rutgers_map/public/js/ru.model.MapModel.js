/*
  ru.model.MapModel
  Constructor function for instantiating a MapModel

  TODO:
  - Encapsulation is off
  - How to manage map models:
    + separate instances of map model for each maps? <-- current, will need key-value in ru.model.js instead
    + One map model but with key-value mappings for different maps? 
  - Adjust variable types for single / multiple, ex. one map or allow multiple maps...
*/

'use strict';

ru.model.MapModel = (function () {
  var
    center,
    defaultOpts,
    findMapCenter,
    MapModel;

  findMapCenter = function (name) {
    var center;
    switch (name) {
      case 'Livingston':
        center = new google.maps.LatLng(40.523484, -74.437129);
        break;
      case 'Busch':
        center = new google.maps.LatLng(40.523325, -74.458694);
        break;
    }
  };

  MapModel = function (name, map_options) {
    var defaultOpts = {
      zoom: 17,
      center: findMapCenter(name),
    };

    this.polygonStore = {};
    this.mapOptions = $.extend(defaultOpts, map_options);

    this.publish_msg = {
      MAP_DATA_KML: 'map.data.kml'
    };
  };
  MapModel.prototype.getPolygonStore = function () {
    return this.polygonStore;
  };
  MapModel.prototype.addPolygon = function (polygon) {
    this.polygonStore[polygon.title] = polygon;
  };
  MapModel.prototype.getMap = function () {
    return this.map;
  };
  MapModel.prototype.setMap = function (newMap) {
    this.map = newMap;
  };

  return MapModel;

}());