var execBtn = document.getElementById("store-to-db");
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var savedbElm = document.getElementById('save-db');

// Start the worker in which sql.js will run
var worker = new Worker("./js/spatiasql.worker.js");
worker.onerror = error;

// Open a database
worker.postMessage({action:'open'});

// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) {window.performance = {now:Date.now}}
function tic () {tictime = performance.now()}
function toc(msg) {
	var dt = performance.now()-tictime;
	console.log((msg||'toc') + ": " + dt + "ms");
}

// Connect to the HTML element we 'print' to
function print(text) {
    outputElm.innerHTML = text.replace(/\n/g, '<br>');
}
function error(e) {
  console.log(e);
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
		errorElm.style.height = '0';
}

// Create an HTML table
var tableCreate = function () {
  function valconcat(vals, tagName) {
    if (vals.length === 0) return '';
    var open = '<'+tagName+' class="track-data">', close='</'+tagName+'>';
    return open + vals.join(close + open) + close;
  }
  return function (columns, values){
    var tbl  = document.createElement('table');
    var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
    var rows = values.map(function(v){ return valconcat(v, 'td'); });
    html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
	  tbl.innerHTML = html;
    return tbl;
  }
}();

// Run a command in the database
function execute(commands,wres) {
	tic();
	worker.onmessage = function(event) {
		var results = event.data.results;
		if (wres==true){
			QRESULT = results;
		};
		toc("Executing SQL");

		tic();
		//outputElm.innerHTML = "";
		//for (var i=0; i<results.length; i++) {
		//	outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
		//}
		toc("Displaying results");
	}
	worker.postMessage({action:'exec', sql:commands});
	outputElm.textContent = "Fetching results...";

}

// Execute the commands when the button is clicked
function execQuery (query,wres) {
	noerror();
  execute(query,wres);
}
//execBtn.addEventListener("click", function(){execQuery(create_table_query);}, true);


var QRESULT;
var dbready=false;

function generate_db(){

	execQuery('drop table if exists mytrack;',false);
		//alert('deleted');
	execQuery('create table mytrack(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, pilot text,glider text, date text, time text, lat real, lon real, alt real, baro real);',false);
	var ci = 0;
	points.forEach(function(item,index){
		execQuery("INSERT into mytrack values('"+toString(ci)+"','"+igc_track['info']['pilot'] + "','" +igc_track['info']['glider']+ "','"
		+ igc_track['info']['date'] +  "','"
		+ item['time'] +  "','"
		+ item['lat'] +  "','" + item['lon'] + "','" + item['alt'] +  "','" + item['altbaro'] + "');",false);
		ci+=1;
	});
	execQuery("ALTER TABLE mytrack ADD COLUMN Geometry;",false);
	execQuery("Select AddGeometryColumn('mytrack', 'Geometry', 4326, 'POINT', 2);",false );
	execQuery("UPDATE mytrack SET Geometry=MakePoint(lon, lat, 4326);",false);
	execQuery("SELECT RecoverGeometryColumn('mytrack', 'Geometry',4326, 'POINT', 'XY');",false);
	/*execQuery("SELECT AsGeoJSON(the_geom), time, alt, baro FROM mytrack;",false);*/
};

$("#save-db").click(function (){
  $('#loading-div').show();
	setTimeout(function(){
	// Save the db to a file
	//function savedb () {
		worker.onmessage = function(event) {
			toc("Exporting the database");
			var arraybuff = event.data.buffer;
			var blob = new Blob([arraybuff]);
			var link = document.createElement("a");
			document.body.appendChild(link);
			link.setAttribute("type", "hidden");
			link.href = window.URL.createObjectURL(blob);
			link.download = "mytrack.sqlite";
			//link.onclick = function() {
			//	setTimeout(function() {
			//		window.URL.revokeObjectURL(link.href);
			//	}, 1500);
			//};
			link.click();
		};
		tic();
		worker.postMessage({action:'export'});
		outputElm.textContent = "Exported, Enjoy :)";

		$('#loading-div').hide();
	},500);
	//}
});
