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

  // Create a picker and pass it a colorDidChange handler
  var picker = ColorPickerFactory.create(['#ABC', '#D1F486', '#FF5F69', '#B0A3FF', '#DD55AA', '#00CFDE'],
    function(color) {
      course.find('.js-course').css('background-color', color);
      $('.schedCourse[data-course="' + no + '"]').css('background-color', color); 
    });

  var course = $('<li><div class="js-course course' +
    ' ui-widget-content" data-course="'+ no +'">' +
    '<input type="text" placeholder="Title"><br/><button class="myColor">Color</button></li>');
  
  // We don't want the picker shown during a drag
  course.find('.js-course').draggable({ drag: function() {
      picker.hide();
    }, 
    cursorAt: {top: 33, left: 75 } , revert: true });
  picker.bindTo(course);

  // Listen to name changes
  course.find('input[type=text]').keyup(function() {
    $('.schedCourse[data-course="' + no + '"]').find('.js-name').html($(this).val());
  });
  
  // Listen to color button press
  var colorBtn = course.find('.myColor');
  colorBtn.get(0).addEventListener('click', function(event) {
    picker.show('n-w', 'ease-in');
  }, true);

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
