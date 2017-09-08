function trackStat (trackdata){

  var table = "<table class='table table-striped table-condensed'>"

  var stats = trackdata.info;
  Object.keys(stats).forEach(
    function(key){
      var row = "<tr>";
      row+= "<td><b style='font-variant: small-caps;'>"+key+":</b></td>"+"<td>"+trackdata.info[key]+"</td>";
      row+="</tr>"
      table+=row;
    });

  table+="</table>";
  $('#igc-stats').append(table);

};
