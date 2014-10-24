/**
 * Created by Benson on 10/11/2014.
 */

'use strict';

ru.maps.map.places = (function(map){

    var service = new google.maps.places.PlaceService(map.getInstance());

    var placeResults = {
        // keyName : placeResults of given keyName
    };

    var nearbySearch = function(request, searchCacheKey){
        var cacheResultsCb = _cacheSearchResults.bind(null, searchCacheKey);
        service.nearbySearch(request, cacheResultsCb);
    };
    var _cacheSearchResults = function(cacheKey, results, status){
        if (status == google.maps.places.PlaceService.OK){
            for (var i= 0; i<results.length; i++){
                var place = results[i];
                if (!placeResults[cacheKey]){
                    placeResults[cacheKey] = [];
                }
                placeResults[cacheKey].push(place);
            }
        }
        if (pagination.hasNextPage) {
            pagination.nextPage;
        }
    };
    var getPlacesBySearchKey = function(searchKey){

    };

    return {
        nearbySearch : nearbySearch
    };

}(ru.maps.map))