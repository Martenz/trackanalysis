var points=[];
var igc_track={};


$(document).ready(function(){
    $("#load-igc").click(function(event){
        //alert("loading...");
        event.preventDefault();
        $('#loadeddata').removeAttr('hidden');
        $('#loadigc').hide();
        $("#save-db").hide();
        //get file object
        var file = document.getElementById('myFile').files[0];
        if (file) {
            // create reader
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e) {
                var igc = e.target.result;
                $('#igc-raw-data').html(igc);
                igc_track = read_igc(igc);

                setTimeout(function(){
                  points = igc_track['igc_points'];
                      var latlngs = [];
                      points.forEach(function(val,index){
                        latlngs.push( [val.lat,val.lon,val.alt,val.altbaro] );
                      });
                      //console.log(latlngs);
                      //adding track polyline
                      addPoly(latlngs);
                      load_map();

                  $('#loading-div').hide();
                  $('#dataid').show();
                  $('#igc-options').show();
                },500);
            };
        };

        setTimeout(function(){
          var gdb = generate_db();
        },1000);
        setTimeout(function(){
          $("#save-db").show();
        },6000);

    });

    $('#send-igc').on('click',function(){
      $('#loading-div').show();
      setTimeout(function(){
        $('#loading-div').hide();
        /*TO DO server side, just a fake response*/
        alert('Sent! Thanks');
      },2000);
    });


});
