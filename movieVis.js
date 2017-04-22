//Global variable for all character data
var characterData;
var movieData;

var margin = {top: 20, right: 60, bottom: 30, left: 40},
    width = 1200,
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

/*
*   This is where the main chart is created
*/
function createChart() {

    
    var wordCountPercent = characterData.map(function(d) {
        return (d.CHARACTER_WORDS / d.TOTAL_MOVIE_WORDS) * 100;
    });
    
    var totalWords = characterData.map(function(d) {
        return d.TOTAL_MOVIE_WORDS;
    })
    
    //x scale axis (word spoken percentage)
    xScale.domain([0, d3.max(wordCountPercent)]); 
    //y scale (total words for now until JSON is complete)
    yScale.domain(totalWords);
    
    //X axis
    var xAxis = d3.axisBottom();
    
    xAxis.scale(xScale);
    
    /*
    //Y axis can be completed with JSON data is complete
    var yAxis = d3.svg.axisLeft(yScale);
    */
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
     // x-axis
    svg.append("g")
        //.attr("class", "x axis")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(xAxis)
        .append("text")
        //.attr("class", "label")
        .attr("x", 50)
        .attr("y", 50)
        .style("text-anchor", "end")
        .text("% of Words Spoken");
/*
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
    
    /*Create the circles for the graph
    *   We may need some filters for this for color
    *
    */
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
            //eventually this will need to go into filters
            if(d.GENDER == "male") {
                return "blue";
            } else if (d.GENDER == "female") {
                return "red";
            }
        })
        .on('mouseover', function(d) {
            //Will need to display the hover information
              console.log(d.NAME + " - "+ d.MOVIE);     
        })
        .on('mouseout', function(d) {
            //Will need to clear the hover information
        });
    
}




/*      
  // draw legend
  var legend = svg.selectAll(".legend")
      .data()
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
*/


