/*
 ru.util.js
 Module for utility functions
 */

'use strict';

ru.util = (function () {

    var
        isObject,
        conditionalExtend,
        KmlParser;

    isObject = function ( arg ) {
        if (Object.prototype.toString.call(arg) === '[object Object]') {
            return true;
        }
        return false;
    };

    conditionalExtend = function ( target, src, allowed ) {
        if (!src) {
            return;
        }

        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                if (allowed[prop] === true) {
                    if (isObject(target) && isObject(src)) {
                        $.extend(target, src);
                    } else {
                        target[prop] = src[prop];
                    }
                }
            }
        }
    };

    KmlParser = function ( kmlData ) {
        this.data = kmlData;
        this.xmlDoc = $.parseXML(kmlData);
        this.selectors = "Polygon";
    };
    /*
    Purpose: Allows user to assign selectors to filter the overlay which will be parsed.
      Ex. setOverlayTypeSelector("Polygon", "Point", "LineString")

    @method setOverlayTypeSelector
    @param {string}|{array} - Tag names of overlay type to be selected

    TODO: Google map engine uses different overlay type name from Google Map API(polygon is exception)
      -> Ex. A "Point" in google map engine is "Marker" in Google Map API
               "LineString"                    "Polyline"
        Consider have either a built-in dictionary or have user pass in, { Point: "Marker" }
     */
    KmlParser.prototype.setOverlayTypeSelector = function () {
        var argsArray;
        if ($.isArray(arguments[0])){
            argsArray = arguments[0];
        }
        else if(arguments.length > 1){
            argsArray = Array.prototype.slice.apply(this, arguments);
        }
        this.selectors = argsArray.join();
    };
    /*
    Purpose: Parses kmlData to an object consisting of arrays for each set selectors.
      Currently uses the following tag names:
        -Placemark, to find each overlay object, ex. (Polygon1, Polygon2, etc.)
          -> set selectors, to find the overlay types, ex. polygon, point, linestring...
          -> name, to find the title of each overlay object inside a placemark
          -> coordinates, to find the paths of overlay object

    @method parse
    @return {object} The object with parsed data formatted in the following structure:
      returnedObject = {
        Polygon: [ overlayOptions ],
        OverlayType2: [ overlayOptions ],
        etc..
      }
        where overlayOptions = { title: "Object name", paths: [ Object coordinates ] }
        TODO: parse <Style> in kml for additional overlayOptions ( stroke, fill styles )
     */
    KmlParser.prototype.parse = function () {
        var
            xml,
            placemarkNodes,
            overlays = {};

        xml = $(this.xmlDoc);
        placemarkNodes = xml.find('Placemark');

        for (var i = 0, n = placemarkNodes.length; i < n; i++) {
            var
                currentPlacemark, title, overlayType, paths;

            // Each placemark should have only 1 title and belong to a single overlay type, ex. polygon
            currentPlacemark = placemarkNodes.eq(i);
            title = currentPlacemark.find('name').eq(0).text();

            overlayType = currentPlacemark.find(this.selectors).eq(0).prop("tagName");
            if (!overlayType){
                return;
            }
            if (!overlays[overlayType]){
                overlays[overlayType] = [];
            }

            paths = currentPlacemark.find('coordinates').eq(0).text().split(',0.0 ');
            paths.forEach(function ( latLongStr, i ) {
                var
                    latLong,
                    lat, long;

                latLong = latLongStr.split(',');
                long = parseFloat(latLong[0]);
                lat = parseFloat(latLong[1]);

                paths[i] = new google.maps.LatLng(lat, long);
            });

            overlays[overlayType].push({
                title: title,
                paths: paths
            });
        }
        return overlays;
    };

    return {
        isObject         : isObject,
        conditionalExtend: conditionalExtend,
        KmlParser        : KmlParser
    };

}());