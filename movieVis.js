//Global variable for all character data
var characterData;
var movieData;
var topStuff = document.getElementById("everything");
console.log(topStuff.offsetHeight);

var checkImage = new Image();

checkImage.onload = function() {

}
checkImage.src = 'checkMark.png';

//this object represents which filters are on and off... Originally they are all on
var filterSwitches = {all: true, female: false, male: false, white: false, black: false, latino: false, indian: false, asian: false}


//total svg margin
var margin = {top: 40, right: 60, bottom: 40, left: 40},
    width = 1400,
    height = 800;

//circles margin
var circlesMargin = {top: 30, right: 300, bottom: 30, left: 250}

//xScale setup
var xScale = d3.scaleLinear()
                .range([circlesMargin.left, width - circlesMargin.right]);

//yScale setup
var yScale = d3.scaleBand()
                .range([margin.top, height - margin.bottom]);

//roi bar scale setup
var roiScale = d3.scaleLinear() 
                    .range([10, circlesMargin.left - 100]);

d3.queue()
  .defer(d3.csv, "/data/CharacterData.csv")
  .defer(d3.json, "/data/movieData.json")
  .await(analyze);

function analyze(error, character, movie) {
    if(error) { 
        console.log(error); 
    }

    character.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.CHARACTER_WORDS = +d.CHARACTER_WORDS;
        d.TOTAL_MOVIE_WORDS = +d.TOTAL_MOVIE_WORDS;
        d.wordsPercent = (+d.CHARACTER_WORDS / +d.TOTAL_MOVIE_WORDS) * 100;
    });

    characterData = character;
    movieData = movie; 

    createChart();
}

/*
*   This is where the main chart is created
*/

function createChart() {
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("id", "mainChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //creates array wordCountPercent to set x scale domain
    var wordCountPercent = characterData.map(function(d) {
        return (d.CHARACTER_WORDS / d.TOTAL_MOVIE_WORDS) * 100;
    });
    
    //create array movieROI to set y scale domain
    var movieROI = movieData.map(function(d) {
        return d.value["roi"];
    });
    
    //assign ROI values to character data array
    characterData.forEach(function (d) {
        
        movieData.forEach(function(m) {
            if (m.key == d.MOVIE) {

                d.roi = m.value["roi"];
            }
         })
    });
    
    //x scale axis (word spoken percentage)
    xScale.domain([0, d3.max(wordCountPercent)]); 
    
    //y scale (total words for now until JSON is complete)
    yScale.domain(movieROI);

    //X axis
    var xAxis = d3.axisBottom();
    
    xAxis.scale(xScale);
    
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
    
    // ROI graph title
    var roiTitle = svg.append("text")
                    .attr("x", margin.left)
                    .attr("y", -15)
                    .attr("class", "graph-title")
                    .style("text-anchor", "end")
                    .text("ROI")
    // TODO: On click function shows info
    
    //Character data graph title
    var charTitle = svg.append("text")
                    .attr("x", function(d){
                        return width-650
                    })
                    .attr("y", -15)
                    .attr("class", "graph-title")
                    .style("text-anchor", "end")
                    .text("Character's Percent of Words Spoken in Film")
    
    //Filmmaker graph title
   var makerTitle = svg.append("text")
                    .attr("x", function(d){
                        return width-160
                    })
                    .attr("y", -15)
                    .attr("class", "graph-title")
                    .style("text-anchor", "end")
                    .text("Filmmakers")
    
    /*  These are the rows for each movie
    *
    */
   var backBars = svg.selectAll("rect").data(movieROI);
    
    backBars = backBars.enter()
                .append('rect')
                .merge(backBars);
    
    backBars.exit().remove();
    
    backBars
        .attr('x', 0)
        .attr('y', function (d) {
            return yScale(d) - 30;
        })
        .attr('width', width)
        .attr('height', function(d) {
            return (height - 50) / 10;
        })
        .attr('fill', function(d) {
            if(movieROI.indexOf(d) % 2 == 0) {
                return "#f8f8f8";
            } else {
                return "#fff";
            }
        });
    
    // x-axis
    svg.append("g")
        //.attr("class", "x axis")
        .attr("transform", "translate(0," + 720 + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 35)
        .style("text-anchor", "end")
        .text("% of Words Spoken");
    
    roiScale.domain([d3.min(movieROI), d3.max(movieROI)]);
    
    var movieTitleTexts = svg.selectAll(".text")
	  .data(movieData)
	  .enter()
	  .append("text")
	  .text(function(d) {
		return d.key;
	  })
	  .attr("text-anchor", "right")
	  .attr("x", function(d, i) {
		return 0;
	  })
	  .attr("y", function(d, i) {
		return yScale(d.value["roi"]) - 10;
	  })
	  .attr("font-family", "sans-serif")
	  .attr("font-size", "11px")
	  .attr("fill", "black");

    var rect2 = svg.selectAll('.rect2')
	    .data(movieData);
    
    rect2 = rect2
	    .enter()
        .append("rect")
        .merge(rect2);
    
    rect2.exit().remove();
    
    rect2
        .attr('class', 'rect2')
        .attr("x", function(d, i) {
          return 0;
        })
        .attr("y", function(d, i) {
          return yScale(d.value["roi"]);
        })
        .attr("width", function(d) {
            return roiScale(d.value["roi"]);
        })
        .attr("height", function(d) {
          return 20;
        });
    
    /*TEXT
    *
    */
    var roiText = svg.selectAll(".roiText")
        .data(movieData)
        .enter()
        .append("text")
        //.attr("class", "ro")
        .text(function(d) {
          return d.value["roi"]/100 + ' x';
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
          return roiScale(d.value["roi"]) + 15;
        })
        .attr("y", function(d, i) {
          return yScale(d.value["roi"]) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");
    
	var images = svg.selectAll('image')
	  .data(movieData)
	  .enter()
	  .append("svg:image")
	  .attr('xlink:href', function(d, i) {
		return 'posters/' + i + '.jpg';
	  })
	  .attr("x", function(d, i) {
		return circlesMargin.left - 60;
	  })
	  .attr("y", function(d, i) {
		// return i * 100;
		return yScale(d.value["roi"]) - 30;
	  })
	  .attr("width", function(d) {
		return 50;
	  })
	  .attr("height", function(d) {
		return 60;
	  });
    
    updateChart();
}

function switchButton(button) {
    console.log(button + " button was pressed :" + filterSwitches[button]);
    
    var trueFilters = [];
    
    //If All button is pressed
    if (button == "all") {
        
        //if all button is on
        if(filterSwitches[button]) {
            //All is true turn it off
            document.getElementById(button).style.backgroundColor = "#eee";
            
            filterSwitches[button] = false;
            clearChart();
            
        } else {
         
            //clear the rest of the buttons
            var buttons = document.getElementsByClassName("filterButton");
            
            //turn off the rest of the buttons
            for(var i = 0; i < buttons.length; i++) {
                buttons[i].style.backgroundColor = "#eee";
            }   
            
            //make all other filters false
            for (var key in filterSwitches) {
                if(!filterSwitches.hasOwnProperty(key)) continue;

                if(filterSwitches[key]) {
                    filterSwitches[key] = false;
                }

            }
            
            //turn all filter to true
            filterSwitches[button] = true;
            
            //turn on 'all' button
            document.getElementById(button).style.backgroundColor = "gray";
            
            //clear and update chart
            clearChart();
            updateChart();
        }
                
    } else {
        //Another Button is pressed
        if(filterSwitches.all == true) {
            //All is on. turn it off
            
            //console.log("helloooooo");
            document.getElementById("all").style.backgroundColor = "#eee";
            
            filterSwitches.all = false;
        }
        
        //Turn on the pressed button
        if(filterSwitches[button]) {
            //if button is on, turn it off
            document.getElementById(button).style.backgroundColor = "#eee";
            
            filterSwitches[button] = false;
            
            clearChart();
            updateChart();
            
        } else {
            //button is off
            document.getElementById(button).style.backgroundColor = "gray";
            
            filterSwitches[button] = true;
            
            clearChart();
            updateChart();
        }
        
    }
}

/*Function to update the chart based on which filter was clicked
*   filter: string of which filter was passed in

function filterFunction(filter) {
     
    //this array holds the selected filters
    var selectedFilters = []
    
    

    if(filter == "all") {
        
        //All is clicked
        
        
        //turn other buttons off; turn all on
        
        clearChart();
        updateChart(selecterFilters)
        
    } else {  
        
       // .attr("transform", "translate(0," + (height - 50) + ")")
        
        //turn off all button
        
                
        //Check whether this switch is on or off.
        if(filterSwitches[filter]) {
            //if this filter is true (on), turn it off
            filterSwitches[filter] = false;
        } else {
            //turn this switch on
            filterSwitches[filter] = true;
        }

        //iterate through object to return true
        for (var key in filterSwitches) {
            /*if(!filterSwitches.hasOwnProperty(key)) continue;

            if(filterSwitches[key]) {
                //trueFilters.push(key);
            }

        }
        
        clearChart();
        updateChart(filterSwitches);  
        
    }

        console.log(filter + " is now " + filterSwitches[filter]);
        //console.log("true keys " + trueFilters);
        //Now update the chart to reflect the changes 
       // updateChart(filter);
        
}
*/

/*
*   Update chart
*/
function updateChart(selectedFilter) {
    
    /*CHARACTER CIRCLES
    *   circles: represent each character
    */
    
    var mainChart = d3.select("#mainChart");
        
    var circles = mainChart.selectAll(".characterCircle").data(characterData);
    
    circles = circles.enter()
                .append('circle')
                .merge(circles);
    
    circles.exit().remove();
    
    circles
        .filter(function(d) {
            if(filterSwitches.all == true) {
                //place all data
                return d;
            } else {
                
                for (var key in filterSwitches) {
                    if(!filterSwitches.hasOwnProperty(key)) continue;
                    
                    if(filterSwitches[key]) {
                        //for the true filter keys, return data
                        if(d.GENDER == key || d.RACE == key) {
                            
                            /*if(filterSwitches.female == true && filterSwitches[d.RACE])
                             */   
                                return d;
                            
                        }
                    }

                }
            }
        })
        //.transition()
        .attr("class", "characterCircles")
        .attr("transform",  "translate(40,40)")
        .attr('cx', function(d) {  
            d.x = xScale(d.wordsPercent);
            return xScale(d.wordsPercent);
        })
        .attr('cy', function(d) { 
            d.y = yScale(d.roi);
            return yScale(d.roi);
        })
        .attr('r', function(d) {
            return 5;
        })
        .attr('fill', function(d){
            if (d.GENDER == "male"){
                return "white"
            }
            else if (d.RACE == "white"){
                return "#bbccee"
            } else if (d.RACE == "black"){
                return "#332288"
            } else if (d.RACE == "asian"){
                return "#882255"
            } else if (d.RACE == "indian"){
                return "#ddcc77"
            } else if (d.RACE == "latino"){
                return "#44AA99"
            } else if (d.RACE == "nonhuman"){
                return "#aaa"
            } 
        })
     /*   .attr('fill-opacity', function(d) {
            //eventually this will need to go into filters
            if(d.GENDER == "male") {
                return 0;
            } else if (d.GENDER == "female") {
                return 1;
            }
        })*/
        .attr('stroke', function(d){
            if (d.RACE == "white"){
                return "#bbccee"
            } else if (d.RACE == "black"){
                return "#332288"
            } else if (d.RACE == "asian"){
                return "#882255"
            } else if (d.RACE == "indian"){
                return "#ddcc77"
            } else if (d.RACE == "latino"){
                return "#44AA99"
            } else {
                return "#aaa"
            }
        })
        .attr('stroke-width', 3)
        .on('mouseover', function(d) {
            //Will need to display the hover information
              console.log(d.NAME + " - "+ d.MOVIE);
            
            //GET COORDINATES of mouse
            var coordinates = [0,0];
            coordinates = d3.mouse(this);
            var x = coordinates[0];
            var y = coordinates[1];
        
            console.log(d.x, d.y);
            //console.log(mainChart.x, mainChart.y);  
        
            //SET VALUES in tooltip from d
            $('#tooltip .char').text(d.NAME); //title
            $('#tooltip .movie').text(d.MOVIE); //movie
            $('#tooltip .total-words').text("Words Spoken: " + d.CHARACTER_WORDS); //words spoken
            //if statement to show "< 1%" if calculation rounds to 0
            var percent = (Math.round((d.CHARACTER_WORDS/d.TOTAL_MOVIE_WORDS)*100));
            if (percent === 0){
                percent = "<1";
            }else{
                percent = percent;
            };
            $('#tooltip .percent').text("Percent of Total Movie Words: " + percent + "%"); //percent words spoken
            $('#tooltip .gender').text(d.GENDER); //gender
            $('#tooltip .race').text(d.RACE);
            $('#tooltip .orientation').text(d.SEXUAL_ORIENTATION);
            
            //SHOW TOOL TIP
            //set x and y

            $("#tooltip").css("left", d.x + 'px');
            $("#tooltip").css("top", d.y + topStuff.offsetHeight - 80 +'px');
            $("#tooltip").fadeIn(200); 
        })
    
        .on('mouseout', function(d) {
            //Will need to clear the hover information
            $('#tooltip .char').empty();
            $('#tooltip .movie').empty();
            $('#tooltip .total-words').empty();
            $('#tooltip .percent').empty();
            $('#tooltip .gender').empty(); 
            $('#tooltip .race').empty();
            $('#tooltip .orientation').empty();
            //hide tool tip
            document.getElementById("tooltip").style.display = 'none';
        });
    
    /*
    *   These squares represent filmmakers (Producers, directors, writers)
    */
    
    //Array to hold all filmmakers from all movies
    var filmMakersArray = [];
    
    //Open movie data, add each filmmaker to the array with the movie's ROI
    movieData.forEach(function(d) {
        d.value["filmMakers"].forEach(function(m) { 
            //Each item in filmMakersArray will be a 2-item array 0: person 1: roi
            filmMakersArray.push([m, d.value["roi"]]);
        })
    });
    
    var squares = mainChart.selectAll(".filmMakers").data(filmMakersArray);
    
    squares = squares.enter()
                .append('rect')
                .merge(squares);
    
    squares.exit().remove();
    
    squares
        .attr('x', function(d, i) {
            //There may need to be a scale for this
            return (width - 250) + (i%7)*25;
        })
        .attr('y', function(d, i) {
            //scale ROI
            return yScale(d[1]); 
        })
        .attr("transform",  "translate(40,40)")
        .attr('width', function(d) {
            return 12;  
        })
        .attr('height', function(d) {
            return 12;
        
        })
        .attr('fill', function(d){
            if (d[0].gender == "male"){
                return "white"
            }
            else if (d[0].race == "white"){
                return "#bbccee"
            } else if (d[0].race == "black"){
                return "#332288"
            } else if (d[0].race == "asian"){
                return "#882255"
            } else if (d[0].race == "indian"){
                return "#ddcc77"
            } else if (d[0].race == "latino"){
                return "#44AA99"
            } else if (d[0].race == "nonhuman"){
                return "#aaa"
            } 
        })
        .attr('stroke', function(d){
            if (d[0].race == "white"){
                return "#bbccee"
            } else if (d[0].race == "black"){
                return "#332288"
            } else if (d[0].race == "asian"){
                return "#882255"
            } else if (d[0].race == "indian"){
                return "#ddcc77"
            } else if (d[0].race == "latino"){
                return "#44AA99"
            } else {
                return "#bbb"
            }
        })
        .attr('stroke-width', 2)
        .on('mouseover', function(d) {
            //Will need to display the hover information
              console.log(d[0].name + " - " + d[0].role);
            
            //GET COORDINATES of mouse
            var coordinates = [0,0];
            coordinates = d3.mouse(this);
            var x = coordinates[0];
            var y = coordinates[1];
               
            //SET VALUES in tooltip from d
            $('#tooltip .char').text(d[0].name); //title
            $('#tooltip .percent').text(d[0].gender); //change to gender 
            $('#tooltip .total-words').text("Role: " + d[0].role); //change to role
            $('#tooltip .gender').text(d[0].race); //change to race
            
            //SHOW TOOL TIP
            //set x and y

            $("#tooltip").css("left", x - 105 +'px');
            $("#tooltip").css("top", y + 120 +'px');
            $("#tooltip").fadeIn(200); 
        })
    
        .on('mouseout', function(d) {
            //Will need to clear the hover information
            $('#tooltip .char').empty();
            $('#tooltip .percent').empty();
            $('#tooltip .total-words').empty();
            $('#tooltip .gender').empty(); 
            $('#tooltip .race').empty();
            //hide tool tip
            document.getElementById("tooltip").style.display = 'none';
        });
    
}

function clearChart() {
    d3.selectAll(".characterCircles").remove();
}


/*      
  // draw legend
  var legend = svg.selectAll(".legend")
      .data()
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
*/


