function initialize() {
	var mapOptions = {
		center : new google.maps.LatLng(40.52349, -74.43723),
		zoom : 17
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	map.set('styles', [ {
		"featureType" : "landscape.man_made",
		"elementType" : "geometry.fill",
		"stylers" : [ {
			"hue" : "#ff8800"
		}, {
			"saturation" : 58
		}, {
			"lightness" : -46
		} ]
	} ]);
}
google.maps.event.addDomListener(window, 'load', initialize);
