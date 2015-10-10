(function($, self) {
self.create = function(colors, onColorChange) {
  var colorPicker = { };
  colorPicker.currentColor = "#FFFFFF";
  colorPicker.colors = $.unique(colors) || [];
  colorPicker.container = $('<div class="allColors"></div>');
  colorPicker.onColorChange = onColorChange || function() { }
  
  colorPicker.show = function(anchor, animation) {
    animation = animation || 'ease-in';
    // Use anchor as the starting point for the show animation
    // container should be positioned absolute
    colorPicker.container.css('display', 'block');
  };
  // --------------  For this exercice, we propose 9 colors as shown here
  //| A1 | A2 | A3 | Container has a light or dark div (theme)
  //|--------------| Tiles take all the empty area
  //| B1 | B2 | B3 | Tiles have no borders
  //|--------------| The algorithm fills starting with A1, A1 A2, A1 A2 A3, A1 A2 B1 B2, etc.
  //| C1 | C2 | C3 | The active tile is brighter, the rest darker
  // --------------  When choosing a new tile, the color gets brighter within a time frame (animation)
  colorPicker.hide = function(animation) {
    console.log('hide');
    animation = animation || 'ease-in';
    colorPicker.container.css('display', 'none');
  };

  colorPicker.select = function(color) {
    // TODO Refactor and keep reference to node instead of just the color 
    var previous = colorPicker.container.find('[data-color="' + colorPicker.currentColor + '"]');
    previous.addClass('unactive');
    previous.removeClass('active');

    currentColor = color;
    var active = colorPicker.container.find('[data-color="' + color + '"]');
    active.addClass('active');
    active.removeClass('unactive');
    colorPicker.hide();
  };  

  colorPicker.bindTo = function(control) {
    control.append(colorPicker.container);
  };

  for (var i = 0; i != colors.length; i++) {
    var colorBlock = $('<div style="background-color:' + colorPicker.colors[i] + '" data-color="' + colorPicker.colors[i] + '" class="colorNode unactive"></div>');
    colorBlock.click(colorPicker.select(colorPicker.colors[i]));
    colorPicker.container.append(colorBlock); 
  }
  
  colorPicker.hide();
  return colorPicker;
};

})(jQuery, this.ColorPickerFactory = { });
