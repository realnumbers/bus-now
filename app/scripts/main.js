/*jslint browser: true*/
/*global L */

//main stuff
loadBusstopsList();
loadBusstopsListPair(); 
var usedBusstops = new Object();
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

function showBusstopMap(L, map, slide) {
  var i = 0;
  var lang = UILang();
  var busstopList = getBusstopList();
  var markerGroup = new L.LayerGroup().addTo(map);
  var markerColor = (slide == "arr") ? "#318eff" : "#ff0101";
  for (i = 0; i < busstopList[lang].length; i++) {
    var coordBusstop = new Array();
    coordBusstop[0] = parseFloat(busstopList[lang][i].x);
    coordBusstop[1] = parseFloat(busstopList[lang][i].y);
    var id = busstopList[lang][i].id;
    //red #ff0101
    //blue #318eff
    if (slide == "arr") 
      L.circleMarker(coordBusstop, {opacity : 1, color : markerColor, fillOpacity : 1, title : id}).addTo(markerGroup).bindPopup("Hallo").on('click', onBusstopClickArr);
    else
        L.circleMarker(coordBusstop, {opacity : 1, color : markerColor, fillOpacity : 1, title : id}).addTo(markerGroup).on('click', onBusstopClickDep);
    usedBusstops[id] = busstopList[lang][i];
   }

  function onBusstopClickDep(el) {
    console.log("Selected Destination");
    console.log(el);
    var id = el.target.options.title;
    //alert(usedBusstops[id].name);
    switchToArr();
  }
  
	function onBusstopClickArr(el) {
		console.log("Selected Destination");
		console.log(el);
		var id = el.target.options.title;
		//alert(usedBusstops[id].name);
		switchToArr();
	}

	function switchToArr() {
		/*$("#msg-des").hide();
		$("#msg-arr").show();*/
		hideDesMsg();
		showArrMsg();
		markerGroup.clearLayers();
		showBusstopMap(L, map, "arr");
	}
}
function matchBusstop(id) {
  var lang = UILang();
  var pair = getBusstopPair()[lang]; 
  var busstops = getBusstopList()[lang]; 
  var j;
  var found = false;
  for (var i = 0; i < busstops.length; i++) {
    if ( busstops[i].id == id ) {
    j = 0;
    found = false;
    while (found == false && j < pair.length) {
      var tmp = pair[j].id.split(":");
      if (busstops[j].id == tmp[1] || busstops[j].id == tmp[2]) {
        found = true;
        console.log("found match");
        id = pair[j].id;
      }
      j++;
    }
    }
  }
  return id;
}


function checkLine() {
	return true;
}
function getDepBusstop(id, L, M) {
  //http://html5.sasabus.org/backend/sasabusdb/findBusStationDepartures?busStationId=:5142:&yyyymmddhhmm=201309160911&callback=function123
  id = matchBusstop(id);
  var time = moment().format('YYYYMMDDhhmm');
  time = "201405110810";
  var urlAPI = "http://html5.sasabus.org/backend/sasabusdb/findBusStationDepartures?busStationId="+ id + "&yyyymmddhhmm=" + time;
  $.ajax({
        url: urlAPI,
        dataType: 'jsonp',
        success: function( data ) {
          console.log("success");
          parseData(data);
            },
        error: function( data ) {
        console.log("Error");
        }
    });

}
function parseData(data) {
  console.log(data);
}
// return the busstop list as json witch is saved in the localStorage
function getBusstopList() {
	return JSON.parse(localStorage.busstops);
}
function getBusstopPair() {
  return JSON.parse(localStorage.busstopsPair);
}

function UILang() {
	if (navigator.language.substr(0, 2) == "de")
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
	if (!localStorage.busstops) {
		$.getJSON("data/busstops.json", function (data) {
			localStorage.setItem('busstops', JSON.stringify(data));
		});
	}
}

function hideDesMsg() {
	console.log("hide des");
	$("#msg-des").removeClass("zero").addClass("left");
	//showArrMsg();
}
function showArrMsg() {
	console.log("show arr")
	$("#msg-arr").removeClass("right").addClass("zero");
}
function loadBusstopsListPair() {
  if (!localStorage.busstopsPair){
  $.getJSON( "data/busstops_pair.json", function(data) {
    localStorage.setItem('busstopsPair', JSON.stringify(data));
  });
  }
}

/*
function hideMsg() {
	console.log("hide msg")
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
}*/
