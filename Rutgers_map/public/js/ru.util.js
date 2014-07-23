/*
  ru.util.js
  Module for utility functions
*/

'use strict';

ru.util = (function () {

  var
    isObject,
    conditionalExtend,
    KmlParser;

  isObject = function(arg){
    if (Object.prototype.toString.call(arg) === '[object Object]'){
      return true;
    }
    return false;
  };

  conditionalExtend = function (target, src, allowed) {
    if (!src) {
      return;
    }

    for (prop in src) {
      if (src.hasOwnProperty(prop)) {
        if (allowed[prop] === true) {
          if (isObject(target) && isObject(src)) {
            $.extend(target, src);
          } else {
            target[prop] = src[prop];
          }
        }
      }
    }
  };

  KmlParser = function (kmlData) {
    this.data = kmlData;
  };
  KmlParser.prototype.parse = function () {

    var
      hiddenWrapper = $(document.createElement('div')),
      entries,
      placemarkList = [];

    hiddenWrapper.html(this.data);

    entries = hiddenWrapper.find('placemark');

    for (var i = 0, n = entries.length; i < n; i++) {
      var
        currentEntry, coordinates,
        placemark = {};

      currentEntry = entries.eq(i);
      placemark.title = currentEntry.find('name').text();

      coordinates = currentEntry.find('coordinates').text().split(',0.0 ');

      coordinates.forEach(function (coordset, i) {
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
    return placemarkList;

  };

  return {
    KmlParser: KmlParser,
    conditionalExtend : conditionalExtend
  };

}());