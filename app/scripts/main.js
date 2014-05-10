/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
	'use strict';

	// TIS: 46.4838, 11.336
	/* create leaflet map */
	var map = L.map('map', {
		center: [46.4838, 11.336], // y, x
		zoom: 16
	});

	/* add default stamen tile layer */
	L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

	/*

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	*/



	/*
	var circle = L.circle([46.4829, 11.3355], 50, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(map);
*/

	var geojsonFeature = {
		"type": "Feature",
		"properties": {
			"name": "Coors Field",
			"amenity": "Baseball Stadium",
			"popupContent": "This is where the Rockies play!"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [46.4838, 11.336]
		}
	};
	L.geoJson(geojsonFeature).addTo(map);


	
	hideDetails();

}(window, document, L));

function showDetails() {
	console.log("show details")
	$(".ui").velocity({
		scaleX: 1,
		scaleY: 1,
		opacity: 1,
	});
	$(".map-application").velocity({
		opacity: 0.5,
	});
	$(".menu-btn").velocity({
		colorRed: 255,
		colorBlue: 255,
		colorGreen: 255,
	}, {
		complete: function () {
			$(".header-bar").removeClass("hidden").addClass("visible");
		}
	});
}

function hideDetails() {
	console.log("hide details");
	$(".ui").velocity({
		scaleX: 0,
		scaleY: 0,
		opacity: 0,
	});
	$(".map-application").velocity({
		opacity: 1,
	});
	$(".menu-btn").velocity({
		colorRed: 0,
		colorBlue: 0,
		colorGreen: 0,
	}, {
		complete: function () {
			$(".header-bar").removeClass("visible").addClass("hidden");
		}
	});
}

// DRAWING MARKERS

function test1(L, map) {
	var testfeature = [{
		"type": "Feature",
		"properties": {
			"name": "viale Europa 4",
			"id": ":abcdef123"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [46.4838, 11.336]
		}
	}, {
		"type": "Feature",
		"properties": {
			"name": "piazza Walther",
			"id": ":derppp123"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [46.4841, 11.339]
		}
	}];

	var teststyle = {
		"color": "#ff7800"
	}

	L.geoJson(testfeature, {
		style: teststyle
	}).addTo(map);
}





function derpp() {
	var myLines = [{
		"type": "LineString",
		"coordinates": [[46.4838, 11.336], [46.4839, 11.337], [46.4844, 11.334]]
}, {
		"type": "LineString",
		"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

	var myStyle = {
		"color": "#ff7800",
		"weight": 5
	};

	L.geoJson(myLines, {
		style: myStyle
	}).addTo(map);
}




function depp() {
	var circle = L.circle([46.4838, 11.336], 5000000, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(map);
}