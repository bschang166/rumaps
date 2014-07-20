'use strict';

/*
  ru.js
  Root namespace module
*/

var ru = (function () {
  var initModule;

  initModule = function () {
    ru.map.initModule();
  }

  return {
    initModule: initModule
  };

}());

