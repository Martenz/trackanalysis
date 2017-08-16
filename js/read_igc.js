function read_igc(rows){

  //alert("test");
  var igc_rows = rows.split(/\n/);
  var igc_points = [];
  var bdate,btime,blat,blon,balt,bbaro;
  var year,month,day;
  var igc_track = {'info':{}}

  igc_rows.forEach(function(item,index){

    //collecting the date
    if (item.indexOf('HFDTE')>=0){
      //console.log(item);
      day = parseInt(item.substring(5,7));
      month = parseInt(item.substring(7,9))-1;
      year = parseInt(item.substring(9,11))+2000;
      bdate = new Date(year,month,day);
      igc_track['info']['date'] = bdate;
    };

    //collecting all points
    if (item.substring(0,1)==="B"){
      btime = new Date( year,month,day, parseInt(item.substring(1,3)),parseInt(item.substring(3,5)),parseInt(item.substring(5,7)) );
      blon = parseInt(item.substring(7,9))+(parseInt(item.substring(9,11))+parseInt(item.substring(11,14))/1000.0)/60.0; //degrees and ,minutes only (eg 4555321 = 45 degrees 55.321 minutes)
      blat = parseInt(item.substring(15,18))+(parseInt(item.substring(18,20))+parseInt(item.substring(20,23))/1000.0)/60.0; //degrees and ,minutes only (eg 4555321 = 45 degrees 55.321 minutes)
      //check if it is E or W and manage it
      if (item.substring(23,24)==="W"){
        blon = -blon;
      };
      balt = "";
      bbaro = "";
      if (item.indexOf('A')>=0){
        balt = parseInt(item.substring(25,30));
        if (item.length > 31){
          bbaro = parseInt(item.substring(30,35));
        };
      };
      igc_points.push({'time':btime,'lat':blat,'lon':blon,'alt':balt,'altbaro':bbaro});
    };

    //collecting other infos
    if (item.indexOf('PILOT')>=0){
      igc_track['info']['pilot'] = item.split(':').slice(-1)[0] ;
    };
    //collecting other infos
    if (item.indexOf('GLIDER')>=0){
      igc_track['info']['glider'] = item.split(':').slice(-1)[0] ;
    };


  });
  //console.log(bdate);
  //console.log(igc_points);
  igc_track['igc_points'] = igc_points ;

  return igc_track;

};
