function CoordMapType(tileSize) {
    this.tileSize = tileSize;
}

CoordMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    div.innerHTML = coord;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.fontSize = '10';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px';
    div.style.borderColor = '#AAAAAA';
    return div;
};

var rutgersMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
        if (zoom === 17) {
            if (coord.x >= 38432 && coord.x <= 38436 && coord.y >= 49370 && coord.y <= 49373) {
                return 'images/Livingston-Map-' + coord.x + '-' + coord.y + ".gif";
            }
        }
    },
    tileSize: new google.maps.Size(256, 256)
});


function initialize() {
    var map;
    var mapOptions;

    map = new google.maps.Map(document.getElementById("map-canvas"));

    //Many of these settings are questionable at best
    mapOptions = {
        center: new google.maps.LatLng(40.52349, -74.43723),
        zoom: 17
        // minZoom: 17,
        // panControl: false,
        // draggable: false
    };

    map.setOptions(mapOptions);

	/*
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
	*/
    map.overlayMapTypes.push(rutgersMapType);
    map.overlayMapTypes.push(new CoordMapType(new google.maps.Size(256, 256)));
}

google.maps.event.addDomListener(window, 'load', initialize);