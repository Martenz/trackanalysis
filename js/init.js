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


var QRESULT;

$(document).ready(function(){
    $("#load-igc").click(function(event){
        //alert("loading...");
        event.preventDefault();
        $('#loadeddata').removeAttr('hidden');
        //get file object
        var file = document.getElementById('myFile').files[0];
        if (file) {
            // create reader
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e) {
                // browser completed reading file - display it
                //alert(e.target.result);
                var igc = e.target.result;
                $('#igc-raw-data').html(igc);
                var igc_track = read_igc(igc);
                //console.log(igc_track);
                load_map();

                execQuery('create table mytrack(id integer, pilot text,glider text, date text, time text, lat real, lon real, alt real, baro real);');
                var points = igc_track['igc_points'];
                //console.log(points);
                var ci = 0;
                points.forEach(function(item,index){
                  execQuery("INSERT into mytrack values('"+toString(ci)+"','"+igc_track['info']['pilot'] + "','" +igc_track['info']['glider']+ "','"
                  + igc_track['info']['date'] +  "','"
                  + item['time'] +  "','"
                  + item['lat'] +  "','" + item['lon'] + "','" + item['alt'] +  "','" + item['altbaro'] + "');");
                });
                execQuery("ALTER TABLE mytrack ADD COLUMN the_geom;",false);
                execQuery("Select AddGeometryColumn('mytrack', 'the_geom', 4326, 'POINT', 'XY', '1')",false );
                execQuery("UPDATE mytrack SET the_geom=MakePoint(lon, lat, 4326)",false);
                execQuery("SELECT AsGeoJSON(the_geom), time, alt, baro FROM mytrack;",true);

                setTimeout(function(){
                    //console.log(QRESULT[0].values[0][0]);

                    //adding points with labels of all track segments
                    var res = QRESULT[0].values;
                    var latlngs = [];
                    res.forEach(function(val,index){
                      var pnt = JSON.parse(val[0]);
                      latlngs.push( [pnt.coordinates[1],pnt.coordinates[0]] );
                      var info = "<dl>" + "<dt>" + val[1] + "</dt>" + "<dt>GPS (m.a.s.l.): " + val[2] + "</dt>" + "<dt>Bar. (m.a.s.l.): " + val[3] + "</dt>" + "</dl>"
                      //var tpoints = L.geoJSON(pointfeature(pnt)).addTo(mymap);
                      addmarkers([[info,pnt.coordinates[1],pnt.coordinates[0]]]);
                      $('#loading-div').hide();
                    });

                    //adding track polyline
                    addPoly(latlngs);

                },6000);


            };
        }

    });
});
