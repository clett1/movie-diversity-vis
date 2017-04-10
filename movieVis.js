//Global variable for all character data
var characterData;

d3.csv("data/CharacterData.csv", function (data) {
    
    data.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.CHARACTER_WORDS = +d.CHARACTER_WORDS;
        d.TOTAL_MOVIE_WORDS = +d.TOTAL_MOVIE_WORDS;
    });

    // Store csv data in a global variable
    characterData = data;
   
    console.log(characterData);
    
});

