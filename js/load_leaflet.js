var mymap;
var baseMaps;
var overlayMaps = {};
var elevationGraph;
var bounds;

function polygonfeature(geometry){
  var poly = {"name":"NewFeatureType","type":"FeatureCollection",

    "features":[
    {"type": "Feature",
    "properties": null,
    "geometry": {
        "type": "Point",
        "coordinates": geometry
    }
  }]};

  return poly;
};

function load_map(){

  var basem1 = L.tileLayer('https://api.mapbox.com/styles/v1/mboni/cis8tl34400112zo3dl6bc0ku/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWJvbmkiLCJhIjoiY2lzOHNzcWJtMDA0ODJ6czQ2eXQxOXNqeCJ9.geDRSQxeQQQkKDN9bZWeuw');
  var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

  mymap = L.map('mapid', {
    center: [45.911, 8.643],
    zoom: 8,
    layers: [basem1]
  });

  baseMaps = {
    "<img src='./img/basemap1.png' width=20px /> MapBoxTenz": basem1,
    "<img src='./img/basemap2.png' width=20px /> OpenTopoMap": OpenTopoMap,
    "<img src='./img/basemap3.png' width=20px /> Esri World Imagery": Esri_WorldImagery,
  };

  elevationGraph.addTo(mymap);
  L.control.layers(baseMaps,overlayMaps).addTo(mymap);
  for(var key in overlayMaps){
    overlayMaps[key].addTo(mymap);
  };
  mymap.addControl(new L.Control.Fullscreen());
  mymap.fitBounds(bounds);
  mymap._onResize(); 

  //move the graph outside map
  $('div.elevation').detach().appendTo('#dataid #graph-elevation');

  $('a.leaflet-control-fullscreen-button').on('click',function(){
    if ($(this).attr('title')=="View Fullscreen"){
      $('div.elevation').detach().appendTo('.leaflet-top.leaflet-right');
    }else{
      $('div.elevation').detach().appendTo('#dataid #graph-elevation');
    };
  });

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
    // interpolation: 'linear','step-before','step-after','basis','basis-open','basis-closed','bundle','cardinal','cardinal-open','cardinal-closed','monotone'
    interpolation: "monotone", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
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

  //el.addTo(mymap);
  elevationGraph = el;

  var geojson = polygonfeature(latlngs);

  var polyjson = L.geoJSON(geojson,{
      onEachFeature: el.addData.bind(el) //working on a better solution
  });//.addTo(mymap);

  overlayMaps["<img src='./img/logo.png' width=20px /> Your Track"] = polyjson

  //console.log(polyjson.getBounds());
  var pbounds = polyjson.getBounds();
  var pwidth = pbounds._northEast.lng - pbounds._southWest.lng;
  if (pwidth<0.01){ pwidth = 0.01; };
  //console.log(pwidth);
  var southWest = L.latLng(pbounds._southWest.lat, pbounds._southWest.lng ),
      northEast = L.latLng(pbounds._northEast.lat, pbounds._northEast.lng + pwidth*2)
  bounds = L.latLngBounds(southWest, northEast);


  //change default marker icon
  L.Marker.prototype.options.icon = new L.icon({
    iconUrl: '/img/marker-icon.png',
    iconSize: [60, 60],
    iconAnchor: [20, 30],
  });
  //L.Icon.Default.prototype.options.iconSize = (100,100);
  //L.Icon.Default.imagePath = "/img/";

  };
