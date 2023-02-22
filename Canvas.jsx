import React, { useEffect, useRef} from 'react';
import PropTypes from 'prop-types';


const Canvas = ( {height, width, items, x, setX, y, setY} ) => { 

  // 1 memorize position on canvas
  // sizes of items memorize
  
  const canvas = useRef();

  var outline;
  var current_item_index = null;

  const draw = (context) => { 
    context.clearRect(0, 0, width, height);
     for (var i = 0; i < items.length; i++) {
       var item = items[i];
       if (outline && item.img && current_item_index==i) {
         context.drawImage(item.img, item.x, item.y, item.width, item.height);
         context.strokeRect(item.x, item.y, item.width, item.height);
       }
       else if(item.img) {
        context.drawImage(item.img, item.x, item.y, item.width, item.height);
       }
     }
  }; 

  useEffect(() => {                             
    const context = canvas.current.getContext('2d'); 
    
    draw(context);

    let offset_x;
    let offset_y;

    let get_offset = function() {
      let canvas_offset = canvas.current.getBoundingClientRect();
      offset_x = canvas_offset.left;
      offset_y = canvas_offset.top;
    };

    get_offset();
    window.onscroll = function() { get_offset(); }
    window.onresize = function() { get_offset(); }
    canvas.onresize = function() { get_offset(); }

    let startX;
    let startY;

    let is_dragging = false;

    let is_mouse_in_shape = function(x, y, item) {
      let shape_left = item.x;
      let shape_right = item.x + item.width;
      let shape_top = item.y;
      let shape_bottom = item.y + item.height;

      if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
        return true;
      } 
      return false;
    };

    let mouse_down = function(event)  {
      event.preventDefault();
      startX = parseInt(event.clientX - offset_x);
      startY = parseInt(event.clientY - offset_y);

      let index = 0;
      for (let item of items) {
        if(is_mouse_in_shape(startX, startY, item)) {
          current_item_index = index;
          is_dragging = true;
          outline = true;
          return;
        }
        index++;
      }
      draw(context);
    };

    let mouse_up = function(event) {
      if(!is_dragging) {
        return;
      }
      event.preventDefault();
      is_dragging = false;
      outline = false;
      draw(context);
    };

    let mouse_out = function(event) {
      if(!is_dragging) {
        return;
      }
      event.preventDefault();
      is_dragging = false;
      outline = false;
      draw(context);
    };

    let mouse_move = function(event) {
      if(!is_dragging) {
        return;
      } else {
        event.preventDefault();
        let mouseX = parseInt(event.clientX - offset_x);
        let mouseY = parseInt(event.clientY - offset_y);

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        let current_item = items[current_item_index];
        current_item.x += dx;
        current_item.y += dy;

        console.log(current_item);
        
        // localStorage.removeItem('x')
        // localStorage.setItem('x', current_item.x)
        // localStorage.removeItem('y')
        // localStorage.setItem('y', current_item.y)

        draw(context);

        startX = mouseX;
        startY = mouseY; 
        // setX(x+=dx)
        // setY(y+=dy)
      }
        
       
    };
    canvas.current.onmousedown = mouse_down;
    canvas.current.onmouseup = mouse_up;
    canvas.current.onmouseout = mouse_out;
    canvas.current.onmousemove = mouse_move;

    
    // localStorage.clear()
  });
  return (
    <canvas
      ref={canvas}
      width={width} 
      height={height}
    />
  )
}
// ADDED
Canvas.propTypes = {
  height: PropTypes.number.isRequired, // ADDED
  width: PropTypes.number.isRequired, // ADDED
  items: PropTypes.array.isRequired
};

export default Canvas;