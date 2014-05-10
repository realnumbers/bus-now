/*jslint browser: true*/
/*global L */

//main stuff
loadBusstopsList();
var coord = new Array();
coord = [46.4838, 11.336];
(function (window, document, L, undefined) {
	'use strict';

	// TIS: 46.4838, 11.336
	/* create leaflet map */
	var map = L.map('map', {
		center: coord, // y, x
		zoom: 16
	});

	/* add default stamen tile layer */
	L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

  showBusstopMap(L, map);
  //currentPosition(L, map);
}(window, document, L));

function showBusstopMap(L, map) {
  var iconImg = L.icon({
     iconUrl: 'data/img/icon.png',
     iconSize:     [38, 95], // size of the icon
     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  var i = 0;
  for (i = 0; i < getBusstopList()[UILang()].length; i++) {
  //for (i = 400; i < 450; i++) {
    var coordBusstop = new Array();
    coordBusstop[0] = parseFloat(getBusstopList()[UILang()][i].x);
    coordBusstop[1] = parseFloat(getBusstopList()[UILang()][i].y);
    var text = getBusstopList()[UILang()][i].name;
    if (coord[0] + 0.004  > coordBusstop[0] && coord[1] + 0.004 > coordBusstop[1] && coord[0] - 0.004  < coordBusstop[0] && coord[1] - 0.004 < coordBusstop[1])
        L.circleMarker(coordBusstop, {opacity : 1, color: "#000", fillOpacity : 1}).addTo(map).bindPopup(text);
   }
}
// return the busstop list as json witch is saved in the localStorage
function getBusstopList() {
  return JSON.parse(localStorage.busstops);
}

function UILang() {
 if (navigator.language.substr(0,2) == "de")
   return "de";
 return "it";
}

function currentPosition(L, map) {
  if (!navigator.geolocation){
    error();
  }
  else {
    function success(position) {
      coord[0] = position.coords.latitude;
      coord[1] = position.coords.longitude;
      map.panTo(new L.LatLng(coord[0], coord[1]));
    };
    function error() {
      coord = [46.4838, 11.336];
      console.log("Unable to retrieve your location, use default position");
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }
  return coord;
}

function loadBusstopsList() {
  if (!localStorage.busstops){
  $.getJSON( "data/busstops.json", function(data) {
    localStorage.setItem('busstops', JSON.stringify(data));
  });
  }
}

