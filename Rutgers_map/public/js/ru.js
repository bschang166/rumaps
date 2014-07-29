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
    ru.resource.initModule();
    ru.render.initModule();
  };

  return {
      configModule: configModule,
      initModule  : initModule
  };

}());

