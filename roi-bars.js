//Width and height
var w = 500;
var h = 1000;
var barPadding = 1;

var ROIdata;

d3.json("data/movieData.json", function (error, json) {

  json.forEach(function (d) {
	console.log(d);
	// Convert numeric values to 'numbers'
	d.movies = d.key;
	d.budget = +d.value.budget;
	d.GlobalBoxOffice = +d.value.profit;
	d.roi = +d.value.roi;

  });

  // Store csv data in a global variable
  ROIdata = json;

  updateChart(ROIdata);
});

function updateChart(data) {
  //Create SVG element
  var svg = d3.select("body")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

  // 
  //

  var rect1 = svg.selectAll('.rect1')
	.data(data)
	.enter()
	.append("rect")
	//
	.attr('class', 'rect1')
	.attr("x", function(d, i) {
	  return 10;
	})
	//
	.attr("y", function(d, i) {
	  return i * 80;
	})
	//
	.attr("width", function(d) {
	  return 400 / d.roi;
	})
	//
	.attr("height", function(d) {
	  return 20;
	})
	//
	.attr("fill", function(d) {
	  return "black";
	});


  var rect2 = svg.selectAll(".rect")
	.data(data)
	.enter()
	.append("rect")
	//
	.attr('class', 'rect')
	.attr("x", function(d, i) {
	  return 10;
	})
	//
	.attr("y", function(d, i) {
	  return 30 + i * 80;
	})
	//
	.attr("width", 400)
	//
	.attr("height", function(d) {
	  return 20;
	})
	//
	.attr("fill", function(d) {
	  return "green";
	});

  //
  svg.selectAll("text")
	.data(data)
	.enter()
	.append("text")
	.text(function(d) {
	  return d.roi + 'x';
	})
	//
	.attr("text-anchor", "middle")
	//
	.attr("x", function(d, i) {
	  return 390;
	})
	//
	.attr("y", function(d, i) {
	  return 30 + i * 80 + 15;
	})
	//
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "white");

  var images = svg.selectAll('image')
	.data(data)
	.enter()
	.append("svg:image")
	//
	.attr('xlink:href', function(d, i) {
	  return 'posters/' + i + '.jpg';
	})
	.attr("x", function(d, i) {
	  return 430;
	})
	//
	.attr("y", function(d, i) {
	  return i * 80;
	})
	//
	.attr("width", function(d) {
	  return 50;
	})
	//
	.attr("height", function(d) {
	  return 80;
	})
	//


}
