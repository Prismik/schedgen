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
  var course = $('<li><div class="js-course course' +
    ' ui-widget-content" data-course="'+ no +'">' +
    '<input type="text" placeholder="Title"><br/><input type="color" id="myColor"></div></li>');
  course.find('.js-course').draggable({ cursorAt: {top: 33, left: 75 } , revert: true });
  course.find('input[type=text]').keyup(function() {
    $('.schedCourse[data-course="' + no + '"]').find('.js-name').html($(this).val());
  });
  course.find('input[type=color]').change(function() {
    course.find('.js-course').css('background-color', $(this).val());
    $('.schedCourse[data-course="' + no + '"]').css('background-color', $(this).val());
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
