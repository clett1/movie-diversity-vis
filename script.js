$('#test-button').click(function () {
    $(this).toggleClass('blue');
});

var $doc = $(document),
    $head = $('#beige-head'),
    $nose = $('#nose-shape'),
    y = $doc.scrollTop(),
    color1 = 0,
    color2 = 0;

$doc.on('scroll', function () {
    y = $doc.scrollTop();
    color1 = y / 2;
    color2 = color1 + 180;
    $head.css('fill', 'hsla(' + color1 + ', 85%, 75%, 1)');
    $nose.css('fill', 'hsla(' + color1 + ', 55%, 75%, 1)');
});


$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});