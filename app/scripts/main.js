/*jslint browser: true*/
/*global L */

//main stuff
loadBusstopsList();
loadLines();
//loadBusstopsListPair(); 
var coord = new Array();
var arrival;
coord = [46.4928, 11.331];
currentPosition();
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
var markerGroup = new L.LayerGroup().addTo(map);
showBusstopMap();

function showBusstopMap(slide) {
  var i = 0;
  var lang = UILang();
  var busstopList = getBusstopList();
  var markerColor = (slide == "arr") ? "#318eff" : "#ff0101";
  for (i = 0; i < busstopList.length; i++) {
    var coordBusstop = new Array();
    for (var j = 0; j < busstopList[i].busstops.length; j++) {
      coordBusstop[0] = parseFloat(busstopList[i].busstops[j].ORT_POS_BREITE);
      coordBusstop[1] = parseFloat(busstopList[i].busstops[j].ORT_POS_LAENGE);
      //var thisLine = "" //busstopList[lang][i].line;
      var id = busstopList[i].busstops[j].ORT_NR;
      //red #ff0101
      //blue #318eff
      L.circleMarker(coordBusstop, {opacity : 1, radius : 15, color : markerColor, fillOpacity : 1, title : id}).addTo(markerGroup).on('click', onBusstopClickArr);
    }
  }
}

function onBusstopClickArr(el) {
  console.log("Selected Destination");
  console.log(el);
  var id = el.target.options.title;
  switchToDep(id);
}

function onBusstopClickDep(el) {
  console.log("Selected Arr");
  console.log(el);
  var id = el.target.options.title;
  $(".top-msg").hide();
  $(".header-bar").css("background-color", "rgba(255, 255, 255, 0)");
  $(".darken").removeClass("hidden");
  $(".popup").removeClass("hidden");

  getDepBusstop(id);
}

function switchToDep(id) {
  $("#msg-arr").show(0);
  hideDesMsg();
  showArrMsg();
  markerGroup.clearLayers();
  showLine(id);
}
function drawPositon(coord) {
  var markerColor = "#00ff00";
  var curr_pos = L.circleMarker(coord, {opacity : 1, radius : 20, color : markerColor, fillOpacity : 1, title : "Hello"}).addTo(markerGroup);
  map.fitBounds(curr_pos.getBounds());
}
function showLine(baseStopId) {
  var markerColor = "#318eff";
  var busstopList = getBusstopList();//[UILang()];
  var lines = getLines();
  var baseStop = getBusstopById(baseStopId);
  var coordBusstop = new Array ();
  var validStopsList = [];
  //create list of stops to show as departure
  for (var i = 0; i < lines.length; i++) {
    for (var j = 0; j < lines[i].varlist[0].routelist.length; j++) {
      var stop = lines[i].varlist[0].routelist[j];
      if (stop === baseStopId) {
        validStopsList = validStopsList.concat(lines[i].varlist[0].routelist);
      }
    }

  }
  console.log(validStopsList);
  for (var i = 0; i < validStopsList.length; i++ ) {
    //has to show all directions for a bustop currently only the first one
    coordBusstop[0] = parseFloat(getBusstopById(validStopsList[i]).busstops[0].ORT_POS_BREITE);
    coordBusstop[1] = parseFloat(getBusstopById(validStopsList[i]).busstops[0].ORT_POS_LAENGE);
    if (validStopsList[i] === baseStopId) {
      arrival = getBusstopById(validStopsList[i]).ORT_NAME;
      markerColor = "#ff0101";
      L.circleMarker(coordBusstop, {opacity : 1, radius : 20, color : markerColor, fillOpacity : 1, title : baseStopId}).addTo(markerGroup).on('click', onBusstopClickArr);
    }
    else {
      markerColor = "#318eff";						

      L.circleMarker(coordBusstop, {opacity : 1, radius : 15, color : markerColor, fillOpacity : 1, title : validStopsList[i]}).addTo(markerGroup).on('click', onBusstopClickDep);
    }

  }
}

function getBusstopById(id) {
  //var busstopList = getBusstopList()[UILang()];
  var busstopList = getBusstopList();
  var found = false; 
  for (var i = 0; found === false && i < busstopList.length; i++) {
    for (var j = 0; found === false && j < busstopList[i].busstops.length; j++) {
      if (busstopList[i].busstops[j].ORT_NR == id) {
        found = true;
      } 
    }
  }
  return busstopList[i-1];
}

function matchBusstop(id) {
  var lang = UILang();
  var pair = getBusstopPair()[lang];  //only use of Pair list
  var busstops = getBusstopList()[lang]; 
  var j;
  var found = false;
  j = 0;
  found = false;
  while (found == false && j < pair.length) {
    var tmp = pair[j].id.split(":");
    if (id == (":" + tmp[1] + ":") || id == (":" + tmp[2] + ":")) {
      found = true;
      console.log("found match");
      id = pair[j].id;
    }
    j++;
  }
  console.log(id);
  return id;
}


function checkLine() {
  return true;
}

function getDepBusstop(id) {
  var urlAPI = "http://stationboard.opensasa.info/?type=jsonp&ORT_NR=" + id;
  $.ajax({
    url: urlAPI,
    dataType: 'jsonp',
    success: function( data ) {
      console.log("success");
      parseData(data, id);
    },
    error: function( data ) {
      console.log("Error");
    }
  });
}

function parseData(data, id) {
  console.log(data);
  var depTime = new Array();
  $("#popup").empty();
  $("<h2 class='station-title' id='popup-title'> <span class='blue'>" + getBusstopById(id).ORT_NAME + "</span> → <span class='red'>" + arrival + "</span></h2>").appendTo("#popup");
  for (var i = 0; i < data.rides.length && i < 5; i++) {
        //var line = data.busTripStops[i].busTrip.busLineId;
        $("	<section class='arriving-bus'><div class='bus-time'>" + data.rides[i].arrival + 
          "</div><span class='bus-line'>" + data.rides[i].lidname + "</span></section>").appendTo("#popup");
      }
}
// return the busstop list as json witch is saved in the localStorage
function getBusstopList() {
  return JSON.parse(localStorage.busstops);
}
function getLines() {
  return JSON.parse(localStorage.lines);
}
//function getBusstopPair() {
//  return JSON.parse(localStorage.busstopsPair);
//}

function UILang() {
  if (navigator.language.substr(0, 2) == "de")
    return "de";
  return "it";
}

function currentPosition() {
  if (!navigator.geolocation){
    error();
  }
  else {
    function success(position) {
      coord[0] = position.coords.latitude;
      coord[1] = position.coords.longitude;
      alert("Found Positon");
      drawPositon(coord);
    };
    function error() {
      console.log("Unable to retrieve your location, use default position");
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function loadBusstopsList() {
  if (!localStorage.busstops) {
    $.getJSON("data/busstops.json", function (data) {
      localStorage.setItem('busstops', JSON.stringify(data));
      window.location.reload();
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
    $.getJSON( "app/data/busstops_pair.json", function(data) {
      localStorage.setItem('busstopsPair', JSON.stringify(data));
    });
  }
}

function loadLines() {
  if (!localStorage.lines){
    $.getJSON( "app/data/lines.json", function(data) {
      localStorage.setItem('lines', JSON.stringify(data));
    });
  }
}


function showMenu() {
  if (!$(".darken").hasClass("hidden")) {
    blurForeground();
  } else {
    $(".about").removeClass("hidden");
    $(".darken").removeClass("hidden");
    $(".header-bar").css("background-color", "rgba(0, 0, 0, 0)");
  }
}

function blurForeground() {
  $(".about").addClass("hidden");
  $(".darken").addClass("hidden");
  $(".popup").addClass("hidden");
  $(".header-bar").css("background-color", "rgba(0, 0, 0, 0.8)");
  $("#popup").empty();
}

function cancelQuery() {
  window.location.reload();
}
// Eliminates 300ms click delay on mobile 
function removeClickDelay() {
  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);
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

