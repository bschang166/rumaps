/*
  ru.js
  Root namespace module
*/

'use strict';

var ru = (function () {
  var initModule;

  initModule = function () {
    ru.model.initModule();
    ru.map.initModule();
  }

  return {
    initModule: initModule
  };

}());

