/**
 * Created by Benson on 9/26/2014.
 */

'use strict';


ru.maps.overlayCollectionFactory = (function(){

    var OverlayCollection = function(mapInstance, overlayType){
        this.map = mapInstance;
        this.overlays = {};
        this.options = {};

        // constructor function to be specified by each low-level overlay type
        // ex. for marker, this.createOverlay = google.maps.Marker
        // *** the above is needed for extending an overlay Collection such as adding new methods to marker
        this.createOverlay = google.maps[overlayType];
    };
    OverlayCollection.prototype.add = function(key, options){
        if (!(this.overlays[key])){
            this.overlays[key] = [];
        }

        var defaultOptions = this.options;
        for (var prop in defaultOptions){
            if (defaultOptions.hasOwnProperty(prop)){
                options[prop] = defaultOptions[prop];
            }
        }

        var overlayToAdd = new this.createOverlay(options);
        this.overlays[key].push(overlayToAdd);
    };
    OverlayCollection.prototype.remove = function(key){
        if (this.overlays[key]){
            this.overlays[key].forEach(function(overlay){
                overlay.setMap(null);
            });
            delete this.overlays[key];
        }
    };
    OverlayCollection.prototype.setMap = function(selectedType){
        var self = this;
        this.overlays[selectedType].forEach(function(overlay){
            overlay.setMap(self.map);
        });
    };
    OverlayCollection.prototype.removeMap = function(selectedType){
        this.overlays[selectedType].forEach(function(overlay){
            overlay.setMap(null);
        });
    };
    OverlayCollection.prototype.setOptions = function(options){
        this.options = options;
    };

    var MarkerCollection = (function(){
        var MarkerCollection = function(mapInstance){
            OverlayCollection.call(this, mapInstance, "Marker");
        };
        MarkerCollection.prototype = Object.create(OverlayCollection.prototype);
        return MarkerCollection;
    }());


    var overlayCollectionFactory = function(mapInstance, overlayType){
        var isString = (typeof overlayType == "string" ||
            overlayType instanceof String);
        if (!isString){
            // TODO: handle non-string error
            console.log("not string");
            return undefined;
        }

        var product;
        switch (overlayType){
            case "Marker":
                product = new MarkerCollection(mapInstance);
                break;
            default:
                product = new OverlayCollection(mapInstance, overlayType);
                break;
        }
        return product;
    }

    return overlayCollectionFactory;
}());
