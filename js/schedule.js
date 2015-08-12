(function($, self) {
	  var elementsInColumn = function(column) {
    var data = [];
    $(".js-schedule table tr").each(function(rowIndex) {
      $(this).find("td").each(function(cellIndex) {
          if (cellIndex == column)
            data.push($(this));
        });
    });

    return data;
  };

  var setCourseRows = function(element, from, to) {
    var column = element.parent().index();
    var $tr = element.closest('tr');
    var row = $tr.index();

    var tdInColumn = elementsInColumn(column);
    for (var i = 1; i != tdInColumn.length - 1; i++) {
      if (i > from && i < to)
        tdInColumn[i].css("display", "none");
      else
        tdInColumn[i].css("display", "table-cell");
    }
    console.log('from -> ' + from)
    console.log('to -> ' + to)

    var size = to - from
    console.log('rows -> ' + size)
    element.parent().attr('rowspan', size);
  };

  var dropInTd = function(event, ui) {
		var name = '';
		var id = ui.draggable.data('course');
		if (ui.draggable.hasClass('schedCourse')) {
			name = ui.draggable.find('.js-name').html();
			ui.draggable.remove();
		}
		else
			name = ui.draggable.find('input[type=text]').val()

		var course = $('<div class="js-course schedCourse" data-course="'+id+'"><b>'+'<div class="js-name">'+name+'</div>'+'</b><input type-"text" placeholder="What ?"><br><input type="text" placeholder="Where ?"><br></div>');
		
		course.draggable({ cursorAt: {top: 38, left: 75 }, revert: true });
		course.resizable({ grid: 61,  handles: 's', 
      stop: function(event, ui) {
        var row = ui.element.parent().parent().index();
        var rowTaken = Math.floor(ui.size.height / 61 + 0.99);
        setCourseRows(ui.element, row, row + rowTaken);
      }
    });

		$(this).html(course);
	};

	self.reset = function() {
		$('td.inner').html(''); // Find all tds and reset them
		$('.courses ul').html(''); // Find list and clean it
	};

	self.init = function() {
		$('td.inner').droppable({
			accept: '.js-course',
			activeClass: 'ui-state-active',
			hoverClass: 'ui-state-hover',
			drop: dropInTd
		});
	};
})(jQuery, this.Schedule = { });