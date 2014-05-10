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
		minZoom: 12,
		maxZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

  showBusstopMap(L, map);
  //currentPosition(L, map);
}(window, document, L));

function showBusstopMap(L, map) {
  var i = 0;
  var lang = UILang();
  var busstopList = getBusstopList();
  var offset = 0.004;
  var loadAll = true;
  var preOffset = 0;
  while (loadAll) {
  for (i = 0; i < busstopList[lang].length; i++) {
    var coordBusstop = new Array();
    coordBusstop[0] = parseFloat(busstopList[lang][i].x);
    coordBusstop[1] = parseFloat(busstopList[lang][i].y);
    var text = busstopList[lang][i].name;
    if (coord[0] + offset > coordBusstop[0] && coord[1] + offset > coordBusstop[1] && coord[0] - offset < coordBusstop[0] && coord[1] - offset < coordBusstop[1])
      if (!(coord[0] + (preOffset)  > coordBusstop[0] && coord[1] + (preOffset) > coordBusstop[1] && coord[0] - (preOffset)  < coordBusstop[0] && coord[1] - (preOffset) < coordBusstop[1]))
        L.circleMarker(coordBusstop, {opacity : 1, color: "#000", fillOpacity : 1}).addTo(map).bindPopup(text);
   }
  preOffset = offset;
  if (offset > (0.004 * 2)) {
    if (offset != 1000)
      offset = 1000;
    else
      loadAll = false;
  }
  else
    offset *= 2;
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

/*function currentPosition(L, map) {
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
*/

function loadBusstopsList() {
  if (!localStorage.busstops){
  $.getJSON( "data/busstops.json", function(data) {
    localStorage.setItem('busstops', JSON.stringify(data));
  });
  }
}

