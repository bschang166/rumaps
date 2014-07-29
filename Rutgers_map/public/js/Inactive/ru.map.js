/*
  ru.map.js
  module for high-level map functionalities
*/

'use strict';

ru.map = (function () {
  var
    util = ru.util.js,
    configMap,

    map, mapOptions,

    configModule,
    initModule;

  // ------------- BEGIN MODULE CONFIG --------------------

  configMap = {
    map_model: null,
    map_options: {
      center: new google.maps.LatLng(40.523484, -74.437129), // Livingston Campus
      zoom: 17
    },

    allowed_config: {
      map_model: true, 
      map_options: true,
    }
  };
  // ------------- END MODULE CONFIG -------------------


  //------------------- BEGIN EVENT HANLDERS-------------------
  //------------------- END EVENT HANLDERS-------------------

  // -------------- BEGIN PUBLIC FUNCTIONS -----------------------

  configModule = function (configs, allowed) {
    util.conditionalExtend(configMap, configs, allowed);
  }

  initModule = function ($container, options) {
    
  }
  // -------------- END PUBLIC FUNCTIONS ------------------------

  return {
    configModule: configModule,
    initModule : initModule
  }
}());
