(function($, self) {
  self.active = null;
  self.cellHeight = 50;

  var cellsInColumn = function(column) {
    var data = [];
    $(".js-schedule table tr").each(function(rowIndex) {
      $(this).find("td").each(function(cellIndex) {
          if (cellIndex == column)
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
    var cells = cellsInColumn(column);
    var rowTaken = 0;
    var skip = 0;
    for (var i = 1; i != cells.length; i++) {
      if (--skip <= 0) {
        var rowspan = cells[i].attr('rowspan');
        rowTaken = typeof rowspan === 'undefined' || isNaN(rowspan) ? 0 : rowspan;

        cells[i].css("display", "table-cell");
        if (cells[i].children().length != 0 && rowTaken != 0) {
          cells[i].attr('rowspan', rowspan);
          skip = rowTaken;
        }
        else
          cells[i].attr('rowspan', 1);
      }
      else
        cells[i].css("display", "none");
    }
  }

  var refresh = function(element, from, to) {
    var toLocation = cellLocation(element);
    if (self.active != null)
      var fromLocation = cellLocation(self.active);

    element.attr('rowspan', to - from);
    refreshColumn(toLocation.x)
    if (self.active != null && fromLocation.x != toLocation.x)
      refreshColumn(fromLocation.x)
  };

  var dropInTd = function(event, ui) {
    var name = '';
    var color = '';
    var what = '';
    var where = '';
    var id = ui.draggable.data('course');
    if (ui.draggable.hasClass('schedCourse')) {
      name = ui.draggable.find('.js-name').html();
      color = ui.draggable.css('background-color');
      what = ui.draggable.find('.js-what').val();
      where = ui.draggable.find('.js-where').val();
      ui.draggable.remove();
    }
    else {
      name = ui.draggable.find('input[type=text]').val()
      color = ui.draggable.css('background-color')
    }
    
    var course = $('<div style="height: 50px; background-color:' + color + '" class="js-course schedCourse" data-course="'+id+'"><div class="inner"><b>'+'<div class="js-name">'+name+'</div>'+'</b><div class="info">Expand the course...</div><input class="js-what" type-"text" placeholder="What ?" value="'+what+'"><br><input class="js-where" type="text" placeholder="Where ?" value="'+where+'"><br></div></div>');
    
    if (self.active == null)
      self.active = $(this);

    course.draggable({ cursorAt: {top: 38, left: 75 }, revert: true, 
      start: function(event, ui) {
        self.active = ui.helper.parent();
      }
    });

    course.resizable({ grid: self.cellHeight,  handles: 's', 
      resize: function(event, ui) {
        // TODO if (ui.size.height < maxSize)       
        // ui.size.height = 
      },
      start: function(event, ui) {
        // TODO find the next course in the row, compute the diff between their locations, assign a value to maxSize for the current resizable    
      },
      stop: function(event, ui) {
        var row = ui.element.parent().parent().index();
        var rowTaken = Math.floor(ui.size.height / self.cellHeight + 0.99);
        refresh(ui.element.parent(), row, row + rowTaken);
      }
    });

    $(this).html(course);

    var row = $(this).parent().index();
    var rowTaken = Math.floor($(this).size.height / self.cellHeight + 0.99);
    refresh($(this), row, row + rowTaken);
  };

  self.refresh = function() {
    for (var i = 0; i != 5; i++)
      refreshColumn(i);
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
