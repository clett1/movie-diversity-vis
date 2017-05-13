//Global variable for all character data
var characterData;
var movieData;
var topStuff = document.getElementById("everything");
console.log(topStuff.offsetHeight);

var raceArray = ["white", "black", "indian", "asian", "latino"];

var checkImage = new Image();

checkImage.onload = function() {

}
checkImage.src = 'checkMark.png';

//this object represents which filters are on and off... Originally they are all on
var filterSwitches = {female: true, male: true, white: true, black: true, latino: true, indian: true, asian: true}


//total svg margin
var margin = {top: 40, right: 60, bottom: 40, left: 40},
    width = 1200,
    height = 650;

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
    
    
    // ROI graph title
    var roiTitle = svg.append("text")
                    .attr("x", margin.left - 40)
                    .attr("y", -10)
                    .attr("class", "graph-title")
                    //.style("text-anchor", "end")
                    .text("Return on Investment")
    // TODO: On click function shows info
    
    //Character data graph title
    var charTitle = svg.append("text")
                    .attr("x", function(d){
                        return margin.left + circlesMargin.left - 40;
                    })
                    .attr("y", -10)
                    .attr("class", "graph-title")
                    //.style("text-anchor", "end")
                    .text("Character's Percent of Words Spoken in Film")
    
    //Filmmaker graph title
   var makerTitle = svg.append("text")
                    .attr("x", function(d){
                        return width-180;
                    })
                    .attr("y", -10)
                    .attr("class", "graph-title")
                    .style("text-anchor", "end")
                    .text("Filmmakers");
    
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
        .attr("transform", "translate(0,575)")
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
          return d.value["roi"]/100 + 'x';
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
          return roiScale(d.value["roi"]) + 20;
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
		return 45;
	  })
	  .attr("height", function(d) {
		return 55;
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
            document.getElementById(button).style.backgroundColor = "#fff";
            
            filterSwitches[button] = false;
            clearChart();
            
        } else {
         
            //clear the rest of the buttons
            var buttons = document.getElementsByClassName("filterButton");
            
            //turn off the rest of the buttons
            for(var i = 0; i < buttons.length; i++) {
                buttons[i].style.backgroundColor = "#fff";
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
            document.getElementById(button).style.backgroundColor = "#333";
            
            //clear and update chart
            clearChart();
            updateChart();
        }
                
    } else {
        //Another Button is pressed
        if(filterSwitches.all == true) {
            //All is on. turn it off
            
            //console.log("helloooooo");
            document.getElementById("all").style.backgroundColor = "#fff";
            
            filterSwitches.all = false;
        }
        
        //Turn on the pressed button
        if(filterSwitches[button]) {
            //if button is on, turn it off
            document.getElementById(button).style.backgroundColor = "#fff";
            
            filterSwitches[button] = false;
            
            clearChart();
            updateChart();
            
        } else {
            //button is off
            document.getElementById(button).style.backgroundColor = "#333";
            
            filterSwitches[button] = true;
            
            clearChart();
            updateChart();
        }
        
    }
}

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
           if (filterSwitches.female == true || filterSwitches.male == true){
                //male or female or both selected
                
                /*
                *  This block of code iterates through an array of races in the chart
                *  If a race filter is on, only return characters fitting race AND gender 
                *  If NO race filters are on, return only matched genders
                */
                var trueRaces = 0;
                //check and see if any races are checked
                for(var i = 0; i < raceArray.length; i++) {
                    
                    if (filterSwitches[raceArray[i]]) {
                        //if this race filter is on
                        trueRaces++;    //add to the true races
                    }
                    
                }
                
                if(trueRaces == 0) {
                    if(filterSwitches[d.GENDER]) {
                        return d;
                    }
                } else {
                    if(filterSwitches[d.GENDER] && filterSwitches[d.RACE]) {
                        return d;
                    }
                }
                
            } else if (!filterSwitches.female && !filterSwitches.male) {
                //neither male or female are selected
                if(filterSwitches[d.RACE]) {
                    //return everything with the correct race
                    return d;
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

            $("#tooltip").css("left", d.x + margin.left + 'px');
            $("#tooltip").css("top", d.y + topStuff.offsetHeight - 95 +'px');
            $("#tooltip").fadeIn(100); 
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
        d.value["filmMakers"].forEach(function(m, i) { 
            //Each item in filmMakersArray will be a 2-item array 0: person 1: roi
            filmMakersArray.push([m, d.value["roi"], i]);
        })
    });
    
    var squares = mainChart.selectAll(".filmMakers").data(filmMakersArray);
    
    squares = squares.enter()
                .append('rect')
                .merge(squares);
    
    squares.exit().remove();
    
    squares
        .filter(function(d) {
            if (filterSwitches.female == true || filterSwitches.male == true){
                //male or female or both selected
                
                /*
                *  This block of code iterates through an array of races in the chart
                *  If a race filter is on, only return characters fitting race AND gender 
                *  If NO race filters are on, return only matched genders
                */
                var trueRaces = 0;
                //check and see if any races are checked
                for(var i = 0; i < raceArray.length; i++) {
                    
                    if (filterSwitches[raceArray[i]]) {
                        //if this race filter is on
                        trueRaces++;    //add to the true races
                    }
                    
                }
                
                if(trueRaces == 0) {
                    if(filterSwitches[d[0].gender]) {
                        return d;
                    }
                } else {
                    if(filterSwitches[d[0].gender] && filterSwitches[d[0].race]) {
                        return d;
                    }
                }
                
            } else if (!filterSwitches.female && !filterSwitches.male) {
                //neither male or female are selected
                if(filterSwitches[d[0].race]) {
                    //return everything with the correct race
                    return d;
                }
            }
        })
        .attr('class', "filmMakers")
        .attr('x', function(d, i) {
            //There may need to be a scale for this
            d.x = (width - 250) + (d[2])*25;
            return (width - 250) + (d[2])*25;
        })
        .attr('y', function(d, i) {
            //scale ROI
            d.y = yScale(d[1]) + 40;
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

            $("#tooltip").css("left", d.x +'px');
            $("#tooltip").css("top", d.y + 105 +'px');
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
    d3.selectAll(".filmMakers").remove();
}


/*      
  // draw legend
  var legend = svg.selectAll(".legend")
      .data()
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
*/


