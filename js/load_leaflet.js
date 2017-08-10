var mymap;

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
    iconUrl: '/img/circle.png',
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

function addPoly(latlngs){

  var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
  // zoom the map to the polyline
  mymap.fitBounds(polyline.getBounds());

};
