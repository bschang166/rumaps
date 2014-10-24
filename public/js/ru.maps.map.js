/**
 * Created by Benson on 9/26/2014.
 */

'use strict';

ru.maps.map = (function(){
    var
        // to be instantiated by calling initialize()
        map,
        // initialized in ru.maps.map.data.js
        data
    ;

    var $campusLocations = $("#campusLocation");

    // Returns the contained map object
    var getInstance = function(){
        return map;
    };

    var setOptions = function(options){
        map.setOptions(options);
    };

    var getCurrentCampusLocation = function(){
        return $campusLocations.find("a[data-active=true]").prop("id");
    };

    /*
      sets the center of map to the designated location
      @parameter {LatLng} The location to set the map center as
    */
    var setToLocation = function(latLng){
        map.panTo(latLng);
    };

    var _getControlPosition = function(positionAbbr){
        var position;
        switch (positionAbbr){
            case "TL": position="TOP_LEFT"; break;
            case "TC": position="TOP_CENTER"; break;
            case "TR": position="TOP_RIGHT"; break;
            case "LT": position="LEFT_TOP"; break;
            case "RT": position="RIGHT_TOP"; break;
            case "LC": position="LEFT_CENTER"; break;
            case "RC": position="RIGHT_CENTER"; break;
            case "LB": position="LEFT_BOTTOM"; break;
            case "RB": position="RIGHT_BOTTOM"; break;
            case "BL": position="BOTTOM_LEFT"; break;
            case "BC": position="BOTTOM_CENTER"; break;
            case "BR": position="BOTTOM_RIGHT"; break;

            default: position="TOP_CENTER"; break;
        };

        return google.maps.ControlPosition[position];
    };
    var addControl = function(control, positionAbbr){
        var position = _getControlPosition(positionAbbr);
        map.controls[position].push(control);
    };
    var clearControl = function(positionAbbr){
        var position = _getControlPosition(positionAbbr);
        map.controls[position].clear();
    }

    var initialize = function(containerId, mapOptions){
        // The default map options with center set to the Busch campus
        if (!mapOptions) {
            mapOptions = {
                zoom  : 17,
                center: ru.maps.configs.BUSCH_LATLNG
            };
        }
        // Instantiates the contained map reference using the previous prepared map options
        map = new google.maps.Map(document.getElementById(containerId), mapOptions);


    }
    return {
        getInstance: getInstance,
        setOptions: setOptions,
        getCurrentCampusLocation : getCurrentCampusLocation,
        setToLocation: setToLocation,

        addControl : addControl,
        clearControl : clearControl,

        initialize : initialize
    }
}());
