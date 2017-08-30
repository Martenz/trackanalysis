var mymap;

function pointfeature(geometry){

  var pointf = {
      "type": "Feature",
      "properties": {
          "name": "Coors Field",
          "amenity": "Baseball Stadium",
          "popupContent": "This is where the Rockies play!"
      },
      "geometry": geometry
    };

  return pointf;
};

function polygonfeature(geometry){
  var poly = {"name":"NewFeatureType","type":"FeatureCollection",

    "features":[
    {"type": "Feature",
    "properties": null,
    "geometry": {
        "type": "LineString",
        "coordinates": geometry
    }
  }]};

  return poly;
};

function load_map(){

  mymap = L.map('mapid').setView([45.911, 8.643], 8);

//   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'your.mapbox.access.token'
// }).addTo(mymap);

  L.tileLayer('https://api.mapbox.com/styles/v1/mboni/cis8tl34400112zo3dl6bc0ku/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWJvbmkiLCJhIjoiY2lzOHNzcWJtMDA0ODJ6czQ2eXQxOXNqeCJ9.geDRSQxeQQQkKDN9bZWeuw'
  ).addTo(mymap);

  mymap.addControl(new L.Control.Fullscreen());

};

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

function addTrackPoints(geojsonFeature){
  L.geoJSON(geojsonFeature).addTo(mymap);
  console.log("added");
};

function addmarkers(lablatlon){
  var myIcon = L.icon({
    iconUrl: '/img/para_icon.png',
    iconSize: [10, 10],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
  });

  for (var i = 0; i < lablatlon.length; i++) {
    marker = new L.marker([lablatlon[i][1],lablatlon[i][2]],{icon:myIcon})
      .bindPopup(lablatlon[i][0])
      .addTo(mymap);

      marker.on('mouseover', function (e) {
              this.openPopup();
          });
          marker.on('mouseout', function (e) {
              this.closePopup();
          });

  };
};

function graphwidth(){
  $('#dataid').show();
  var dw = $('#graph-elevation').width();
  $('#dataid').hide();
  return dw;
};

function addPoly(latlngs){

  //var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
  // zoom the map to the polyline
  //mymap.fitBounds(polyline.getBounds());

   //all used options are the default values
   //..default
   //var el = L.control.elevation();

   var myIcon = L.icon({
     iconUrl: '/img/para_icon.png',
     iconSize: [10, 10],
     iconAnchor: [0, 0],
     popupAnchor: [0, 0],
   });


    var el = L.control.elevation({
    	position: "topright",
  	theme: "lime-theme",//"steelblue-theme", //default: lime-theme
  	width: graphwidth(),
  	//height: 200,
  	margins: {
  		top: 15,
  		right: 70,
  		bottom: 20,
  		left: 70
  	},
  	useHeightIndicator: true, //if false a marker is drawn at map position
  	interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
  	hoverNumber: {
  		decimalsX: 2, //decimals on distance (always in km)
  		decimalsY: 1, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)
  		formatter: undefined //custom formatter function may be injected
  	},
  	xTicks: undefined, //number of ticks in x axis, calculated by default according to width
  	yTicks: undefined, //number of ticks on y axis, calculated by default according to height
  	collapsed: false,  //collapsed mode, show chart on click or mouseover
  	imperial: false    //display imperial units instead of metric
  });

  el.addTo(mymap);

  var geojson = polygonfeature(latlngs);

  var polyjson = L.geoJSON(geojson,{
      onEachFeature: el.addData.bind(el) //working on a better solution
  }).addTo(mymap);

  //console.log(polyjson.getBounds());
  var pbounds = polyjson.getBounds();
  var pwidth = pbounds._northEast.lng - pbounds._southWest.lng;
  if (pwidth<0.01){ pwidth = 0.01; };
  //console.log(pwidth);
  var southWest = L.latLng(pbounds._southWest.lat, pbounds._southWest.lng ),
      northEast = L.latLng(pbounds._northEast.lat, pbounds._northEast.lng + pwidth*2),
      bounds = L.latLngBounds(southWest, northEast);
  mymap.fitBounds(bounds);

  //change default marker icon
  L.Marker.prototype.options.icon = new L.icon({
    iconUrl: '/img/marker-icon.png',
    iconSize: [60, 60],
    iconAnchor: [20, 30],
  });
  //L.Icon.Default.prototype.options.iconSize = (100,100);
  //L.Icon.Default.imagePath = "/img/";


  //move the graph outside map
  $('div.elevation').detach().appendTo('#dataid #graph-elevation');

  $('a.leaflet-control-fullscreen-button').on('click',function(){
    if ($(this).attr('title')=="View Fullscreen"){
      $('div.elevation').detach().appendTo('.leaflet-top.leaflet-right');
    }else{
      $('div.elevation').detach().appendTo('#dataid #graph-elevation');
    };
  });


  //$('#graph-id button').on('click',function(){
  //  $('div.elevation').detach().appendTo('#dataid');
  //});

  };
