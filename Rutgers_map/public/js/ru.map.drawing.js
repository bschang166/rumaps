/*
  ru.map.drawings.js
  Retrieves map kml data from server and draws polygon onto map
  
  Dependencies < global var >:
  - jquery.js < $ >
  - pubsub.js < PubSub >
  
*/

'use strict';

ru.map.drawing = (function () {
  var
    util = ru.util,
    configMap,

    drawPolygon,
    removePolygon,
    onChangeMap,

    configModule,
    initModule;

  // -------- BEGIN MODULE CONFIGURATION -----------
  configMap = {

    map_model: null,
    map: null,
    polygon_option: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    },

    allowed_config: {
      map_model: true,
      map: true,
      polygon_option: true
    }

  };
  // -------- END MODULE CONFIGURATION -----------

  //------------------- BEGIN DRAWINGS FUNCTIONS-------------------

  drawPolygon = function (polygonEntries) {
    for (var i = 0, n = polygonEntries.length; i < n; i++) {
      var
        entry, paths, title,
        polygonOptions = {},
        polygon;

      entry = polygonEntries[i];

      paths = entry.paths;
      title = entry.title;

      if (paths.length < 2) {
        throw new Error('ERROR: polygon.paths option\n'
          + 'Polygon entry needs to have at least 3 coordinates\n'
          + entry);
      }
      if (title === '') {
        throw new Error('ERROR: polygon.title option\n'
          + 'Polygon entry needs to have a title\n'
          + entry);
      }

      polygonOptions = $.extend(polygonOptions, configMap.polygon_option);

      polygon = new google.maps.Polygon(polygonOptions);
      polygon.setMap(configMap.map);

      configMap.map_model.addPolygon(polygon);
    }
  };

  removePolygon = function (key) {
    var
      polygonStore = configMap.map_model.getPolygonStore();

    if (polygonStore.hasOwnProperty(key)) {
      if (polygonStore[key].length > 0) {
        polygonStore[key].setMap(null);
        delete polygonStore[key];
      }
    }
  };
  //------------------- END DRAWINGS FUNCTIONS-------------------

  //------------------- BEGIN EVENT HANLDERS-------------------
  onChangeMap = function(msg, data){
    if (msg === 'changestate.location') {
      var
        polygonLocation = configMap.map_model.getPolygonStore(data.location);
    }
  };
  //------------------- END EVENT HANLDERS-------------------

  // ---------------BEGIN PUBLIC FUNCTIONS ------------------

  configModule = function (configs) {
    util.conditionalExtend(configMap, configs, configMap.allowed_config);
  };

  initModule = function () {
    PubSub.subscribe('changestate.location', onChangeMap);
  };

  // ---------------END PUBLIC FUNCTIONS ------------------

  return {
    configModule: configModule,
    initModule: initModule
  };

}());