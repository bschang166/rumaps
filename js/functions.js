var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var stepDisplay;
var markerArray = [];

/**
 * Gets the user's latitude and longitude
 */
function getMyLocation()
{
    var start = document.getElementById("start");
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position){
        //enters the position in the text field
        start.value = "(" + position.coords.latitude + ", " + position.coords.longitude + ")";
    }
    function showError(error)
    {
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }
}
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

/**
 * CoordMapType constructor
 * @param tileSize
 * @constructor
 */
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
 * Gets the values for id's "start" and "end" and displays the directions if possible
 */
function calcRoute() {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    // Now, clear the array itself.
    markerArray = [];

    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var warnings = document.getElementById('warnings_panel');
            warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response);
        }
    });
}

/**
 * Places markers along the travel route
 * @param directionResult
 */
function showSteps(directionResult) {
    // For each step, place a marker, and add the text to the marker's
    // info window. Also attach the marker to an array so we
    // can keep track of it and remove it when calculating new
    // routes.
    var myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = new google.maps.Marker({
            position: myRoute.steps[i].start_location,
            map: map
        });
        attachInstructionText(marker, myRoute.steps[i].instructions);
        markerArray[i] = marker;
    }
}

/**
 * Attaches instructions to the marker, displays when clicked
 * @param marker
 * @param text
 */
function attachInstructionText(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on,
        // containing the text of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}

function initialize() {
    var mapOptions;
    var directionControl = document.getElementById('control');
    map = new google.maps.Map(document.getElementById("map-canvas"));
    var rendererOptions = {
        map: map
    };
    var buschMarker = new google.maps.Marker(
        {
            position: new google.maps.LatLng(40.523325, -74.458694),
            map: map,
            title: 'my 2nd title'
        }
    );
    var livingstonMarker = new google.maps.Marker(
        {
            position: new google.maps.LatLng(40.523484, -74.437129),
            map: map,
            title: 'my 2nd title'
        }
    );

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
    map.setOptions(mapOptions);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(directionControl);

    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    //Overlay types
    map.overlayMapTypes.push(livingstonMapType);
    //map.overlayMapTypes.push(new CoordMapType(new google.maps.Size(256, 256)));

    //Event listeners for campus buttons
    google.maps.event.addDomListener(document.getElementById("busch"), "click", function (ev) {
        map.setCenter(buschMarker.getPosition());
    });
    google.maps.event.addDomListener(document.getElementById("livingston"), "click", function (ev) {
        map.setCenter(livingstonMarker.getPosition());
    });

    stepDisplay = new google.maps.InfoWindow();
}

google.maps.event.addDomListener(window, 'load', initialize);