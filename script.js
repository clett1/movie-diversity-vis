$('#test-button').click(function () {
    $(this).toggleClass('blue');
});

var $doc = $(document),
    $head = $('#beige-head'),
    $nose = $('#nose-shape'),
    y = $doc.scrollTop(),
    color1 = 0,
    color2 = 0;

$doc.on('scroll', function(){
  console.log("hi");
  y = $doc.scrollTop();
  color1 = y/2;
  color2 = color1 + 180;
  $head.css('fill', 'hsla(' + color1 + ', 85%, 75%, 1)');
  $nose.css('fill', 'hsla(' + color1 + ', 55%, 75%, 1)');
});
