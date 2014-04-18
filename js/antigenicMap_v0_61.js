/**
 * @author Charles
 */


/*
 * Change Log
 * 
 * v0.61 vs. v0.60  : integrate the sera..
 *   To do:
 * 		- load data - that omit lines starting with # and omit blank lines
 *		- reference for Procrustes: use last, not the first 
 * 		- make the angle and flip or not flip public so sera can also apply the same transform
 * 		- Procrustes apply also to sera.. but using procrustes on viruses
 * 		- sera name correction
 * 		- sera hover to front
 * 
 * 		- others: clustering to sera
 */		


 			var start = function () {
                    this.ox = this.attr("x");
                    this.oy = this.attr("y");
                    this.animate({opacity: .8}, 500, ">");
                },
                move = function (dx, dy) {
                    this.attr({x: this.ox + dx, y: this.oy + dy});
                },
                up = function () {
                    this.animate({opacity: 1}, 500, ">");
                };

			var promptRename = function(){
				var ID=prompt("Rename ID to:");
				this.attr({text:ID});
			};


    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
    	// Check to see if the delimiter is defined. If not,
    	// then default to comma.
    	strDelimiter = (strDelimiter || ",");

    	// Create a regular expression to parse the CSV values.
    	var objPattern = new RegExp(
    		(
    			// Delimiters.
    			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    			// Quoted fields.
    			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    			// Standard fields.
    			"([^\"\\" + strDelimiter + "\\r\\n]*))"
    		),
    		"gi"
    		);


    	// Create an array to hold our data. Give the array
    	// a default empty first row.
    	var arrData = [[]];

    	// Create an array to hold our individual pattern
    	// matching groups.
    	var arrMatches = null;


    	// Keep looping over the regular expression matches
    	// until we can no longer find a match.
    	while (arrMatches = objPattern.exec( strData )){

    		// Get the delimiter that was found.
    		var strMatchedDelimiter = arrMatches[ 1 ];

    		// Check to see if the given delimiter has a length
    		// (is not the start of string) and if it matches
    		// field delimiter. If id does not, then we know
    		// that this delimiter is a row delimiter.
    		if (
    			strMatchedDelimiter.length &&
    			(strMatchedDelimiter != strDelimiter)
    			){

    			// Since we have reached a new row of data,
    			// add an empty row to our data array.
    			arrData.push( [] );

    		}


    		// Now that we have our delimiter out of the way,
    		// let's check to see which kind of value we
    		// captured (quoted or unquoted).
    		if (arrMatches[ 2 ]){

    			// We found a quoted value. When we capture
    			// this value, unescape any double quotes.
    			var strMatchedValue = arrMatches[ 2 ].replace(
    				new RegExp( "\"\"", "g" ),
    				"\""
    				);

    		} else {

    			// We found a non-quoted value.
    			var strMatchedValue = arrMatches[ 3 ];

    		}


    		// Now that we have our value string, let's add
    		// it to the data array.
    		arrData[ arrData.length - 1 ].push( strMatchedValue );
    	}

    	// Return the parsed data.
    	return( arrData );
    }

//for two dimensional
function kMeansClustering(arrayX, arrayY, k){
	
	
	var centroidsX = new Array(k);
	var centroidsY = new Array(k);
	var membership = new Array(arrayX.length);
	
	
	 
	//initial assignment
	var initialIndex = new Array(k);
    var i=0;
	while(i < k){	
	 var index = Math.floor(arrayX.length*Math.random());
	 var newIndex = 1;
	 for(var l=0; l < i; l++ ){
	 	if(index == initialIndex[l]){
			newIndex = 0;
		}
	 }
	 if(newIndex){
		centroidsX[i] = arrayX[index];  //now it should be two dimensional
		centroidsY[i] = arrayY[index];  //now it should be two dimensional
		initialIndex[i] = index;
		i++;
	 }
	}
	
	
	for (var step = 0; step < 10; step++) {
	
		//asignment step
		for (var j = 0; j < arrayX.length; j++) {
			var minDist = calculateDistance(arrayX[j], arrayY[j], centroidsX[0], centroidsY[0]);
			var minDistCluster = 0;
			for (var i = 1; i < k; i++) {
				var curDistance = calculateDistance(arrayX[j], arrayY[j], centroidsX[i], centroidsY[i]);
				if (minDist > curDistance) {
					minDist = curDistance;
					minDistCluster = i;
				}
			}
			membership[j] = minDistCluster;
		}
		
		//alert(membership);
		//update centroid
		
		
		var numMembers = new Array(k);

		for (var i = 0; i < k; i++) {
			centroidsX[i] = 0;
			centroidsY[i] = 0;
			numMembers[i] = 0;
		}
		
			for (var j = 0; j < arrayX.length; j++) {
				var i = membership[j];
				numMembers[i] = numMembers[i] + 1;
				centroidsX[i] = centroidsX[i] + arrayX[j];
				centroidsY[i] = centroidsY[i] + arrayY[j];
			}
		for (var i = 0; i < k; i++) {
			centroidsX[i] = centroidsX[i] / numMembers[i];
			centroidsY[i] = centroidsY[i] / numMembers[i];
		}
			//alert(centroidsX);
		
		
	}//end step	
	
	//alert(membership);
	//alert("done");
	
	return(membership);
	
}


function findMax(array)
{
	
var max = array[0];
for(var x=1; x<array.length; x++){
	//alert(array[x]);
	if(array[x] > max){
		max = array[x];
		//alert(max);
	}
}
//alert("The max is " + max);
//alert(max);
return(max);
}


function findMin(array)
{
	
var min = array[0];
for(var x=1; x<array.length; x++){
	if(array[x] < min){
		min = array[x];
	}
}
//alert("The min is " + min);
return(min);
}



function computeMedian(values){
	/*
	array.sort();
	alert(array.length);
	alert(array.length/2);
	alert(Math.floor(array.length/2));
	return(array.sort()[Math.floor(array.length/2))]);
	*/
	//from: https://gist.github.com/caseyjustus/1166258
	values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}


Raphael.st.draggable = function() {
  var me = this,
      lx = 0,
      ly = 0,
      ox = 0,
      oy = 0,
      moveFnc = function(dx, dy) {
          lx = dx + ox;
          ly = dy + oy;
          me.transform('t' + lx + ',' + ly);
      },
      startFnc = function() {},
      endFnc = function() {
          ox = lx;
          oy = ly;
      };
  
  this.drag(moveFnc, startFnc, endFnc);
};



function savesvg(){
	
	
  

	
	
    var canvas_=document.getElementById("canvas");
    var text = (new XMLSerializer()).serializeToString(canvas_);
    var encodedText = encodeURIComponent(text);
   open("data:image/svg+xml," + encodedText);

}



function createSVGNewWindow()
{
	
	
		//alert("Saving a SVG image to a new window."); //I added
var canvas_=document.getElementById("drawing_board");
var text = (new XMLSerializer()).serializeToString(canvas_);
//alert(text);
	
	//perform trimming to get rid of the <div ...> </div ..>
var n = text.search(">");
//alert(n);
	
var n2 = text.lastIndexOf("<");
// alert(n2);	
 
 var imageText = text.substring(n+1,n2);
   
    var encodedText = encodeURIComponent(imageText);
   // var encodedText = encodeURIComponent(text);
   open("data:image/svg+xml," + encodedText);   //THis doesn't work in Internet explorer..
   

}


function calculateDistance(obj1_x, obj1_y, obj2_x, obj2_y){
		return(Math.sqrt(Math.pow(obj1_x-obj2_x,2) + Math.pow(obj1_y-obj2_y,2)));
}

function parseTime(array){
 var year = new Array(array.length-1);
 for(var i=1; i < array.length; i++){
  year[i-1] = Number(array[i].substring(array[i].lastIndexOf("/")+1 , array[i].length-1));
 }
 return(year);
}




var one_x = null;
var one_y = null;
var one_ori_x = null;
var one_ori_y = null;
function selectPointD(){
 var ID = this.selectedIndex;
 one_x = circle[ID].attr('cx');
 one_y = circle[ID].attr('cy');
 
 one_ori_x = x_virus[ID];
 //alert(one_ori_x);
 one_ori_y = y_virus[ID];
 //alert(one_x);
 if(one_x != null && one_y != null && two_x != null && two_y != null){
  
     var d_x = two_x-one_x ;
	 var d_y = two_y - one_y;
     var pathString = "M " + one_x + " " + one_y + " l " + d_x +" " +  d_y; //doesn't work now
   // alert(pathString);
   var line = paper.path(pathString);
   	line.attr("stroke-width", "2");

    alert("Antigenic distance = " + calculateDistance(one_ori_x,one_ori_y, two_ori_x, two_ori_y).toPrecision(4));
	line.hide();
 }
 //draw a line:
}

var two_x = null;
var two_y = null;
var two_ori_x = null;
var two_ori_y = null;
function selectPointSerumD(){
 var ID = this.selectedIndex;
 two_x = squareSera[ID].attr('x') + radius;
 two_y = squareSera[ID].attr('y') + radius;
 
 two_ori_x = x_serum[ID];
 two_ori_y = y_serum[ID];
 
 
 var neighborhood_radius = 1;
 
 var drawCircle = paper.circle(two_x, two_y, 1*spreadFactor).attr({ fill: '#FF0000', stroke: '#FF0000', 'stroke-width': 0 , opacity:0.2});
 drawCircle.toBack();
 //http://stackoverflow.com/questions/13768213/raphael-make-object-not-receive-events
 //check neighborhood
 var neighborhoodList = "viruses within neighborhood:\n";
 for(var i=0; i < numViruses; i++){
 	var d=calculateDistance(x_virus[i],y_virus[i], two_ori_x, two_ori_y);
	if(d < neighborhood_radius){
		neighborhoodList = neighborhoodList + data[0][1+i*2] + "\n";
	}
 }
 alert(neighborhoodList);
 
 //alert(two_x);
 if(one_x != null && one_y != null && two_x != null && two_y != null){
 	//alert(calculateDistance(one_x,one_y, two_x, two_y));

var d_x = two_x-one_x ;
var d_y = two_y - one_y;
 var pathString = "M " + one_x + " " + one_y + " l " + d_x +" " +  d_y; //doesn't work now
  var line = paper.path(pathString);
     	line.attr("stroke-width", "2");
  	 alert("Antigenic distance = " + calculateDistance(one_ori_x,one_ori_y, two_ori_x, two_ori_y).toPrecision(4));
 //alert(pathString);
	line.hide();
 }
 
 
 
}

//Question. how to communicate with the element in paper?
function selectPoint(){
//alert(this.id + " - " + this.selectedIndex);
//    var circle = paper.circle(320, 240, 90).attr({ fill: '#3D6AA2', stroke: '#000000', 'stroke-width': 8 });
 
 var ID = this.selectedIndex;
if (text[ID] == null) {

	//to highlight, I also want to redraw the dot...
	//circle[ID].hide();
	var cir_x = circle[ID].attr('cx');
	var cir_y = circle[ID].attr('cy');
	var cir_r = circle[ID].attr('r');	
	var cir_opa = circle[ID].attr("fill-opacity");
	var cir_title = circle[ID].attr("title");
	
	
	var anim = Raphael.animation({r: cir_r*3, "fill-opacity":0.25}, 300);
	circle[ID].animate(anim);
	var anim2 = Raphael.animation({r: cir_r, "fill-opacity":cir_opa}, 600);
	circle[ID].animate(anim2.delay(300));

	circle[ID].toFront();
	//circle[ID].attr({fill: '#FF0000'});//don't change the color to read
 	//text[ID] = paper.text(cir_x - 5, cir_y - 10, data[0][1 + 2 * cir_title] ).attr({'font-size': 12,fill: '#003300', cursor: 'pointer'});
 	text[ID] = paper.text(cir_x - 5, cir_y - 10, virusName[cir_title] ).attr({'font-size': 12,fill: '#003300', cursor: 'pointer'});
	text[ID].drag(move, start, up);
	text[ID].dblclick(promptRename);
	//
}




}



function selectPointSera(){
//alert(this.id + " - " + this.selectedIndex);
//    var circle = paper.circle(320, 240, 90).attr({ fill: '#3D6AA2', stroke: '#000000', 'stroke-width': 8 });
 
 var ID = this.selectedIndex;
if (textSera[ID] == null) {

	//to highlight, I also want to redraw the dot...
	//circle[ID].hide();
	var cir_x = squareSera[ID].attr('x');
	var cir_y = squareSera[ID].attr('y');
	var cir_r = squareSera[ID].attr('width');	
	var cir_opa = circle[ID].attr("fill-opacity");
	var cir_title = circle[ID].attr("title");
	
	
	var anim = Raphael.animation({x:cir_x-cir_r*3/2, y:cir_y-cir_r*3/2, width: cir_r*3, height: cir_r*3, "fill-opacity":0.25}, 300);
	squareSera[ID].animate(anim);
	var anim2 = Raphael.animation({x:cir_x, y:cir_y, width: cir_r, height:cir_r, "fill-opacity":cir_opa}, 600);
	squareSera[ID].animate(anim2.delay(300));

	squareSera[ID].toFront();
	squareSera[ID].attr({fill: '#FF0000'});

 	//textSera[ID] = paper.text(cir_x - 5, cir_y - 5, seraData[0][1 + 2 * cir_title] ).attr({'font-size': 12,fill: '#003300', cursor: 'pointer'});
 	textSera[ID] = paper.text(cir_x - 5, cir_y - 5, serumName[cir_title] ).attr({'font-size': 12,fill: '#003300', cursor: 'pointer'});
	textSera[ID].drag(move, start, up);
	textSera[ID].dblclick(promptRename);
	//
}




}



function MCMCselectPoint(){
	 
 	var dataRow = this.selectedIndex +1;
//	alert(dataRow);
	
	//code to update the plot  (new coordinates and text attached to it)

if(virusLoaded){
	var x_coord = new Array(numViruses);
	var y_coord = new Array(numViruses);
	
    for (var i = 0; i < numViruses; i++) {
      x_coord[i] =  Number(data[dataRow][2*i+1]);
	   x_coord[i] = x_off + x_coord[i]; //add offset

	  y_coord[i] =  Number(data[dataRow][2*i+2]);
	   y_coord[i] = y_off + y_coord[i];	 //add offset
    }


  
//alert(numViruses);
	for(var ID=0; ID < numViruses; ID++){
	  var xpos = x_offset +x_coord[ID]*spreadFactor;
	  var ypos =  plotHeight - y_offset - y_coord[ID]*spreadFactor;
	 //var anim = Raphael.animation({cx:100 , cy:100 }, 300);
	 var anim = Raphael.animation({cx:xpos , cy:ypos }, 300);
	 circle[ID].animate(anim);
	}

	for(var ID=0; ID < numViruses; ID++){
	 if (text[ID] != null) {
		var xpos = x_offset + x_coord[ID] * spreadFactor;
		var ypos = plotHeight - y_offset - y_coord[ID] * spreadFactor;
		var anim = Raphael.animation({
			x: xpos - 5,
			y: ypos -10
		}, 300);
		text[ID].animate(anim);
	 }		
	}

}


if(serumLoaded){
//assume the first column matches
//sera
	var x_coord = new Array(numSera);
	var y_coord = new Array(numSera);

    for (var i = 0; i < numSera; i++) {
      x_coord[i] =  Number(seraData[dataRow][2*i+1]);
	  y_coord[i] =  Number(seraData[dataRow][2*i+2]);
    }
 	
//add offset for now
for(var i=0; i<numSera; i++){
 x_coord[i] = x_off + x_coord[i];
 y_coord[i] = y_off + y_coord[i];	
}


	for(var ID=0; ID < numSera; ID++){
	  var xpos = x_offset +x_coord[ID]*spreadFactor - radius;
	  var ypos =  plotHeight - y_offset - y_coord[ID]*spreadFactor - radius;
	 //var anim = Raphael.animation({cx:100 , cy:100 }, 300);
	 var anim = Raphael.animation({x:xpos , y:ypos }, 300);
	 squareSera[ID].animate(anim);
	}

	for(var ID=0; ID < numSera; ID++){
	 if (textSera[ID] != null) {
		var xpos = x_offset + x_coord[ID] * spreadFactor;
		var ypos = plotHeight - y_offset - y_coord[ID] * spreadFactor;
		var anim = Raphael.animation({
			x: xpos - 5,
			y: ypos -5
		}, 300);
		textSera[ID].animate(anim);
	 }		
	}
}//serum laoded

	
}


function MCMC_median(){

	var x_coord_median = new Array(numViruses);
	var y_coord_median = new Array(numViruses);
	
	for(var i=0; i < numViruses; i++){
		
		var numSamples = data.length-1;
		var xSamples = new Array(numSamples);
		var ySamples = new Array(numSamples);
		for(var j=0; j< numSamples;j++){
			xSamples[j] = Number(data[j+1][2*i+1]);
			ySamples[j] = Number(data[j+1][2*i+2]);
		}
		x_coord_median[i] = computeMedian(xSamples);
		y_coord_median[i] = computeMedian(ySamples);
	}
	
	
	x_virus = x_coord_median;
	y_virus = x_coord_median;
	
	
	
//displacement
    for (var i = 0; i < numViruses; i++) {
	   x_coord_median[i] = x_off + x_coord_median[i]; //add offset
	   y_coord_median[i] = y_off + y_coord_median[i];	 //add offset
    }
	
	

	for(var ID=0; ID < numViruses; ID++){
	  var xpos = x_offset +x_coord_median[ID]*spreadFactor;
	  var ypos =  plotHeight - y_offset - y_coord_median[ID]*spreadFactor;
	 //var anim = Raphael.animation({cx:100 , cy:100 }, 300);
	 var anim = Raphael.animation({cx:xpos , cy:ypos }, 300);
	 circle[ID].animate(anim);
	}

	for(var ID=0; ID < numViruses; ID++){
	 if (text[ID] != null) {
		var xpos = x_offset + x_coord_median[ID] * spreadFactor;
		var ypos = plotHeight - y_offset - y_coord_median[ID] * spreadFactor;
		var anim = Raphael.animation({
			x: xpos - 5,
			y: ypos -10
		}, 300);
		text[ID].animate(anim);
	 }		
	}
	
	
	//sera
	var x_coord_median = new Array(numViruses);
	var y_coord_median = new Array(numViruses);
	
	for(var i=0; i < numSera; i++){
		
		//var numSamples = data.length-1; //assume to be the same as above
		var xSamples = new Array(numSamples);
		var ySamples = new Array(numSamples);
		for(var j=0; j< numSamples;j++){
			xSamples[j] = Number(seraData[j+1][2*i+1]);
			ySamples[j] = Number(seraData[j+1][2*i+2]);
		}
		x_coord_median[i] = computeMedian(xSamples);
		y_coord_median[i] = computeMedian(ySamples);
	}
	
	x_serum = x_coord_median;
	y_serum = x_coord_median;
	
//displacement
    for (var i = 0; i < numSera; i++) {
	   x_coord_median[i] = x_off + x_coord_median[i]; //add offset
	   y_coord_median[i] = y_off + y_coord_median[i];	 //add offset
    }
	
	

	for(var ID=0; ID < numSera; ID++){
	  var xpos = x_offset +x_coord_median[ID]*spreadFactor;
	  var ypos =  plotHeight - y_offset - y_coord_median[ID]*spreadFactor;
	 //var anim = Raphael.animation({cx:100 , cy:100 }, 300);
	 var anim = Raphael.animation({x:xpos , y:ypos }, 300);
	 squareSera[ID].animate(anim);
	}

	for(var ID=0; ID < numViruses; ID++){
	 if (textSera[ID] != null) {
		var xpos = x_offset + x_coord_median[ID] * spreadFactor;
		var ypos = plotHeight - y_offset - y_coord_median[ID] * spreadFactor;
		var anim = Raphael.animation({
			x: xpos - 5,
			y: ypos -5
		}, 300);
		textSera[ID].animate(anim);
	 }		
	}
		
}



var virusLoaded = 0;
var serumLoaded = 0;
//global objects
var paper;
var circle;
var newVariationCircle;
var newVariationCircleIsTriggered;
var text;
var data;
var radius = 8;
var numViruses;
var CI_pairwise;
var CI_pairwise_legend;


var x_offset = 30;
var y_offset = 30;
var spreadFactor;
var plotHeight = 800;
var plotWidth = 800;
//var x_off = 2;
//var y_off = 2;
var x_off;
var y_off;


function changeRadiusFunction(){
	
	
	var old_r = Number(radius);
  	var new_r=prompt("Change radius of the points to # pixels? (e.g. 5)");
	
	
	radius = Number(new_r);
	
	
	
	if(virusLoaded){
	//need to update drawing or clear drawing... now is not good.
	for(var ID=0; ID < numViruses; ID++){
	 //var anim = Raphael.animation({cx:100 , cy:100 }, 300);
	 var anim = Raphael.animation({r:radius}, 300);
	 circle[ID].animate(anim);
	 }
	}


	
	
	if(serumLoaded){ 
	 for(var ID=0; ID < numSera; ID++){
	 var ori_xpos= squareSera[ID].attr('x') +old_r ;
	 var ori_ypos= squareSera[ID].attr('y') +old_r ;
  //squareSera[i] = paper.rect(xpos+radius, ypos+radius, radius*2, radius*2).attr({ stroke: '#660066', fill: '#FFFFFF', 'stroke-width': 2, title:i , "fill-opacity": 1});
	  var anim = Raphael.animation({x:ori_xpos-radius, y:ori_ypos-radius, width:radius*2, height:radius*2}, 300);
	  squareSera[ID].animate(anim); 	 
	  }
	}
	

}

var serumName;

var squareSera;
var textSera;
var numSera;
var seraData;

var x_serum;
var y_serum;
	
	
function addSera(dataStr, readDataType){
	
	serumLoaded = 1;
	
	 seraData = CSVToArray( dataStr , "\t");
	 numSera = (seraData[0].length -1)/2;
	// alert(numSera);
	//alert(numViruses);


	
//the data has an offset of 1..
//first line= header, subsequent lines = data

for(var k=0; k < numSamples; k++){


if(isAlign){		
//apply alignment
for (var i = 0; i < numSera; i++) {
			seraData[k+1][2*i+1] = Number(seraData[k+1][2 * i + 1]) - m_x[k];//changing seraData, not t_seraData
			seraData[k+1][2*i+2] = Number(seraData[k+1][2 * i + 2]) - m_y[k]; //changing seraData, not t_seraData
		}
}		
	
if(isFlip){	
//apply flip		
  if(flip_samples[k]==1){
   //flip horizontally
    for (var i = 0; i < numSera; i++) {
		seraData[k+1][2*i+1] = -seraData[k+1][2*i+1];
	}
  }
}  
 
if(isRotate){ 
  //apply rotation
  for (var i = 0; i < numSera; i++) {
		var new_x, new_y;
		 new_x =  seraData[k+1][2*i+1]*Math.cos(theta_samples[k]) + seraData[k+1][2*i+2]*Math.sin(theta_samples[k]);   
		 new_y = -seraData[k+1][2*i+1]*Math.sin(theta_samples[k]) + seraData[k+1][2*i+2]*Math.cos(theta_samples[k]);
		seraData[k+1][2*i+1] = new_x;
		seraData[k+1][2*i+2] = new_y;
	}
}		
		
}//for each sample
	
	


	
	
	var x_coord = new Array(numSera);
	var y_coord = new Array(numSera);
	
    for (var i = 0; i < numSera; i++) {
      x_coord[i] =  Number(seraData[data.length-1][2*i+1]);
	  y_coord[i] =  Number(seraData[data.length-1][2*i+2]);
    }
 	
	x_serum = x_coord;
	y_serum = y_coord;
	
//alert("hi");
//add offset for now
for(var i=0; i<numSera; i++){
 x_coord[i] = x_off + x_coord[i];
 y_coord[i] = y_off + y_coord[i];	
}


squareSera = new Array(numSera);
textSera = new Array(numSera);
CI_pairwise_legend = new Array(numSera);

var opacityFirst = 0.4;
var opacityLast = 1;
for(var i=0; i< numSera; i++){
  //var opacityValue = (opacityLast - opacityFirst)*i/numViruses + opacityFirst;
  //opacity value set to 0
  var xpos_begin = x_offset +x_coord[i]*spreadFactor  - radius;  //the begin x
  var ypos_begin =  plotHeight - y_offset - y_coord[i]*spreadFactor -radius; //the begin y
  //squareSera[i] = paper.circle(xpos, ypos, radius+2).attr({ stroke: '#660066', fill: '#FFFFFF', 'stroke-width': 2, title:i , "fill-opacity": 1});
  squareSera[i] = paper.rect(xpos_begin, ypos_begin, radius*2, radius*2).attr({ stroke: '#660066', fill: '#FFFFFF', 'stroke-width': 2, title:i , "fill-opacity": 1});  
 
 //  //squareSera[i] = paper.circle(x_offset + Math.floor(x_coord[i]*spreadFactor), y_offset+(370-Math.floor(y_coord[i]*spreadFactor)), radius).attr({ stroke: '#3D6AA2', fill: '#0066FF', 'stroke-width': 2 });	
  ////  var dot = paper.circle(x_offset + Math.floor(x_coord[i]), y_offset+Math.floor(y_coord[i]), radius).attr({ fill: '#3D6AA2', stroke: '#000000', 'stroke-width': 8 });	
}


serumName = new Array(numSera);

for(var i=0; i < numSera; i++){
  serumName[i] = seraData[0][1 + 2 * i].substring(0, seraData[0][1 + 2 * i].length - 1);
}



for (var i = 0; i < numSera; i++) {
	squareSera[i].click(function(){
		this.attr({fill: '#FF0000'});
		this.toFront();
		//text.attr({text:dynamicText, x:280});
		//var text2 = paper.text(280, 280, "Clicked!").attr({			'font-size': 25,			fill: '#009933'		});
		//alert(this.attr('cx'));
		var objectID = Number(this.attr('title'));
		//alert(objectID);
		 if(textSera[objectID]==null){
			//textSera[objectID] = paper.text(this.attr('x')-5, this.attr('y')-5, seraData[0][1+2*this.attr('title')]).attr({			'font-size': 12,			fill: '#003300', cursor: 'pointer'	});
			textSera[objectID] = paper.text(this.attr('x')-5, this.attr('y')-5, serumName[this.attr('title')]).attr({			'font-size': 12,			fill: '#003300', cursor: 'pointer'	});
			//originally move start up functions declared here
            textSera[objectID].drag(move, start, up);
			//originally promptRename declared here
			textSera[objectID].dblclick(promptRename);

			}
			else{
				this.attr({fill: '#FFFFFF'})  //revert back to the original color
				textSera[objectID].hide();
				textSera[objectID] = null;
			}
			//alert(text2[this.attr('title')].status());
			//text2[this.attr('title')].show();
			
			//text2[this.attr('title')].hide();
			
	});
	squareSera[i].hover(function(){
		
		this.toFront();
		var objectID = Number(this.attr('title'));

		if(readDataType ==1){		
			for(var curObject = 0; curObject < numViruses; curObject++){
			var pairwiseDistance = new Array(numSamples);
	  		 for(var k=0; k<numSamples; k++){	
	  		 	 pairwiseDistance[k] =  Math.sqrt( Math.pow( (Number(seraData[k+1][2 * objectID + 1]) - Number(data[k+1][2 * curObject + 1])), 2)     
	  		 	                                 + Math.pow( (Number(seraData[k+1][2 * objectID + 2]) - Number(data[k+1][2 * curObject + 2])), 2) );
					  		 	
	  		 }
 	    	var pivot_x = this.attr('x') +  radius; //need to add the radius offset back to get the center of the square
	 	    var pivot_y = this.attr('y') + radius;  //need to add the radius offset back to get the center of the square

			var pt_x = circle[curObject].attr('cx');
	 	    var pt_y = circle[curObject].attr('cy');

			var slope = (pt_y - pivot_y)/ (pt_x -pivot_x);
			//alert(slope);
			///  (Number(data[k+1][2 * objectID + 1]) - Number(data[k+1][2 * curObject + 1]))
			var change_x_0_1 = quantile(pairwiseDistance, 0.1)/ Math.sqrt(  1 + Math.pow(slope,2) ) ;
			var change_y_0_1 = quantile(pairwiseDistance, 0.1) / Math.sqrt(  1 + Math.pow(slope,2) ) *slope ;
			
			var dist = Math.sqrt( Math.pow(((pt_y - pivot_y)/spreadFactor) ,2) + Math.pow( ((pt_x -pivot_x)/spreadFactor), 2) );
			
			change_x_0_1 = change_x_0_1 * spreadFactor;
			change_y_0_1 = change_y_0_1 * spreadFactor;

			//needs to attach direction of change		
			if( pivot_x > pt_x){
				change_x_0_1 = -change_x_0_1;
				change_y_0_1 = - change_y_0_1; 
			}
			
			var change_x_0_9 = quantile(pairwiseDistance, 0.9)/ Math.sqrt(  1 + Math.pow(slope,2) ) ;
			var change_y_0_9 = quantile(pairwiseDistance, 0.9) / Math.sqrt(  1 + Math.pow(slope,2) ) *slope ;
			
			change_x_0_9 = change_x_0_9 * spreadFactor;
			change_y_0_9 = change_y_0_9 * spreadFactor;
		
			if( pivot_x > pt_x){
				change_x_0_9 = -change_x_0_9; 
				change_y_0_9 = - change_y_0_9;
			}
			
			
			
			var x_0_1 = pivot_x + change_x_0_1;
			var y_0_1 = pivot_y + change_y_0_1;
			
			var x_0_9 = pivot_x + change_x_0_9;
			var y_0_9 = pivot_y + change_y_0_9;
			
			var diff_x = x_0_9 - x_0_1;
			var diff_y = y_0_9 - y_0_1;
			var curObject_fillColor = circle[curObject].attr('fill');
			
			if(curObject_fillColor == "#FFFFFF"){
				curObject_fillColor = "#000000";
			}
			
			var curObject_cx = circle[curObject].attr('cx');
			var curObject_cy = circle[curObject].attr('cy');
			CI_pairwise[curObject] = paper.path("M " + x_0_1 + " " + y_0_1 + " l " + diff_x + " " + diff_y).attr( {		stroke:curObject_fillColor,		'stroke-width':5,		'opacity': 0.1	});
			
			  if(isDisplayDistance){
				var distStr =  dist.toPrecision(3) + " ["+ quantile(pairwiseDistance, 0.1).toPrecision(3) + ", " + quantile(pairwiseDistance, 0.9).toPrecision(3) + "]";
				CI_pairwise_legend[curObject] = paper.text(x_0_9, y_0_9,distStr ).attr({'font-size': 10,fill:'#000000', cursor: 'pointer'});
				CI_pairwise_legend[curObject].toFront();
			  }
			}//curObject iteration

		}
		
	},
	function(){
				var objectID = Number(this.attr('title'));
		for(var curObject=0; curObject < numViruses; curObject++){
			CI_pairwise[curObject].hide();
			CI_pairwise[curObject] = null;
			
			if(isDisplayDistance){
			  CI_pairwise_legend[curObject].hide();
			  CI_pairwise_legend[curObject] = null;
			 }
		}
	
	}
	);
		
	

}



//alert(numSera);
//alert(numSera);
	var divTextSera = document.createElement('divTextSera');
	divTextSera.innerHTML="select a specific antiserum<br>";
	document.getElementById("barSera").appendChild(divTextSera);
	var newSelectSera = document.createElement("select");
	newSelectSera.id = "selectlistid"; //add some attributes
	newSelectSera.size = 10;
//	newSelect.onchange = somethingChanged;  // call the somethingChanged function when a change is made
	newSelectSera.onchange = selectPointSera;
	//newSelect[newSelect.length] = new Option("One", "1", false, false); // add new option
	//newSelect[newSelect.length] = new Option("Two", "2", false, false); // add new option
	for(var i=0; i < numSera; i++){
		newSelectSera[newSelectSera.length] = new Option(serumName[i],i, false, false);
	}
		
	document.getElementById("barSera").appendChild(newSelectSera); // myDiv is the container to hold the select list
	




/*
var divTextSeraD = document.createElement('divText');
	divTextSeraD.innerHTML="Select a specific antiserum for computing distance (and to obtain a list of viruses within the neighborhood of radius 1)<br>";
//	document.getElementById("distance_virus").appendChild(divTextD);
document.getElementById("distance_serum").appendChild(divTextSeraD); // myDiv is the container to hold the select list

var newSelectSeraD = document.createElement('select');
	newSelectSeraD.id = "selectSerumD"; //add some attributes
	newSelectSeraD.size = 10;
	newSelectSeraD.onchange = selectPointSerumD;  // call the somethingChanged function when a change is made
	for(var i=0; i < numSera; i++){
		newSelectSeraD[newSelectSeraD.length] = new Option(seraData[0][1+2*i],i, false, false);
	}
	document.getElementById("distance_serum").appendChild(newSelectSeraD); // myDiv is the container to hold the select list
	*/




} //end function



var cluster_assignment = new Array();
function add_cluster_color(cluster_str){
 var cluster_data = CSVToArray( cluster_str , "\t");
 
 var groupColumn = 3;
 var virusColumn = 1;
 
 var numSamples = cluster_data.length;
 

 var groupNames = new Array();
 var numGroups = 0;
  
 //alert(numSamples);
 //column 2 - strain . column 4 - clade.
 
 //identify unique clades (number, and which - index them)
 for(var row=0; row < numSamples; row++){
 	//alert(cluster_data[row][groupColumn]);
 	var groupNumber = hasIdentifiedGroup(cluster_data[row][groupColumn], groupNames, numGroups); 
 	if(groupNumber == -1){
 		 groupNames[numGroups] = cluster_data[row][groupColumn];
		 cluster_assignment[row] = numGroups;
		 groupStr = "clade " + cluster_data[row][groupColumn] + " is group #" + numGroups;
		 numGroups++;
		 //alert(groupStr);
 	}
 	else{
 		cluster_assignment[row] = groupNumber;
 	}
 }
 //alert(cluster_assignment); 
//alert(cluster_assignment[32]);

//alert(virusName);
//match virusname from the virus location data to that from the other data
var matchIndexes = new Array();
for(var v=0; v < virusName.length; v++){
  for(var i=0; i < numSamples; i++){
  	 if(virusName[v] == cluster_data[i][virusColumn]){
  	 	matchIndexes[v] = i;
  	 	break;
  	 }
  }
}

//alert(matchIndexes);

 //create a dictionary of clade name and color as a function of indexes
 //var cladeColor
 var colorCluster = new Array("#171E24","#3A7295", "#0B5A9F", "#ED68C5","#C02900", "#7FAD6C", "#025A1E", "#1D7332", "#329135", 
"#F77565", "#CB301C", "#841410", "#BC1711", "#B0B02E", "#6C5BC5", "#306877", "#F95A23", "#83AE69");

 
 //color the clades
 for(var c=0; c< numSamples; c++){
 	circle[c].toFront();
 	circle[c].attr({stroke:colorCluster[cluster_assignment[matchIndexes[c]]], fill: colorCluster[cluster_assignment[matchIndexes[c]]]});
 }
 
 
}


function hasIdentifiedGroup(x, groups, numGroups){
 var groupIndex = -1;
 if(numGroups > 0 ){
 	for(var i=0; i < numGroups; i++){
 		if(x == groups[i]){
 			groupIndex = i;
 			break;
 		}
 	}
 }
 return(groupIndex);	
}


function average(data) {
var result = 0;
for(var i=0; i < data.length; i++) {     
    result += data[i];    
}
return(result / data.length);
}


//adopted from http://caseyjustus.com/finding-the-median-of-an-array-with-javascript
// turns out the original version had a bug. it sorted the original data
function median(data) {
 	var values = new Array(data.length);
 	for(var i=0; i < data.length; i++){
 		values[i] = data[i];
 	} 
 	values.sort( function(a,b) {return a - b;} ); 
    var half = Math.floor(values.length/2);
 
    if(values.length % 2 )
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
 

function quantile(data, prob) {
	var values = new Array(data.length);
 	for(var i=0; i < data.length; i++){
 		values[i] = data[i];
 	} 
	 values.sort( function(a,b) {return a - b;} );
	 
    var index_prob = Math.floor(values.length * prob);

    if( (values.length+1) % (1/prob)==0 ){
    	
        return values[index_prob];
       }
    else{
    	
        return (values[index_prob-1] + values[index_prob]) / 2.0;
       }
}
 
function checkDistanceOption(){
	if(chk_displayDistance.checked == false){
		isDisplayDistance = 0;
	}
	else{           
		isDisplayDistance = 1;
	}

}


function handleClick(cb) {
	alert("yo");
}


function trimHeadAndBottom(fileStr){
	var fileOutput = fileStr;
	fileOutput= fileOutput.replace(/^#.*$/mg,""); //trim line that begins with #
	fileOutput = fileOutput.replace(/^\s+|\s+$/g, ''); //trim leading and trailing spaces and empty lines
	return fileOutput;

	
	//return(fileOutput);
} 
 
var numSamples; 

//To keep track of the Procrustes transformation
var m_x;
var m_y;
var theta_samples;
var flip_samples;



var virusName;
var x_virus;
var y_virus;

//var isProcrustes = 1;

var isAlign = 1;
var isFlip = 1;
var isRotate = 1;

var isDisplayDistance = 1;

function addViruses(dataStr, readDataType){
	
	
if(chk_displayDistance.checked == false){
	isDisplayDistance = 0;
}
else{           
	isDisplayDistance = 1;
}

	
if(align.checked == false){
	isAlign = 0;
}
else{           
	isAlign = 1;
}


if(toFlip.checked == false){
	isFlip = 0;
}
else{           
	isFlip = 1;
}
	
	
	
if(rotate.checked == false){
 	isRotate = 0;
}
else{           
	isRotate = 1;
}
	
	
 data = CSVToArray( dataStr , "\t");

 virusLoaded = 1;


if (readDataType == 1) {
	var year = parseTime(data[0]);
	var minYear = findMin(year);
	var maxYear = findMax(year);
	numViruses = (data[0].length - 1) / 2;
}
else if (readDataType ==2){
	numViruses = data.length -1;
}
//	alert(numViruses);


	
	var x_coord = new Array(numViruses);
	var y_coord = new Array(numViruses);
	virusName = new Array(numViruses);
	
	numSamples = data.length -1;


//var t_data = data;


m_x = new Array(numSamples);
m_y = new Array(numSamples);


 //align
 
 if(isAlign){
	if(readDataType ==1){


	//assume the first column is the names... and then there are numSamples, from 1 to nSamples
		  	for(var k=0; k < numSamples; k++){

			var x_data = new Array(numViruses);
			var y_data = new Array(numViruses);
	  		
			//select the x and y data on the sample
			for (var i = 0; i < numViruses; i++) {
				x_data[i] = Number(data[k+1][2*i + 1]); //the first datapoint starts on the second line
				y_data[i] = Number(data[k+1][2*i + 2]);
			}	
			
			//Compute median of the k_th sample
			m_x[k] = median(x_data);
	  		m_y[k] = median(y_data);
	  				
	  		for (var i = 0; i < numViruses; i++) {
	  			
	  			data[k+1][2*i+1] = Number(data[k+1][2 * i + 1]) - m_x[k];//changing data, not t_data
				data[k+1][2*i+2] = Number(data[k+1][2 * i + 2]) - m_y[k]; //changing data, not t_data	
			}
			//alert(x_data);		
		 } //k
		
			   	 
  	 } //readDataType
  }//isAlign


//reference is the last line of the data
 //score:
if(isRotate | isFlip){

var t_data = [];
for(var i=0; i< data.length; i++) {
    t_data[i] = new Array(data[i].length);
}

for(var i=0; i < data.length; i++){
	for(var j=0; j < data[i].length; j++){
		t_data[i][j] = data[i][j];
	}
}
 
 
  theta_samples = new Array(numSamples);
  flip_samples = new Array(numSamples);
 
 var ref_index = numSamples;
 
 theta_samples[numSamples-1] = 0;  //last line is the reference 
 flip_samples[numSamples-1] = 0;
 
 for(var k=1; k <= numSamples; k++){
 
 

 var min_hasFlipped=0;
 var min_theta = 0;
 var min_score;
	
	var theta_solution = 0;
 	var score = 0;
 	
	for (var i = 0; i < numViruses; i++) {
   	//	score = score + Math.sqrt( Math.pow( (data[ref_index][2*i+1] -t_data[k][2*i+1]),2) + Math.pow( (data[ref_index][2*i+2] -t_data[k][2*i+2]),2) );
   		score = score + Math.pow( (t_data[k][2*i+1]- data[ref_index][2*i+1]),2) + Math.pow( (t_data[k][2*i+2]-data[ref_index][2*i+2]),2) ;
	} 
	min_score = score;
//alert(min_score);
 

for(var flip = 0; flip <=isFlip; flip++){


	//first, copy the original data:
 	for(var i=0; i < t_data[k].length; i++){
 		t_data[k][i] = data[k][i];
 	}
 	
  if(flip==1){
 //flip horizontally
    for (var i = 0; i < numViruses; i++) {
		t_data[k][2*i+1] = -t_data[k][2*i+1];
	}
  }
	
   if(isRotate){	
	var top =0;
	var bottom = 0;
	for(var i=0; i < numViruses; i++){
		top = top + t_data[k][2*i+1]*data[ref_index][2*i+2] - t_data[k][2*i+2]*data[ref_index][2*i+1];
	}
	for(var i=0; i < numViruses; i++){
		bottom = bottom + t_data[k][2*i+1]*data[ref_index][2*i+1] + t_data[k][2*i+2]*data[ref_index][2*i+2];
	}
		//alert(top/bottom);	  
	theta_solution = Math.atan( top/bottom)	;
//alert(theta_solution);

	for (var i = 0; i < numViruses; i++) {
		var new_x, new_y;
		 new_x =  t_data[k][2*i+1]*Math.cos(-theta_solution) + t_data[k][2*i+2]*Math.sin(-theta_solution);   
		 new_y = -t_data[k][2*i+1]*Math.sin(-theta_solution) + t_data[k][2*i+2]*Math.cos(-theta_solution);
		t_data[k][2*i+1] = new_x;
		t_data[k][2*i+2] = new_y;
		
		//t_data[k][2*i+1] = -0.844;
		//t_data[k][2*i+2] = -1.32;
	}
	
   }//isRotate

	var score = 0;
	for (var i = 0; i < numViruses; i++) {
   		//score = score + Math.sqrt( Math.pow( (data[ref_index][2*i+1] -t_data[k][2*i+1]),2) + Math.pow( (data[ref_index][2*i+2] -t_data[k][2*i+2]),2) );
   		score = score + Math.pow( (t_data[k][2*i+1]- data[ref_index][2*i+1]),2) + Math.pow( (t_data[k][2*i+2]-data[ref_index][2*i+2]),2) ;
	} 

	if(min_score > score){
		min_score = score;
		min_hasFlipped = flip;
		min_theta = theta_solution;
	}

}

//var xyz = -min_theta*180/Math.PI;
//var str = "min_theta" + xyz + " score=" + min_score;

//alert(-min_theta*180/Math.PI);
//var str = "min_theta" + min_theta + " score=" + min_score;

//alert(str);

theta_samples[k-1] = -min_theta;  //not sure why I need that negative, but it seems that the solution needs to be flipped. I think it is the counterclockwise vs. clockwise thing.
flip_samples[k-1] = min_hasFlipped; 


//Apply transformation
//set to the value that maximizes the score

  if(min_hasFlipped==1){
 // 	alert("flipping");
 //flip horizontally
    for (var i = 0; i < numViruses; i++) {
		data[k][2*i+1] = -data[k][2*i+1];
	}
  }

  //rotation  
  for (var i = 0; i < numViruses; i++) {
		var new_x, new_y;
		 new_x =  data[k][2*i+1]*Math.cos(-min_theta) + data[k][2*i+2]*Math.sin(-min_theta);   
		 new_y = -data[k][2*i+1]*Math.sin(-min_theta) + data[k][2*i+2]*Math.cos(-min_theta);
		data[k][2*i+1] = new_x;
		data[k][2*i+2] = new_y;
	}
	

  //alert("transformed to achieve the best fit.");
  
 }
 }//isRotate or isFlip
else{
	//no rotation and no flip
}



	//plot the last iteration
	if (readDataType == 1) {
		for (var i = 0; i < numViruses; i++) {
			x_coord[i] = Number(data[numSamples ][2 * i + 1]);
			y_coord[i] = Number(data[numSamples ][2 * i + 2]);
			virusName[i] = data[0][1 + 2 * i].substring(0, data[0][1 + 2 * i].length - 1);
		  //name[i-1] = array[i].substring(0 , array[i].length-1));	
		}		
	}
	else if (readDataType ==2){
		for (var i = 0; i < numViruses; i++) {
			x_coord[i] = Number(data[i + 1][3]);
			y_coord[i] = Number(data[i + 1][4]);
			virusName[i] = data[i+1][1];
		}
		
	}
	
	
	x_virus = x_coord;
	y_virus = y_coord;
	
	var x_max, y_max, x_min, y_min;
	
	if(readDataType ==1){
		x_max = findMax(x_coord);
		y_max = findMax(y_coord);
		x_min = findMin(x_coord);
		y_min = findMin(y_coord);

	  for(var k=1; k <= numSamples; k++){		
		for(var i=0; i < numViruses; i++){
			if(Number(data[k][2*i+1])> x_max){
				x_max = data[k][2*i+1];
			}
			if(Number(data[k][2*i+1])< x_min){
				x_min = data[k][2*i+1];
			}
			if(Number(data[k][2*i+2])> y_max){
				y_max = data[k][2*i+2];
			}
			if(Number(data[k][2*i+2])< y_min){
				y_min = data[k][2*i+2];
			}			
		}
	   }
	   
 
	   
	   
	}
	else if(readDataType ==2){
		x_max = findMax(x_coord);
		y_max = findMax(y_coord);

		x_min = findMin(x_coord);
		y_min = findMin(y_coord);	
	}

	//alert(x_coord);

	//alert("hi");	

//    var text2 = paper.text(50, 50, data[0][1]).attr({ 'font-size': 8, fill: '#000000', cursor: 'pointer' });
//var text3 = paper.text(100, 160, data.length).attr({ 'font-size': 8, fill: '#000000', cursor: 'pointer' });
//  var text3 = paper.text(100, 100, data[0].length).attr({ 'font-size': 8, fill: '#000000', cursor: 'pointer' });




  
    // Write text in the center of the canvas.
   // var text = paper.text(320, 240, "Center").attr({ 'font-size': 22, fill: '#FFFFFF', cursor: 'pointer' });

//data[1].sort();
//var xx = document.getElementById("demo");
//xx.innerHTML=data[1];
    


var x_range = x_max - x_min;
var y_range = y_max - y_min;

var x_or_y_range_bigger = 0;
if(y_range > x_range){
	x_or_y_range_bigger = 1;  //range of y is bigger
}



//var x_off = -(x_min);
//var y_off = -(y_min);


//var MAXplotHeight = 1200;
//var MAXplotWidth = 1200;



//var plotYRange = MAXplotHeight - 2*y_offset;
//var plotXRange = MAXplotWidth - 2*x_offset;

//var maxSpread = Math.min(plotYRange/y_range, plotXRange/x_range);

//var plotHeight = maxSpread*y_range + y_offset*2;
//alert(plotHeight);
//var plotWidth = maxSpread*x_range + x_offset*2;
//alert(plotWidth);




//elem2.style.width = plotWidth;
//elem2.style.height = plotHeight;

//var spreadFactor = maxSpread;


var interval_size_x = 1;
var interval_size_y = 1;

var xposStart = (Math.min(Math.ceil(x_min/interval_size_x), Math.floor(x_min/interval_size_x))*interval_size_x); //coz it may be a negative number
var yposStart = (Math.min(Math.ceil(y_min/interval_size_y), Math.floor(y_min/interval_size_y))*interval_size_y); //coz it may be a negative number

var xposEnd = (Math.max(Math.ceil(x_max/interval_size_x), Math.floor(x_max/interval_size_x))*interval_size_x); //coz it may be a negative number
var yposEnd = (Math.max(Math.ceil(y_max/interval_size_y), Math.floor(y_max/interval_size_y))*interval_size_y); //coz it may be a negative number

//var xposStart =  Math.floor(x_min) -2;
//var yposStart =  Math.floor(y_min) -2;

x_off = -(xposStart);
y_off = -(yposStart);

//now each line is 1 unit
//var numHline = 28;
//var numVline = 11;
//var xposStart  = -3;
//var yposStart = -6;

//var plot_x_range = Math.ceil(x_range) + 1;
//var plot_y_range = Math.ceil(y_range) + 4;

var plot_x_range =  xposEnd-xposStart;
var plot_y_range = yposEnd-yposStart;

//alert(plot_x_range);
//alert(plot_y_range);

var numHline = Math.ceil(plot_x_range/interval_size_x);
var numVline = Math.ceil(plot_y_range / interval_size_y);


var y_axisLength = plotHeight - 2*y_offset;  //available height
var x_axisLength = plotWidth -2*x_offset;  //available width


 spreadFactor = Math.floor(Math.min(y_axisLength/plot_y_range, x_axisLength/plot_x_range));  //determine maxSpread based on all the runs later...
var yDimension = 2*y_offset + numVline*interval_size_y*spreadFactor;
var xDimension = 2*x_offset+ numHline*interval_size_x*spreadFactor;

//update plot height
plotHeight = yDimension;
plotWidth = xDimension;
//update axis length:
 y_axisLength = plotHeight - 2*y_offset;  //available height
 x_axisLength = plotWidth -2*x_offset;  //available width

	
	 var x_origin = x_offset +  x_off*spreadFactor;
	var y_origin = plotHeight - (y_offset + y_off*spreadFactor);



paper = Raphael('drawing_board');

var ele = document.getElementById("drawing_board");
var dimensionStr = "width: " + plotWidth + "; height:" + plotHeight;

//ele.setAttribute("style",dimensionStr); //update height and width    




for (var i = 0; i <= numHline; i++) {
	var pos = i*interval_size_x + xposStart; //start from -1
	
//	var x_grid = x_offset + (x_off + pos) * spreadFactor;
	var x_grid = x_offset + (x_off + pos) * spreadFactor;
	//draw vertical line
	//var y_begin =plotHeight - (y_offset + (y_off + yposStart + numVline) * spreadFactor) ;
	
	var y_begin =plotHeight - y_offset - numVline*interval_size_y*spreadFactor;
	//var yline = paper.path("M " + x_grid + " " + y_begin + " l 0 " + (numVline*interval_size_y)*spreadFactor).attr( {		stroke: '#996600',		'stroke-width':1,		'opacity': 0.8	});
	var yline = paper.path("M " + x_grid + " " + y_begin + " l 0 " + (numVline*interval_size_y)*spreadFactor).attr( {		stroke: '#3399FF',		'stroke-width':1,		'opacity': 0.8	});
	if( pos == 0){
//now comment this out so the origin line won't be black
//		yline.attr( {		stroke: '#000000',		'stroke-width': 2,		'opacity': 0.8	});
	}
	
}


var y = y_offset + numVline*spreadFactor;

for (var i = 0; i <= numVline; i++) {
	var pos = i*interval_size_y + yposStart;
//	var y_grid = plotHeight - (y_offset + (y_off + pos) * spreadFactor);
	var y_grid = plotHeight - (y_offset + (y_off + pos) * spreadFactor);
	//var y_grid = y_offset;
	var x_begin =  x_offset + (x_off + xposStart) * spreadFactor*interval_size_x;
	//draw horizontal line
	var xline = //paper.path("M " + x_begin + " " + y_grid + " l " + (numHline*interval_size_x)*spreadFactor +" 0").attr( {		stroke: '#996600',		'stroke-width':1,		'opacity': 0.8	});
	paper.path("M " + x_begin + " " + y_grid + " l " + (numHline*interval_size_x)*spreadFactor +" 0").attr( {		stroke: '#3399FF',		'stroke-width':1,		'opacity': 0.8	});
	if(pos ==0){
//now comment this out so the origin line won't be black
//		xline.attr( {		stroke: '#000000',		'stroke-width': 2,		'opacity': 0.8	});
	}
}



//alert("hi");
//add offset for now
for(var i=0; i<numViruses; i++){
 x_coord[i] = x_off + x_coord[i];
 y_coord[i] = y_off + y_coord[i];	
}
circle = new Array(numViruses);
text = new Array(numViruses);


newVariationCircle = new Array(numViruses);
newVariationCircleIsTriggered = new Array(numViruses);
for(var i=0; i < numViruses; i++){
	newVariationCircleIsTriggered[i] = 0;
}


CI_pairwise = new Array(numViruses);
CI_pairwise_legend = new Array(numViruses);

//var cluster_membership = kMeansClustering(x_virus, y_virus, 7);
//var gradient = new Array("#FFFFFF","#E2E2FF","#C6C6FF","#AAAAFF","#8D8DFF","#7171FF","#5555FF","#3838FF","#1C1CFF","#0000FF");
//var gradient = new Array("#FFFFFF","#C2C2D6","#0000FF", "#33CC33", "#FF9900" , "#CC33FF", "000000");


for(var i=0; i< numViruses; i++){
  var xpos = x_offset +x_coord[i]*spreadFactor;
  var ypos =  plotHeight - y_offset - y_coord[i]*spreadFactor;

if(xpos > plotWidth){
	alert("xpos > width! error" + xpos);
}
if(ypos > plotHeight){
	alert("ypos > height! error" + xpos);
}
//var posStr = xpos + " " + ypos;
//alert(posStr);
  
  //this is by year color annotation
  //circle[i] = paper.circle(xpos, ypos, radius).attr({ stroke: '#3D6AA2', fill: gradient[gradientIndex], 'stroke-width': 2, title:i , "fill-opacity": opacityValue});
  
  //this is k means clustering
   //circle[i] = paper.circle(xpos, ypos, radius).attr({ stroke: '#3D6AA2', fill: gradient[cluster_membership[i]], 'stroke-width':radius*0.3, title:i , "fill-opacity":1});
   circle[i] = paper.circle(xpos, ypos, radius).attr({ stroke: '#3D6AA2', fill: '#FFFFFF', 'stroke-width':radius*0.3, title:i , "fill-opacity":1});   
}



//alert("k-means clustering with k=7");



for (var i = 0; i < numViruses; i++) {
	circle[i].click(function(){
		this.toFront();
//		this.attr({fill: '#FF0000'});
		//text.attr({text:dynamicText, x:280});
		//var text2 = paper.text(280, 280, "Clicked!").attr({			'font-size': 25,			fill: '#009933'		});
		//alert(this.attr('cx'));
		var objectID = Number(this.attr('title'));
		//alert(objectID);
		 if(text[objectID]==null){
		 	
				text[objectID] = paper.text(this.attr('cx') - 5, this.attr('cy') - 10, virusName[this.attr('title')]).attr({
					'font-size': 12,
					fill: '#003300',
					cursor: 'pointer'
				});
			
			//originally move start up functions declared here
            text[objectID].drag(move, start, up);
			//originally promptRename declared here
			text[objectID].dblclick(promptRename);

			}
			else{
		//		this.attr({fill: '#FFFFFF'})  //revert back to the original color
				text[objectID].hide();
				text[objectID] = null;
			}
			//alert(text2[this.attr('title')].status());
			//text2[this.attr('title')].show();
			
			//text2[this.attr('title')].hide();
			
	});
	
	circle[i].hover(function(){
		this.toFront();
		var objectID = Number(this.attr('title'));




		if(readDataType ==1){
			
			
			for(var curObject = 0; curObject < numViruses; curObject++){
			var pairwiseDistance = new Array(numSamples);
	  		 for(var k=0; k<numSamples; k++){	
	  		 	 pairwiseDistance[k] =  Math.sqrt( Math.pow( (Number(data[k+1][2 * objectID + 1]) - Number(data[k+1][2 * curObject + 1])), 2)     
	  		 	                                 + Math.pow( (Number(data[k+1][2 * objectID + 2]) - Number(data[k+1][2 * curObject + 2])), 2) );
					  		 	
	  		 }
 	    	var pivot_x = this.attr('cx');
	 	    var pivot_y = this.attr('cy'); 

			var pt_x = circle[curObject].attr('cx');
	 	    var pt_y = circle[curObject].attr('cy');

			var slope = (pt_y - pivot_y)/ (pt_x -pivot_x);
			//alert(slope);
			///  (Number(data[k+1][2 * objectID + 1]) - Number(data[k+1][2 * curObject + 1]))
			var change_x_0_1 = quantile(pairwiseDistance, 0.1)/ Math.sqrt(  1 + Math.pow(slope,2) ) ;
			var change_y_0_1 = quantile(pairwiseDistance, 0.1) / Math.sqrt(  1 + Math.pow(slope,2) ) *slope ;
			
			change_x_0_1 = change_x_0_1 * spreadFactor;
			change_y_0_1 = change_y_0_1 * spreadFactor;

			//needs to attach direction of change		
			if( pivot_x > pt_x){
				change_x_0_1 = -change_x_0_1;
				change_y_0_1 = - change_y_0_1; 
			}
			
			var change_x_0_9 = quantile(pairwiseDistance, 0.9)/ Math.sqrt(  1 + Math.pow(slope,2) ) ;
			var change_y_0_9 = quantile(pairwiseDistance, 0.9) / Math.sqrt(  1 + Math.pow(slope,2) ) *slope ;
			
			change_x_0_9 = change_x_0_9 * spreadFactor;
			change_y_0_9 = change_y_0_9 * spreadFactor;
		
			if( pivot_x > pt_x){
				change_x_0_9 = -change_x_0_9; 
				change_y_0_9 = - change_y_0_9;
			}
			
			
			
			var x_0_1 = pivot_x + change_x_0_1;
			var y_0_1 = pivot_y + change_y_0_1;
			//var x_0_1 = pivot_x;
			//var y_0_1 = pivot_y;
			
			var x_0_9 = pivot_x + change_x_0_9;
			var y_0_9 = pivot_y + change_y_0_9;
			
			var diff_x = x_0_9 - x_0_1;
			var diff_y = y_0_9 - y_0_1;
			//alert(change_x);
			//alert(change_y);
				
			
		 if( curObject != objectID){  //don't want to plot for the same virus...
			var curObject_fillColor = circle[curObject].attr('fill');
			if(curObject_fillColor == "#FFFFFF"){
				curObject_fillColor = "#000000";
			}
			
			var curObject_cx = circle[curObject].attr('cx');
			var curObject_cy = circle[curObject].attr('cy');
			//alert(curObject_fillColor);
			//var yline = paper.path("M " + curObject_cx + " " + curObject_cy + " l 0 " + quantile(pairwiseDistance,0.1)*spreadFactor).attr( {		stroke:curObject_fillColor,		'stroke-width':1,		'opacity': 0.8	});
			CI_pairwise[curObject] = paper.path("M " + x_0_1 + " " + y_0_1 + " l " + diff_x + " " + diff_y).attr( {		stroke:curObject_fillColor,		'stroke-width':5,		'opacity': 0.1	});
			var dist = Math.sqrt( Math.pow(((pt_y - pivot_y)/spreadFactor) ,2) + Math.pow( ((pt_x -pivot_x)/spreadFactor), 2) );
			var distStr =  dist.toPrecision(3) + " ["+ quantile(pairwiseDistance, 0.1).toPrecision(3) + ", " + quantile(pairwiseDistance, 0.9).toPrecision(3) + "]";
			
			if(isDisplayDistance){		
				CI_pairwise_legend[curObject] = paper.text(x_0_9, y_0_9,distStr ).attr({'font-size': 10,fill:'#000000', cursor: 'pointer'});
				CI_pairwise_legend[curObject].toFront();
			 }
			 
			}//curObject!=objectID

			//paper.path("M " + x_0_3 + " " + y_0_3 + " l " + diff_x_small + " " + diff_y_small).attr( {		stroke:curObject_fillColor,		'stroke-width':5,		'opacity': 0.1	});

//var yline = paper.path("M " + x_0_1 + " " + y_0_1 + " l " + 0 + " " + 100).attr( {		stroke:curObject_fillColor,		'stroke-width':1,		'opacity': 0.8	});
//var yline = paper.path("M " + x_0_9 + " " + y_0_9 + " l " + 0 + " " + 100).attr( {		stroke:curObject_fillColor,		'stroke-width':1,		'opacity': 0.8	});

	 	    //var curCircle_x = this.attr('cx');
	 	    //var curCircle_y = this.attr('cy'); 
//	 	  var centroid_x =   x_offset + (x_off+m_x)*spreadFactor;
 //		 var centroid_y =   plotHeight - y_offset - (y_off +m_y)*spreadFactor;
  	 	  
				 
			//alert( quantile(pairwiseDistance, 0.1)) ;
			//alert( quantile(pairwiseDistance, 0.9)) ;

			}//curObject iteration

		}
		
/*		
		if(newVariationCircleIsTriggered[objectID] == 0){
		//print the distribution of values..
		if(readDataType ==1){
			var x_data = new Array(numSamples);
			var y_data = new Array(numSamples);
		  	//Compute median
		  			  for(var k=0; k < numSamples; k++){
			x_data[k] = Number(data[k+1][2 * objectID + 1]);
			y_data[k] = Number(data[k+1][2 * objectID + 2]);
			}				
			var m_x, m_y, dist_80;
			 m_x = median(x_data);	
	  		 m_y = median(y_data);
	  		 var dist_from_median = new Array(numSamples);
	  		 for(var k=0; k<numSamples; k++){
	  		 	dist_from_median[k] = Math.sqrt(Math.pow( (x_data[k] -m_x) ,2)+Math.pow(( y_data[k]- m_y),2));
	  		 }
	  		 dist_80 = quantile(dist_from_median, .9);   	 
	 	  
	 	   var curCircle_x = this.attr('cx');
	 	   var curCircle_y = this.attr('cy'); 
//	 	  var centroid_x =   x_offset + (x_off+m_x)*spreadFactor;
 //		 var centroid_y =   plotHeight - y_offset - (y_off +m_y)*spreadFactor;
  	 	  
	 	   var curCircle_color = this.attr('fill');
	 	   var curStrokeWidth = 0;
	 	   if(curCircle_color == "#FFFFFF"){
	 	   	curStrokeWidth = 1;
	 	   }
	// 	  	var newVariationCircle = paper.circle(centroid_x, centroid_y, spreadFactor*dist_m).attr({ stroke: '#3D6AA2', fill: curCircle_color, 'stroke-width':curStrokeWidth, title:i , "fill-opacity":0.1});   
		newVariationCircle[objectID] = paper.circle(curCircle_x, curCircle_y, spreadFactor*dist_80).attr({ stroke: '#3D6AA2', fill: curCircle_color, 'stroke-width':curStrokeWidth, title:i , "fill-opacity":0.1});
	 	  	
	 	  newVariationCircle[objectID].toBack();
		  newVariationCircleIsTriggered[objectID] = 1;

	 	  } //readDataType
  		 //alert(dist_80); 

 		} //newVariationCirclesIsTriggered
	*/	
			
	},
	function(){
		
		
		var objectID = Number(this.attr('title'));
		for(var curObject=0; curObject < numViruses; curObject++){
		 if( curObject != objectID){  //don't want to plot for the same virus...

			CI_pairwise[curObject].hide();
			CI_pairwise[curObject] = null;
			if(isDisplayDistance){
				CI_pairwise_legend[curObject].hide();
				CI_pairwise_legend[curObject] = null;
			 }
			}//curObject!=objectID			
		}
		
		
		//var objectID = Number(this.attr('title'));
		 // newVariationCircle[objectID].hide();
		  //newVariationCircle[objectID] = null;
		  //newVariationCircleIsTriggered[objectID] = 0;	
	}
	);
	

}


   //draw grid labels
   //example of pointer label - now not used
   //paper.text(x_origin-12, y_origin+12, "0" ).attr({ 'font-size': 20, fill: '#000000', cursor: 'pointer' });
   
 //  paper.text(x_origin-spreadFactor*0.3, y_origin+spreadFactor*0.3, "0" ).attr({ 'font-size':Math.min(20,spreadFactor*0.5), fill: '#000000' });
   for (var i = 0; i <= numHline; i++) {
   	// x_pt_grid = x_offset + (x_off + i*interval_size_x)*spreadFactor; 
     //paper.text(x_pt_grid, y_origin+0.5*spreadFactor, i*interval_size_x +x_off ).attr({ 'font-size': spreadFactor*0.8, fill: '#000000' });
    var pos = i*interval_size_x + xposStart; //start from -1
    if (pos != 0) {
		var x_grid = x_offset + (x_off + pos) * spreadFactor;
//		paper.text(x_grid, y_origin + 0.5 * spreadFactor, i * interval_size_x + xposStart).attr({
//			'font-size': Math.min(20,spreadFactor * 0.5),
//			fill: '#000000'
//		});
	}
	 
   }
   	
//alert(y_max);

	var y_origin = plotHeight - (y_offset + y_off*spreadFactor);

  for (var i = 0; i <= numVline; i++) {
  	var pos = i*interval_size_y + yposStart; //start from -1
  	if (pos != 0) {
			 
		var y_grid =    plotHeight -  (y_offset + (y_off + pos) * spreadFactor);
		//var y_pt_grid = plotHeight - (y_offset + (y_off + i) * spreadFactor);
//		paper.text(x_origin - 0.5*spreadFactor, y_grid, i*interval_size_y+yposStart).attr({
//			'font-size': Math.min(20,spreadFactor*0.5),
//			fill: '#000000',
//		});
	}
   }

	
//comment out this experimental feature
/*
var divTextD = document.createElement('divText');
	divTextD.innerHTML="Select a specific virus strain for computing distance (first need to select an antiserum)<br>";
//	document.getElementById("distance_virus").appendChild(divTextD);
document.getElementById("distance_virus").appendChild(divTextD); // myDiv is the container to hold the select list

var newSelectD = document.createElement('select');
	newSelectD.id = "selectVirusD"; //add some attributes
	newSelectD.size = 10;
	newSelectD.onchange = selectPointD;  // call the somethingChanged function when a change is made
	for(var i=0; i < numViruses; i++){
		newSelectD[newSelectD.length] = new Option(virusName[i], i, false, false);
	}
	

	document.getElementById("distance_virus").appendChild(newSelectD); // myDiv is the container to hold the select list
	*/



/*
    var newDiv=document.createElement('div');
    var selectHTML = "";
    selectHTML="<select size=10>";
	//selectHTML+="<option>Select Item</option>"
    for(i=0; i<numViruses; i=i+1){
        selectHTML+= "<option value='"+i+"'>"+data[0][1+2*i]+"</option>";
    }
        selectHTML += "</select>";
    newDiv.innerHTML= selectHTML;
    document.getElementById("bar").appendChild(newDiv);
		*/

	
	var divText = document.createElement('divText');
	divText.innerHTML="Select a specific virus strain<br>";
	document.getElementById("bar").appendChild(divText);
	var newSelect = document.createElement("select");
	newSelect.id = "selectlistid"; //add some attributes
	newSelect.size = 20;
//	newSelect.onchange = somethingChanged;  // call the somethingChanged function when a change is made
	newSelect.onchange = selectPoint;
	//newSelect[newSelect.length] = new Option("One", "1", false, false); // add new option
	//newSelect[newSelect.length] = new Option("Two", "2", false, false); // add new option
	for(var i=0; i < numViruses; i++){
			newSelect[newSelect.length] = new Option(virusName[i], i, false, false);
	}
		
	document.getElementById("bar").appendChild(newSelect); // myDiv is the container to hold the select list
	



//MCMC runs:

if (readDataType == 1) {
	var divTextMCMC = document.createElement('divTextMCMC');
	divTextMCMC.innerHTML = "Select a specific MCMC sample <br>";
	document.getElementById("MCMC").appendChild(divTextMCMC);
	
	var MCMC_select = document.createElement("select");
	MCMC_select.id = "MCMC select"; //add some attributes
	MCMC_select.size = 10;
	
	
	//	newSelect.onchange = somethingChanged;  // call the somethingChanged function when a change is made
	MCMC_select.onchange = MCMCselectPoint;
	//MCMC_select[newSelect.length] = new Option("One", "1", false, false); // add new option
	//newSelect[newSelect.length] = new Option("Two", "2", false, false); // add new option
	for (var i = 1; i < data.length; i++) {
		if (readDataType == 1) {
			MCMC_select[MCMC_select.length] = new Option("#" + data[i][0], i, false, false);
		}
	}
	
	
	document.getElementById("MCMC").appendChild(MCMC_select); // myDiv is the container to hold the select list
}




//alert(findMax(y_coord));

//alert(Math.max(x_coord));

  //var text4 = paper.text(100, 150, dot_x).attr({ 'font-size': 12, fill: '#000000', cursor: 'pointer' });
//var text5 = paper.text(100, 190, dot_y).attr({ 'font-size': 12, fill: '#000000', cursor: 'pointer' });

  //take the median by default
  //MCMC_median();


//    var dot = paper.circle(dx + 60 + R, dy + 10, radius).attr({stroke: "none", fill: "#000", opacity: 0});
//    var circle = paper.circle(dot_x,dot_y, 10).attr({ fill: '#3D6AA2', stroke: '#000000', 'stroke-width': 8 });

	
	

/*
    // Change the fill color of the squire and display an alert when someone clicks on the text object.
    text.click(function(){
        color = Raphael.getColor();
        square.attr({ fill: color });
    });	

	circle.click(function(){
		text.attr({text:dynamicText, x:280});
		var text2 = paper.text(320, 270, data[0][3]).attr({'font-size':25});
	});
*/

//alert(x_virus);
 
// alert("Procrustes analysis");
  
 //(scale)
 
 
   
}

 window.onload = function() {
 	
 	
 	var abc = [1, 2.2, 3, 4, 5, 6, 7, 8,9];
 	
 	//	addViruses(myData, 1);
	//addSera(mySera); //why is it not loaded after addViruses?
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    fileInput.addEventListener('change', function(e) {
		
    // Put the rest of the demo code here.
 	var file = fileInput.files[0];
	//var textType = /text.*/;
	
//if (file.type.match(textType)) {
  var reader = new FileReader();
  reader.onload = function(e) {
	fileDisplayAreaLegend.innerText = "Showing the first 50000 characters of the virus coordinate file";
	var div = document.getElementById("fileDisplayArea");
	var input = document.createElement("textarea");
	//var button = document.createElement("button");
	input.name = "post";
	input.maxLength = "50000";
	input.cols = "50";
	input.rows = "5";
	input.value = reader.result;
	div.appendChild(input); //appendChild
	//div.appendChild(button);
	
//	addViruses(reader.result, 1);  //create the SVG, etc..
	addViruses(trimHeadAndBottom(reader.result), 1);  //create the SVG, etc..
	//addViruses(reader.result, 2);  //create the SVG, etc..
    //fileDisplayArea.innerText = reader.result;
	//	data = CSVToArray( reader.result , "\t");
	//alert("still ok");
  }

  reader.readAsText(file);  
//} else {
  //fileDisplayArea.innerText = "File not supported!";
//}	

	
	
   var svg = paper.toSVG();
   alert(svg);
	
	
		  
  });
	



	//serum fileInput
	var serum_fileInput = document.getElementById('serum_fileInput');
	serum_fileInput.addEventListener('change', function(e){
		var serum_file = serum_fileInput.files[0];
		//alert(serum_file);
		var serum_reader = new FileReader();
		serum_reader.onload = function(e){
			//var text2 = serum_reader.result;
			addSera(trimHeadAndBottom(serum_reader.result), 1);
		}
		serum_reader.readAsText(serum_file);
	});	



	//cluster color
	var cluster_fileInput = document.getElementById('cluster_fileInput');
	cluster_fileInput.addEventListener('change', function(e){
		var cluster_file = cluster_fileInput.files[0];
		var cluster_reader = new FileReader();
		cluster_reader.onload = function(e){
			add_cluster_color(cluster_reader.result);
		}
		cluster_reader.readAsText(cluster_file);
	});	





//Create SVG Image
document.getElementById("createImage").onclick = function() {
	//alert("Saving a SVG image to a new window."); //I added
var canvas_=document.getElementById("drawing_board");
var text = (new XMLSerializer()).serializeToString(canvas_);
//alert(text);
	
	//perform trimming to get rid of the <div ...> </div ..>
var n = text.search(">");
//alert(n);
	
var n2 = text.lastIndexOf("<");
// alert(n2);	
 
 var imageText = text.substring(n+1,n2);
   
    var encodedText = encodeURIComponent(imageText);
   // var encodedText = encodeURIComponent(text);
   open("data:image/svg+xml," + encodedText);   //THis doesn't work in Internet explorer..
//maybe this is the solution:
//http://stackoverflow.com/questions/15981394/save-svgin-div-to-png-or-convert-to-png-raphael-js
//OK, here's the update: Simply use the getElementsByTagName document.getElementsByTagName('svg')[0].id = 'id_something'; and set the svg tag with id something, then using canvg(canvas, svg); and var img_url = canvas.toDataURL('image/png'); you will get the png file you wanted. Am I doing the right way? Thanks, �  Kristina Apr 13 '13 at 10:04
   
   
   //check this out: http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side
   
   
      
//also see: http://stackoverflow.com/questions/2483919/how-to-save-svg-canvas-to-local-filesystem
	
	
	
//   var svg = paper.toSVG();
    //document.getElementById('bar').innerHTML = svg;
	
	/*
	//var elem = document.getElementById('drawing_board');
	//var imgData = elem.toDataURL("image/png");

	
	
    //Get the svg
    var svg = document.getElementById("drawing_board").innerHTML;

    //Create the canvas element
    var canvas = document.createElement('canvas');
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    //Load the canvas element with our svg
    canvg(document.getElementById('canvas'), svg);


    //Save the svg to png
    Canvas2Image.saveAsPNG(canvas);
	
	//This uses
	//http://techoctave.com/c7/posts/130-save-raphael-svg-chart-as-image

    //Clear the canvas
    canvas.width = canvas.width;
    
    */
    
};


document.getElementById("IE").onclick = function(){

//Create SVG Image
var canvas_=document.getElementById("drawing_board");
var text = (new XMLSerializer()).serializeToString(canvas_);
var n = text.search(">");
var n2 = text.lastIndexOf("<");
  var imageText = text.substring(n+1,n2); //perform trimming to get rid of the <div ...> </div ..>	
	
// document.getElementById("svgText").innerHTML=imageText;

 //document.getElementById("svgText").innerHTML='<input type="text"  name="TextBox" value=imageText >';
 document.getElementById("tbox").value = imageText;
 //newdiv.innerHTML = '<input type="text"  name="TextBox'+num+'" value="TextBox'+num+'" >';  
//var box = document.createElement("input");
//box.type = "text"; 
 
}

	
}





