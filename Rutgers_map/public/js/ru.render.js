/*
 ru.render.js
 Retrieves map kml data from server and draws polygon onto map

 Dependencies < global var >:
 - jquery.js < $ >
 - pubsub.js < PubSub >

 */

'use strict';

ru.render = (function () {
    var
        util = ru.util,
        configMap,

        renderOverlay,

        onResourceReady,

        configModule,
        initModule;

    // -------- BEGIN MODULE CONFIGURATION -----------
    configMap = {
        map_model     : null,
        allowed_config: {
            map_model: true
        }

    };
    // -------- END MODULE CONFIGURATION -----------

    //------------------- BEGIN RENDER FUNCTIONS-------------------
    /*


    TODO: consider accepting arguments specifying the overlay types to render
      In addition when a location is not given, consider rendering all overlay objects stored in model
     */
    renderOverlay = function(location){
        var
            db,
            overlayByType,
            map = configMap.map_model.getMap();
        if(location){
            db = configMap.map_model.getDB(location);
            overlayByType = db().get();
            overlayByType.forEach(function(overlayRecord){
                overlayRecord.overlay.forEach(function(overlayObject){
                    overlayObject.setMap(map);
                });
            });
        }
    };

    //------------------- END RENDER FUNCTIONS-------------------

    //------------------- BEGIN EVENT HANLDERS-------------------
    onResourceReady = function ( msg ) {
        renderOverlay("livingston");
    };
    //------------------- END EVENT HANLDERS-------------------

    // ---------------BEGIN PUBLIC FUNCTIONS ------------------

    configModule = function ( configs ) {
        util.conditionalExtend(configMap, configs, configMap.allowed_config);
    };

    initModule = function () {
        PubSub.subscribe('resource.ready', onResourceReady);
    };

    // ---------------END PUBLIC FUNCTIONS ------------------

    return {
        configModule: configModule,
        initModule  : initModule
    };
}());