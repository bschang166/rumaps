/**
 * Created by Benson on 9/28/2014.
 */

'use strict';

ru.maps.controller = {};

ru.maps.controller.locationCtrl = (function(){

    $("#campusLocation").find("a").each(function(){
        var locationLookup = this.id.toUpperCase() + "_LATLNG";
        var locationLatLng = ru.maps.configs[locationLookup];

        var $this = $(this);
        var setToLocation = function(){
            $("#campusLocation").find("a").attr("data-active", false);
            $this.attr("data-active", true);

            ru.maps.map.setToLocation(locationLatLng);
        };
        $this.on("click", setToLocation);
    });

}());

ru.maps.controller.searchCtrl = (function(map){

    var searchBarPosition = "TC";
    var marker;

    var onCampusSource,
        offCampusSource
    ;

    // get and cache the elements of search elements
    var
        $searchInput = $("#search-input"),
        $searchTypes = $("#search-type")
    ;

    var initializeTypeaheadEngine = function(){
        // initialize typeahead suggestion engine for On-Campus
        var dataOnCampus = map.data.getAllFeatureData();
        onCampusSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: dataOnCampus
        });
        onCampusSource.initialize();

        // initialize typeahead suggestion engine for Off-Campus
        var dataOffCampus = map.data.getAllFeatureData();
        offCampusSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: dataOffCampus
        });
        offCampusSource.initialize();
    };

    var positionSearchBarOnMap = function(){
        map.clearControl(searchBarPosition);
        map.addControl($(".twitter-typeahead")[0],searchBarPosition);
        map.addControl($searchTypes[0], searchBarPosition);
    };

    var setTypeaheadDataset = function($input, searchType){
        $input.typeahead('destroy');

        var datasetOptions = [];
        var baseOptions = {
            highlight: true,
            hint: true,
            minLength : 1
        };
        datasetOptions.push(baseOptions);

        var
            onCampusOptions = {
                name: 'onCampus',
                displayKey: 'name',
                source: onCampusSource.ttAdapter(),
                templates: {
                    header: '<h3 class="">On Campus</h3>'
                }
            },
            offCampusOptions = {
                name      : 'offCampus',
                displayKey: 'name',
                source    : offCampusSource.ttAdapter(),
                templates : {
                    header: '<h3 class="">Off Campus</h3>'
                }
            }
        ;

        switch(searchType){
            case "onCampus":
                datasetOptions.push(onCampusOptions);
                break;
            case "offCampus":
                datasetOptions.push(offCampusOptions);
                break;
            case "all":
                datasetOptions.push(onCampusOptions,offCampusOptions);
                break;
        }

        return $input.typeahead.apply($input, datasetOptions);
    }

    var setTypeaheadEventHandlers = function($typeahead){
        $typeahead
            .on("typeahead:selected", function(event, suggestion, datasetName) {
                if (marker){
                    marker.setMap(null);
                }

                var position = map.data.calcFeatureCenterPosition(suggestion);
                marker = new google.maps.Marker({
                    position: position
                });
                marker.setMap(map.getInstance());
                map.setToLocation(position);
            });

    };

    var createTypeahead = function($input, searchType){
        // set default search type to checked value
        var searchType= searchType || $searchTypes.find("input[name=type]:checked").val();
        var $typeahead = setTypeaheadDataset($input, searchType);
        setTypeaheadEventHandlers($typeahead);
        positionSearchBarOnMap();

        // trigger focus event for search input typeahead
        // a delay is needed for execution after input has been moved onto the map
        setTimeout(function(){
            $input.focus();
        }, 200);
    }

    var onDataChange = function(){
        initializeTypeaheadEngine();
        createTypeahead($searchInput);
    };

    // on focus, show suggestions with current input query
    // delay is needed because built-in focus handler for typeahead must execute first
    $searchInput.focus(function(){
        var $input = $(this);
        setTimeout(function(){
            var val = $input.typeahead("val");
            $input.typeahead("val", "");
            $input.typeahead("val", val);
        }, 200);

    });
    $searchTypes.find("input:radio").change(function(){
        createTypeahead($searchInput);
    });
    google.maps.event.addListener(map.data,"dataChanged",onDataChange);


    // ------------------- Google Places -----------------------
    //var getPlaceServiceData = function(request)
}(ru.maps.map));