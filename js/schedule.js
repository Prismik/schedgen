(function($, self) {
  self.active = null;
  self.cellHeight = 25;

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
 
  var gapBeforeNextCell = function(row, column) {
    var gap = 0;
    var cell = null;
    $('.js-schedule table tr').each(function(rowIndex) {
      if (cell != null)
        return false;

      if (rowIndex > row) {
        $(this).find('td').each(function(cellIndex) {
          if (cellIndex == column && $(this).children().length > 0) {
            cell = $(this);
            return false;
          }
        });

        if (cell == null) 
          gap++;
      }
    });
   
    return gap;
  };

  var cellLocation = function(element) {
    var column = element.index();
    var tr = element.closest('tr');
    var row = tr.index();

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

  var isDropEventValid = function(droppable, element) {
    // The drop zone is free or is the same location we came from
    if ($(droppable).children().length == 0 || $(droppable).find('.ui-draggable-dragging').length != 0) {
      var dropLocation = cellLocation($(droppable));
      var dragLocation = cellLocation($(element.parent()));
      var gap = gapBeforeNextCell(dropLocation.y, dropLocation.x);
      var rows = $(element).height() / self.cellHeight;
      
      // The new location area is within the area we already covered
      if (dragLocation.x == dropLocation.x && dragLocation.y > dropLocation.y && dragLocation.y - dropLocation.y <= rows)
        return true;

      // The new location area is free for a drop
      if (gap - rows + 1 >= 0)
        return true;
    }
    
    return false;
  };
  
  // TODO Create function for course creation 
  var dropInTd = function(event, ui) {
    // TODO Check these conditions to have only one
    var revert = ui.draggable.hasClass('course') || !isDropEventValid(this, ui.draggable);
    ui.draggable.draggable('option', 'revert', revert);
    
    if (ui.draggable.hasClass('course') || !revert) {
      var name = '';
      var color = '';
      var what = '';
      var where = '';
      var rows = 1;
      var id = ui.draggable.data('course');
      if (ui.draggable.hasClass('schedCourse')) {
        name = ui.draggable.find('.js-name').html();
        color = ui.draggable.css('background-color');
        what = ui.draggable.find('.js-what').val();
        where = ui.draggable.find('.js-where').val();
        rows = ui.draggable.data('rows'); 
        ui.draggable.remove();
      }
      else {
        name = ui.draggable.find('input[type=text]').val()
        color = ui.draggable.css('background-color')
      }
      
      var course = $('<div data-rows="'+rows+'" style="height: '+rows*self.cellHeight+'px; background-color:' + color + '" class="js-course schedCourse" data-course="'+id+'"><div class="inner"><b>'+'<div class="js-name">'+name+'</div>'+'</b><div class="info">Expand the course...</div><input class="js-what" type-"text" placeholder="What ?" value="'+what+'"><br><input class="js-where" type="text" placeholder="Where ?" value="'+where+'"><br></div></div>');
      
      if (self.active == null)
        self.active = $(this);

      course.draggable({ cursorAt: {top: 3, left: 75 }, revert: true, 
        start: function(event, ui) {
          self.active = ui.helper.parent();
        }
      });

      course.resizable({ grid: self.cellHeight,  handles: 's', 
        start: function(event, ui) {
          var location = cellLocation(ui.element.parent()); // div in td -> his location 
          var diff = (1 + gapBeforeNextCell(location.y, location.x)) * self.cellHeight;
          course.resizable('option', 'maxHeight', diff);
        },
        stop: function(event, ui) {
          var row = ui.element.parent().parent().index(); // div in td in tr -> his index
          var rowTaken = Math.floor(ui.size.height / self.cellHeight + 0.99);
          $(ui.element).data('rows', rowTaken);
          refresh(ui.element.parent(), row, row + rowTaken);
        }
      });

      $(this).html(course);

      var row = $(this).parent().index(); // td in tr -> his index
      // The rows taken are determined by the data element or 1 by default
      refresh($(this), row, row + rows);
    }
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
      tolerance: 'pointer',
      activeClass: 'ui-state-active',
      hoverClass: 'ui-state-hover',
      drop: dropInTd
    });
  };
})(jQuery, this.Schedule = { });
