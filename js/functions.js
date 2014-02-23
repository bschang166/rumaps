function initialize() {
    var map;
    var mapOptions;

    map = new google.maps.Map(document.getElementById("map-canvas"));

    //Many of these settings are questionable at best
    mapOptions = {
        center: new google.maps.LatLng(40.52349, -74.43723),
        zoom: 17,
        minZoom: 17,
        panControl: false
        // draggable: false
    };

    map.setOptions(mapOptions);

    map.set('styles', [
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "hue": "#FF7A7A"
                },
                {
                    "saturation": 58
                },
                {
                    "lightness": -46
                }
            ]
        }
    ]);


    google.maps.event.addListener(map, 'center_changed', function() {
        document.title = map.getCenter();
    });

}

google.maps.event.addDomListener(window, 'load', initialize);
