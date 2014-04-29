function CoordMapType(tileSize) {
    this.tileSize = tileSize;
}

/**
 * Coordinate maptype, displays coordinates and borders on the map
 * @param coord
 * @param zoom
 * @param ownerDocument
 * @returns {HTMLElement}
 */
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

/**
 * Livingston maptype, returns images within specific coordinates (Livingston Campus)
 * @type {google.maps.ImageMapType}
 */
var livingstonMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
        if (zoom === 17) {
            if (coord.x >= 38432 && coord.x <= 38436 && coord.y >= 49370 && coord.y <= 49373) {
                return 'images/Livingston-Map-' + coord.x + '-' + coord.y + ".gif";
            }
        }
    },
    tileSize: new google.maps.Size(256, 256)
});

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

/**
 * Gets the values for id's "start" and "end" and displays the directions if possible
 */
function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function initialize() {
    var map;
    var mapOptions;

    map = new google.maps.Map(document.getElementById("map-canvas"));

    directionsDisplay = new google.maps.DirectionsRenderer();

    //Many of these settings are questionable at best
    mapOptions = {
        center: new google.maps.LatLng(40.52349, -74.43723),
        zoom: 17,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }
        // minZoom: 17,
        // panControl: false,
        // draggable: false
    };
    var control = document.getElementById('control');
    map.setOptions(mapOptions);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control)

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    map.overlayMapTypes.push(livingstonMapType);
   // map.overlayMapTypes.push(new CoordMapType(new google.maps.Size(256, 256)));
}

google.maps.event.addDomListener(window, 'load', initialize);