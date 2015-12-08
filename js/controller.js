Schedule.init();
var i = 0;
var dropInTrash = function(event, ui) {
  if (ui.draggable.hasClass('schedCourse'))
    ui.draggable.remove();
  else {
    $('.schedCourse[data-course="' + ui.draggable.data('course') + '"]').remove();
    ui.draggable.parent().remove();
  }  

  Schedule.refresh();
};

var addCourse = function() {
  var no = i++;
  var picker = ColorPickerFactory.create(['#ABC', '#111', '#AE2567', '#A21A21', '#DD55AA', '#EEAA22'],
    function(color) {
      course.find('.js-course').css('background-color', color);
      $('.schedCourse[data-course="' + no + '"]').css('background-color', color); 
    });

  var course = $('<li><div class="js-course course' +
    ' ui-widget-content" data-course="'+ no +'">' +
    '<input type="text" placeholder="Title"><br/><button class="myColor">Color</button></li>');
  
  course.find('.js-course').draggable({ cursorAt: {top: 33, left: 75 } , revert: true });
  picker.bindTo(course);

  // Listen to name changes
  course.find('input[type=text]').keyup(function() {
    $('.schedCourse[data-course="' + no + '"]').find('.js-name').html($(this).val());
  });
  
  // Listen to color changes
  var colorBtn = course.find('.myColor');
  colorBtn.click(function() {
    picker.show('n-w', 'ease-in');
  });

  $('.courses ul').append(course);
};

$('.trash').droppable({
  accept: '.js-course',
  activeClass: 'ui-state-active',
  hoverClass: 'ui-state-hover',
  drop: dropInTrash
});
$('#addCourse').click(addCourse);
$('#clear').click(Schedule.reset);
