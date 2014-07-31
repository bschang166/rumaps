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
        stateMap,

        setDomCache,
        setDomEventHandler,

        renderOverlay,

        onResourceReady,
        onLocationClick,

        configModule,
        initModule;

    // -------- BEGIN MODULE CONFIGURATION -----------
    configMap = {
        map_model     : null,
        allowed_config: {
            map_model: true
        }
    };
    stateMap = {
      domCache: null
    };
    // -------- END MODULE CONFIGURATION -----------

    setDomCache = function(){
      stateMap.domCache = {
          $location: $(".navbar-location")
      };
    };
    setDomEventHandler = function(){
        stateMap.domCache.$location.click(onLocationClick);
    };
    //------------------- BEGIN RENDER FUNCTIONS-------------------
    /*
    TODO: consider accepting arguments specifying the overlay types to render
      In addition when a location is not given, consider rendering all overlay objects stored in model
     */
    renderOverlay = function(location){
        var
            db,
            overlayRecords,
            map = configMap.map_model.getMap();
        if(location){
            db = configMap.map_model.getDB(location);
            overlayRecords = db().get();
            overlayRecords.forEach(function(record){
                record.overlayObject.setMap(map);
            });
        }
    };

    //------------------- END RENDER FUNCTIONS-------------------

    //------------------- BEGIN EVENT HANLDERS-------------------
    onResourceReady = function ( msg ) {
        renderOverlay("livingston");
        renderOverlay("busch");
    };

    onLocationClick = function(event){
        var
            mapOptions,
            map = ru.model.getMap(),
            location = event.target.id;

        switch(location){
            case "livingston":
                mapOptions = {
                    zoom: 17,
                    center: new google.maps.LatLng(40.523484, -74.437129)
                };
                break;
            case "busch":
                mapOptions = {
                    zoom: 17,
                    center: new google.maps.LatLng(40.523325, -74.458694)
                };
                break;
            default:
                mapOptions = {
                    zoom: 10,
                    center: new google.maps.LatLng(40.523484, -74.437129)
                };
                break;
        }
        map.setOptions(mapOptions);
        stateMap.domCache.$location.find(".active").removeClass("active");
        $(event.target).parent("li").addClass("active");
        return false;
    };
    //------------------- END EVENT HANLDERS-------------------

    // ---------------BEGIN PUBLIC FUNCTIONS ------------------

    configModule = function ( configs ) {
        util.conditionalExtend(configMap, configs, configMap.allowed_config);
    };

    initModule = function () {
        setDomCache();
        setDomEventHandler();
        PubSub.subscribe('resource.ready', onResourceReady);

        $("#livingston").trigger("click");
    };

    // ---------------END PUBLIC FUNCTIONS ------------------

    return {
        configModule: configModule,
        initModule  : initModule
    };
}());