/*
  ru.js
  Root namespace module
*/

'use strict';

var ru = (function () {
  var
    configModule,
    initModule;

  configModule = function () {
      ru.model.configModule();
      ru.resource.configModule({map_model: ru.model});
      ru.render.configModule({map_model: ru.model});
  };

  initModule = function () {
    ru.model.initModule();
    ru.render.initModule();
    ru.resource.initModule();

  };

  return {
      configModule: configModule,
      initModule  : initModule
  };

}());

$(function () {
    ru.configModule();
    ru.initModule();

    /*
     var map = new google.maps.Map(document.getElementById("map-canvas"), {
     zoom: 17,
     center: new google.maps.LatLng(40.523484, -74.437129) // Livingston Campus
     });
     */
});
