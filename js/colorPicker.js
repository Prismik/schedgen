(function($, self) {
self.init = function(colors) {
  var colorPicker = { };
  var colorPicker.currentColor = "#FFFFFF";
  var colorPicker.colors = $.unique(colors) || [];
  var colorPicker.container = $('<div class="allColors"></div>');

  colorPicker.show = function(anchor, animation) {
    animation = animation || 'ease-in';
    // Use anchor as the starting point for the show animation
    // container should be positioned absolute
    container.css('display', 'block');
  };
  // --------------  For this exercice, we propose 9 colors as shown here
  //| A1 | A2 | A3 | Container has a light or dark div (theme)
  //|--------------| Tiles take all the empty area
  //| B1 | B2 | B3 | Tiles have no borders
  //|--------------| The algorithm fills starting with A1, A1 A2, A1 A2 A3, A1 A2 B1 B2, etc.
  //| C1 | C2 | C3 | The active tile is brighter, the rest darker
  // --------------  When choosing a new tile, the color gets brighter within a time frame (animation)
  colorPicker.hide = function(animation) {
    animation = animation || 'ease-in';
    container.css('display', 'none');
  };

  colorPicker.select = function(color) {
    // TODO Refactor and keep reference to node instead of just the color 
    var previous = colorPicker.find('[data-color="' + currentColor + '"]');
    previous.addClass('unactive');
    previous.removeClass('active');

    currentColor = color;
    var active = colorPicker.find('[data-color="' + color + '"]');
    active.addClass('active');
    active.removeClass('unactive');
  };

  for (var i = 0; i != colors.length; i++) {
    var colorBlock = $('<div data-color="' + colorPicker.colors[i] + '" class="colorNode unactive"></div>');
    colorBlock.click(colorPicker.select(colorPicker.colors[i]));
    colorPicker.container.append(colorBlock); 
  }
  
  colorPicker.hide();
  return colorPicker;
};

})(jQuery, this.ColorPicker = { });
