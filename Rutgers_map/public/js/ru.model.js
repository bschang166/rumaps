/*
  ru.model.js
  Request and manages data on client-side

  Dependencies < global var >:
  - jquery.js < $ >
  - pubsub.js < PubSub >
*/

'use strict';

ru.model = (function () {

  var
    util = ru.util,

    databaseMap,
    configMap,
    stateMap,

    initializeMap,

    createDB,
    getDB,
    getMap,
    configModule,
    initModule;

  // ------------ BEGIN MODULE CONFIG ---------------
    databaseMap = {};
    configMap = {
        $container: null,
        map_options: {
          zoom: 17,
          center: new google.maps.LatLng(40.523484, -74.437129) // Livingston Campus
        },
        allowed_config: {
          $container: true,
          map_options: true
        }
    };
    stateMap = {
        map: null
    };
  // ------------ END MODULE CONFIG ------------------

  // ----------- BEGIN EVENT HANDLERS -------------
    initializeMap = function () {
        configMap.$container = configMap.$container || document.getElementById('map-canvas');
        stateMap.map = new google.maps.Map(configMap.$container, configMap.map_options);
    };

  // ----------- END EVENT HANDLERS ----------------

  // ----------- BEGIN PUBLIC FUNCTIONS ------------
    createDB = function(name){
        if (databaseMap[name]){
            return databaseMap[name];
        }
        databaseMap[name] = TAFFY();
        return databaseMap[name];
    };

    getDB = function(name){
        if (!name){
            return databaseMap;
        }
        return databaseMap[name];
    };

    getMap = function(){
      return stateMap.map;
    };

    configModule = function (configs) {
        util.conditionalExtend(configMap, configs, configMap.allowed_config);
    };

    initModule = function () {
        initializeMap();
        // google.maps.event.addDomListener(window, 'load', initializeMap);
    };
  // ----------- END PUBLIC FUNCTIONS ------------
  return {
      createDB    : createDB,
      getDB       : getDB,
      getMap      : getMap,
      configModule: configModule,
      initModule  : initModule
  };

}());



