(function($, self) {
  self.active = null;

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

  // TODO Refactor
  var elementsInColumnWithCourse = function(column) {
    var data = [];
    $(".js-schedule table tr").each(function(rowIndex) {
      $(this).find("td").each(function(cellIndex) {
          if (cellIndex == column && $(this).children().length > 0)
            data.push($(this));
        });
    });

    return data;
  };

  var cellLocation = function(element) {
    var column = element.index();
    var $tr = element.closest('tr');
    var row = $tr.index();

    return { x: column, y: row };
  };

  var refreshColumn = function(column) {
    var tdInColumn = elementsInColumn(column);
    var rowTaken = 0;
    var skip = 0;
    for (var i = 1; i != tdInColumn.length; i++) {
      if (--skip <= 0) {
        var rowspan = tdInColumn[i].attr('rowspan');
        rowTaken = typeof rowspan === 'undefined' || isNaN(rowspan) ? 0 : rowspan;
        if (tdInColumn[i].children().length != 0 && rowTaken != 0) {
          tdInColumn[i].css("display", "table-cell");
          tdInColumn[i].attr('rowspan', rowspan);
          skip = rowTaken;
        }
        else {
          tdInColumn[i].css("display", "table-cell");
          tdInColumn[i].attr('rowspan', 1);
        }
      }
      else
        tdInColumn[i].css("display", "none");
    }
  }

  var setCourseRows = function(element, from, to) {
    if (self.active != null) {
      var fromLocation = cellLocation(self.active);
    }

    var toLocation = cellLocation(element);

    var size = to - from
    element.attr('rowspan', size);

    if (self.active != null && fromLocation.x != toLocation.x)
      refreshColumn(fromLocation.x)
    
    refreshColumn(toLocation.x)
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
    
    if (self.active == null)
      self.active = $(this);

    course.draggable({ cursorAt: {top: 38, left: 75 }, revert: true, 
      start: function(event, ui) {
        self.active = ui.helper.parent();
      } 
    });

    course.resizable({ grid: 50,  handles: 's', 
      stop: function(event, ui) {
        var row = ui.element.parent().parent().index();
        var rowTaken = Math.floor(ui.size.height / 50 + 0.99);
        setCourseRows(ui.element.parent(), row, row + rowTaken);
      }
    });

    $(this).html(course);

    var row = $(this).parent().index();
    var rowTaken = Math.floor($(this).size.height / 61 + 0.99);
    setCourseRows($(this), row, row + rowTaken);
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