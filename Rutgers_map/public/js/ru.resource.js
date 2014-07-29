/*
  ru.resource.js
  Responsible for making AJAX requests and process responses:
  - parse data if necessary, ex. parse response data of .kml files
  - call the model and store the processed data
*/

"use strict";

ru.resource = (function () {
    var
        util = ru.util,

        configMap,

        onGetResponse,
        requestMapData,

        configModule,
        initModule;

    configMap = {
        map_model      : null,
        deferred_queue : null,
        overlay_options: {
            Polygon: {
                strokeColor  : '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight : 3,
                fillColor    : '#FF0000',
                fillOpacity  : 0.35
            }
        },
        allowed_map    : {
            map_model      : true,
            overlay_options: true,
            deferred_queue : true
        }
    };

// ------------BEGIN AJAX REQUEST----------------
    /*
     Handles results of GET requests by:
     - parse data if needed, ex. content-type is text/kml
     - create database in model with the name as location for the GET request, ex. livingston
     - instantiates google overlay objects from data
     - inserts google overlay objects into the created db
     */
    onGetResponse = function ( data, status, xhr ) {
        var
            database,
            // ex. location for '/map/kml/livingston' is 'livingston'
            location = xhr.getResponseHeader("location");

        if (xhr.getResponseHeader("Content-Type").indexOf("text/kml") != -1 ) {
            data = new util.KmlParser(data).parse();
        }
        database = configMap.map_model.createDB(location);

        /*
         Considering data as having the structure:
         data = {
         overlayType1: [ overlayType1 overlayOptions ],
         overlayType2: [ overlayType2 overlayOptions ],
         etc...
         }
         with overlayType such as polygon, polyline, marker, info window, etc...
         */
        for (var overlayType in data) {
            if (data.hasOwnProperty(overlayType)) {
                if (!google.maps[overlayType]) {
                    throw new Error("overlay type of: " + overlayType + " is undefined for google.maps")
                }

                data[overlayType].forEach(function ( overlayOpts, i ) {
                    var overlayOptions = {};
                    $.extend(overlayOptions, configMap.overlay_options[overlayType], overlayOpts);
                    data[overlayType][i] = new google.maps[overlayType](overlayOptions);
                });

                database.insert({
                    overlayType: overlayType,
                    overlay: data[overlayType]
                });
            }
        }
    };

    /*
    Purpose: Initiates the queue of AJAX requests to request any map data needed
      When every AJAX requests in the queue are resolved, (ie. callbacks for the requests are called)
      a message is published notifying the app that the resources are ready to be used
     */
    requestMapData = function () {
        configMap.deferred_queue =
            configMap.deferred_queue || [$.get("/map/kml/livingston", onGetResponse)];
        $.when.apply($, configMap.deferred_queue)
            .then(
            function () {
                PubSub.publish("resource.ready");
            },
            // TODO: handle error here or individual AJAX requests
            function ( err ) {
                throw err;
            }
        );
    };
// ------------END AJAX REQUEST----------------

// -----------BEGIN PUBLIC METHODS-------------

    configModule = function ( configs ) {
        util.conditionalExtend(configMap, configs, configMap.allowed_map);
    };

    initModule = function () {
        requestMapData();
    };
// -----------END PUBLIC METHODS-------------

    return {
        configModule: configModule,
        initModule  : initModule
    };

}());