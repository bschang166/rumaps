'use strict';

/*
  ru.map.js
  module for high-level map functionalities
*/

ru.map = (function () {
  var
      map, mapOptions,
      getMap, initMap,
      initialize,
      initModule;

  mapOptions = {
    center: new google.maps.LatLng(40.52349, -74.43723),
    zoom: 17
  };

  getMap = function () {
    return map;
  }

  /*
  * Initialize map instance, with provided map options if given otherwise default options are used
  *
  * @param {HTMLElement} $container - DOM container for map, default is set to #map-canvas
  * @param {Object} options - map options for the constructed map instance
  */
  initMap = function ($container, options) {
    $container = $container || document.getElementById('map-canvas');
    mapOptions = options || mapOptions;
    map = new google.maps.Map($container, mapOptions);
  }

  //------------------- BEGIN EVENT HANLDERS-------------------
  initialize = function ($container, options) {
    initMap($container, options);

    ru.map.drawing.initModule();
  }
  //------------------- END EVENT HANLDERS-------------------

  initModule = function ($container, options) {
    initialize = initialize.bind(null,$container,options)

    google.maps.event.addDomListener(window, 'load', initialize);
  }

  return {
    getMap: getMap,
    initModule : initModule
  }
}());