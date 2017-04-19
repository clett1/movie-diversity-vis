//Global variable for all character data
var characterData;
var movieData;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960,
    height = 500;

//xScale setup
var xScale = d3.scaleLinear()
                .range([margin.left, width - margin.right]);

//yScale setup
var yScale = d3.scaleBand()
                .range([margin.top, height - margin.bottom]);

d3.json('data/movieData.json', function(error, data) {
    movieData = data;
    //createMovieData();
})

console.log(movieData);

//Read in data from CharacterData
d3.csv("data/CharacterData.csv", function (data) {
    
    data.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.CHARACTER_WORDS = +d.CHARACTER_WORDS;
        d.TOTAL_MOVIE_WORDS = +d.TOTAL_MOVIE_WORDS;
        d.wordsPercent = (+d.CHARACTER_WORDS / +d.TOTAL_MOVIE_WORDS) * 100;
    });

    // Store csv data in a global variable
    characterData = data;
    
    createChart();
});

function createMovieData() {
    
    var roiArray = movieData.map(function(d) {
        return d.value["roi"];
    });
    
    //y scale (sorted by ROI)       
    yScale.domain(roiArray);
}


function createChart() {

    var wordCountPercent = characterData.map(function(d) {
        return (d.CHARACTER_WORDS / d.TOTAL_MOVIE_WORDS) * 100;
    });
    
    var totalWords = characterData.map(function(d) {
        return d.TOTAL_MOVIE_WORDS;
    })
    
    //x scale axis (word spoken percentage)
    xScale.domain([0, d3.max(wordCountPercent)]); 
    
    yScale.domain(totalWords);
    /*
    //X axis
    var xAxis = d3.svg.axisBottom(xScale);

    //Y axis
    var yAxis = d3.svg.axisLeft(yScale);
    */
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /*
     // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("% of Words Spoken");

  // y-axis
  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
      . text("Movie");
    */
    
    //Create the circles for the graph
    var circles = svg.selectAll("circle").data(characterData);
    
    circles = circles.enter()
                .append('circle')
                .merge(circles);
    
    circles.exit().remove();
    
    circles
        .attr('cx', function(d) {            
            return xScale(d.wordsPercent);
            
        })
        .attr('cy', function(d) {
            console.log(d.TOTAL_MOVIE_WORDS);
            return yScale(d.TOTAL_MOVIE_WORDS);
        })
        .attr('r', function(d) {
            return 3.5;
        })
        .attr('fill', function(d) {
            return "black";
        });
    
}

/*      
  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

*/


