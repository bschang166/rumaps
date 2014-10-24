/**
 * Created by Benson on 9/28/2014.
 */

'use strict';

ru.maps.controller.selectionCtrl = (function(map){

    var
        $allSelectors = $("#featureSelection").find("input:radio"),
        $onCampusSelectors = $("#onCampusSelector").find("input:radio"),
        $offCampusSelectors = $("#offCampusSelector").find("input:radio")
    ;

    var overlays = {
        /*
        area is onCampus or offCampus
        type refers to quick-search selector chosen by user, ex. Academic Department..

        area : {
            highlighter: {
              type : []
            }
            infoContainer: {
              type: []
            }
        }
         */
        onCampus: {},
        offCampus: {}
    };

    var placeService = new google.maps.places.PlacesService(map.getInstance());

    /*
    Returns a specific type of highlighter (overlay) that can be configured to set on map
      Alter to set the type of overlay to use as highlighter ( TODO: or as factory if need runtime change )
    @params { Map Overlay Options Object } The options which to create the highlighter overlay from
    @return { Map Overlay } returns the overlay to use as highlighter
     */
    var createHighlighter = function(options){
        options.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        return new google.maps.Marker(options);
    };
    /*
    Returns a set options object to use for highlighter creation, with values from a feature object in map data layer
      Make adjustments here for highlighter config options
    @params { map feature object } The feature to get values to set options from
    @return { Map Overlay Option object } Object with designated options key-value
     */
    var getOnCampusHighlighterOption = function(feature){
        var options = {
            position : map.data.calcFeatureCenterPosition(feature),
            title : feature.getProperty("name"),
            animation: google.maps.Animation.DROP
        };
        return options;
    };

    var createInfoContainer = function(options){
        return new google.maps.InfoWindow(options);
    };
    var getOnCampusInfoContainerOption = function(feature){
        var options = {
            position : map.data.calcFeatureCenterPosition(feature),
            content: feature.getProperty("description")
        };
        return options;
    }

    var setHighlighterInfoContainerBinding = function(highlighter, infoContainer){
        var showInfo = function(event){
            infoContainer.open(map.getInstance());
        };
        google.maps.event.addListener(highlighter,"click", showInfo);
    };
    var cacheOverlay = function(cacheOptions){
        var
            location = cacheOptions.location,
            selectionType = cacheOptions.selectionType,
            renderType = cacheOptions.renderType,
            overlay = cacheOptions.overlay
        ;

        if (!overlays[location][renderType]){
            overlays[location][renderType] = {};
        }
        if (!overlays[location][renderType][selectionType]){
            overlays[location][renderType][selectionType] = [];
        }
        overlays[location][renderType][selectionType].push(overlay);
    };

    var getSelectorTypes = function($selectors){
        var selectorTypes = [];
        $selectors.each(function(){
            var type = this.value;
            selectorTypes.push(type);
        });
        return selectorTypes;
    };

    var initializeOnCampusOverlays = function(){
        var selectionTypes = getSelectorTypes($onCampusSelectors);

        selectionTypes.forEach(function(type){
            // get feature data for the selected type
           var features = map.data.findFeatureByType(type);

            // create and cache overlays for each feature and
            features.forEach(function(feature){
                var  baseCacheOptions = {
                         location: "onCampus",
                         selectionType: type
                     };

                var highlighterOptions = getOnCampusHighlighterOption(feature);
                var highlighter = createHighlighter(highlighterOptions);
                var highlighterCacheOptions = $.extend({
                    renderType: "highlighter",
                    overlay: highlighter
                }, baseCacheOptions);
                cacheOverlay(highlighterCacheOptions);

                var infoContainerOptions = getOnCampusInfoContainerOption(feature);
                var infoContainer = createInfoContainer(infoContainerOptions);
                var infoCacheOptions = $.extend({
                    renderType: "infoContainer",
                    overlay: infoContainer
                }, baseCacheOptions);
                cacheOverlay(infoCacheOptions);

                setHighlighterInfoContainerBinding(highlighter, infoContainer);
            });
        });
    };

    var getHighlighter = function(area, type){
        return overlays[area].highlighter[type] || [];
    };

    // when checkbox is checked
    var highlightSelection = function(area, checkedType){
        // get cached highlighters for the checked type
        var highlighters = getHighlighter(area, checkedType);

        // render each overlay of checked type on map
        highlighters.forEach(function(overlay){
            overlay.setMap(map.getInstance());
        });
    };
    // when checkbox is unchecked
    var unHighlightSelection = function(area, checkedType){
        // get cached highlighters for the checked type
        var highlighters = getHighlighter(area, checkedType);

        // remove highlights from map
        highlighters.forEach(function(overlay){
            overlay.setMap(null);
        });
    };

    // if a type is selected already (highlighters rendered on map), unhighlight those first
    var previousType;
    var toggleSelection = function(){
        var selectorLocation = this.parentNode.parentNode.getAttribute("data-area");
        if (previousType){
            unHighlightSelection(selectorLocation,previousType);
        }
        highlightSelection(selectorLocation, this.value);

        previousType = this.value;
    }
    // initialize and cache overlays for available check types when on-campus map data is finished loading
    google.maps.event.addListener(map.data,"dataChanged", initializeOnCampusOverlays);

    // Attaches event handlers to html elements
    $allSelectors.change(toggleSelection);
    
    // ---------- OFF-CAMPUS GOOGLE PLACE ---------------

    var initializeOffCampusOverlays = function(){
        // get selectable types from off-campus selectors 
        var types = getSelectorTypes($offCampusSelectors);

        // make search service request for each type
        types.forEach(function(type){
            var request = {
                types: [type]
            }
        });
    };



}(ru.maps.map));