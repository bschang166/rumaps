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
    msgMap = {
      GET_KML: 'get.data.kml',
      CHANGE_LOCATION: 'changestate.location'
    },

    configMap,
    stateMap,

    getData,
    requestMapData,

    onMapData,
    initializeMap,

    getDrawingStore,
    configModule,
    initModule;

  // ------------ BEGIN MODULE CONFIG ---------------
  configMap = {
    $container: document.getElementById('#map-canvas'),
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
    map: null,
    drawings: {
      polygon: {}
    },
    data_request: 1,
    data_response: 0
  };
  // ------------ END MODULE CONFIG ------------------

  // ------------BEGIN AJAX REQUEST----------------
   getData = function (url, pub_msg) {
    $.ajax({
      type: 'GET',
      url: url
    }).then(
      function (data) {
        var wrapper = {
          data: data,
          url: url,
          // ex. location for '/map/kml/livingston' is 'livingston'
          location: data.url.substring(data.url.lastIndexOf('/') + 1)
        };
        PubSub.publish(pub_msg, wrapper);
      },
      function (err) {
        // TODO: publish error event / pass on eror?
        throw err;
      }
    );
  };
   requestMapData = function () {
     getData('/map/kml/livingston', msgMap.GET_KML);
   };
  // ------------END AJAX REQUEST----------------

  // ----------- BEGIN EVENT HANDLERS -------------
  onMapData = function (msg, data) {
    if (msg === msgMap.GET_KML) {
      var
        parsedData = new util.KmlParser(data).parse();

      stateMap.drawings.polygon[data.location] = parsedData;
      stateMap.data_response++;

      // if all AJAX requests/response are handled, publish msg for initalizing map with data
      if (stateMap.data_response === stateMap.data_request) {
        PubSub.publish(CHANGE_LOCATION);
      }
    }
  };
  initializeMap = function () {
    stateMap.map = new google.maps.Map(configMap.$container, configMap.map_options);
  };

  // ----------- END EVENT HANDLERS ----------------

  // ----------- BEGIN PUBLIC FUNCTIONS ------------
  getDrawingStore = function (type, location) {
    var store;

    if (type && location) {
      store = stateMap.drawings[type][location];
      return store ? store : new Error('No drawing store at type, location: ' + type + ',' + location);
    }
    else if (type) {
      store = stateMap.drawings[type]
      return store ? store : new Error('No drawing store at type: ' + type);
    }

    return stateMap.drawings;
  };
  addDrawing = function (drawing, type, location) { 
    if (!(location in stateMap.drawings[type])) {
      stateMap.drawings[type][location] = [];
    }
    stateMap.drawings[type][location].push(drawing);
  };

  configModule = function (configs) {
    util.conditionalExtend(configMap, configs, configMap.allowed_config);

    PubSub.subscribe(msgMap.GET_KML, onMapData);
  }

  initModule = function () {
    initializeMap();
    requestMapData();
  }
  // ----------- END PUBLIC FUNCTIONS ------------
  return {
    configModule: configModule,
    initModule: initModule
  };

});



