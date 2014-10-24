/**
 * Created by Benson on 10/1/2014.
 */

'use strict';

ru.maps.map.data = (function(){

    var map = ru.maps.map;

    /*
     loads map data from the given url and render data as a data layer contained in map.data
     currently accepts GeoJSON file
     @parameter {String} The publicly accessible URL to retrieve GeoJSON to load from.
     */
    var loadFeatureData = function(url){
        var urlsToLoad;

        var isArray = (Object.prototype.toString.call(url) == "[object Array]");
        if (isArray){
            urlsToLoad = url;
        } else {
            urlsToLoad = Array.prototype.slice.call(arguments);
        }

        for (var i= 0; i < urlsToLoad.length; i++){
            map.getInstance().data.loadGeoJson(urlsToLoad[i]);
        }

        setTimeout(function(){
            google.maps.event.trigger(map.data, "dataChanged");
        }, 1000);
    };
    /*
      returns all features in data collection in an array
      each feature is an object with keys and values for each feature property
      @parameter None
      @return {Array} features as objects
     */
    var getAllFeatureData = function(){
        var results = [];
        map.getInstance().data.forEach(function(feature){
            var object = feature;
            feature.forEachProperty(function(val, key){
                object[key] = val;
            }) ;
            results.push(object);
        });
        return results;
    };
    var findFeatureByType = function(type){
        var results = [];
        map.getInstance().data.forEach(function(feature){
            var types = feature.getProperty("types");

            var hasType = (types.indexOf(type) != -1);
            if (hasType){
                results.push(feature);
            }
        });
        return results;
    };


    /*
     sets the style for all features in the data layer.
     @parameter {object | function(feature) } Object with desired style options or function that computes style for each feature
     */
    var setDefaultFeatureStyle = function(styleOptions){
        map.getInstance().data.setStyle(styleOptions);
    };
    var setDistinctFeatureStyle = function(feature, styleOptions){
        map.getInstance().data.overrideStyle(feature, styleOptions);
    }
    var removeDistinctFeatureStyle = function(feature){
        map.getInstance().data.revertStyle(feature);
    }

    var calcFeatureCenterPosition = function(feature){
        var bounds = new google.maps.LatLngBounds();

        var featurePositionData = feature.getGeometry().getArray();
        featurePositionData.forEach(function(positions){
            positions.getArray().forEach(function(latLong){
                bounds.extend(latLong);
            });
        })

        return bounds.getCenter();
    } ;

    var addListener = function(event, eventHandler){
        map.getInstance().data.addListener(event, eventHandler);
    };

    var _setEventListeners = function(){
        addListener("addfeature", function(event){
            var feature = event.feature;
            var typesString = feature.getProperty("types");

            if (typesString){
                var typesArray = typesString.split(",");
                var typesArrayTrimmed = typesArray.map(function(typeStr){
                    return typeStr.trim();
                });
                feature.setProperty("types", typesArrayTrimmed);
            } else {
                feature.setProperty("types", []);
            }
        });

        addListener("mouseover", function(event){
            setDistinctFeatureStyle(event.feature, {
                fillColor:"red"
            });
        });
        addListener("mouseout", function(event){
            removeDistinctFeatureStyle(event.feature);
        });
        addListener("click", function(event){
            var feature = event.feature;
            var center = calcFeatureCenterPosition(feature);
            var contentString;
            feature.forEachProperty(function(val, key){
                var content = "<div>"+key+ ": "+val+"</div></br>";
                contentString+=content;
            });
            var infoWindow = new google.maps.InfoWindow({
                position: center,
                content: contentString
            });
            infoWindow.open(map.getInstance());
        });

    };

    var loadAndInitialize = function(dataUrl){
        _setEventListeners();
        loadFeatureData(dataUrl);
    };

    return {
        loadFeatureData: loadFeatureData,
        getAllFeatureData: getAllFeatureData,
        findFeatureByType: findFeatureByType,

        setDistinctFeatureStyle: setDistinctFeatureStyle,
        removeDistinctFeatureStyle : removeDistinctFeatureStyle,

        calcFeatureCenterPosition: calcFeatureCenterPosition,

        addListener : addListener,
        loadAndInitialize : loadAndInitialize
    };

}());


/*
 Private function.
 finds all features by a given filter function.
 @parameter {Function(featurePropertyValue, featurePropertyKey)} function to filter features by
 @return {array} array containing filtered feature results
 *//*

var _findFeature = function(filterFunction){
    // prepare an array to store the filtered feature objects
    var featureResults = [];

    // iterate through each features in the map data layer
    map.getInstance().data.forEach(function(feature){
        // set up a status variable to monitor filtering for each feature
        var isAllowedByFilter = false;

        // for each feature property, execute filter function with value, key as parameters
        feature.forEachProperty(function(val, key){
            if (isAllowedByFilter){ return; }

            // if feature passes the filter, status bool is set to true to indicate a match
            isAllowedByFilter = filterFunction(val,key);
        });
        // add feature to filtered results if feature is allowed
        if (isAllowedByFilter){
            featureResults.push(feature);
        }
    });

    return featureResults;
};

*/
/*
 Private function.
 A curry function to make findFeature functions with different filter context.
 @parameter {String} The name of feature property to filter.
 @return {function} The curried function with specified filter.
 *//*

var _findFeatureFunctionFactory = function(propertyToFilter){
    var resultFunction = function(filterTerm){
        var filterFunction = function(val, key){
            if (key == propertyToFilter && val == filterTerm){
                return true;
            }
        };
        var results = _findFeature(filterFunction);
        return results;
    };
    return resultFunction;
};

var
    findFeatureByName = _findFeatureFunctionFactory("name"),
    findFeatureByType = _findFeatureFunctionFactory("types"),
    findFeatureByDescription = _findFeatureFunctionFactory("description")
    ;*/
