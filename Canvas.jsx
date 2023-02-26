import React, { useEffect, useRef, useState} from 'react';
import PropTypes, { func } from 'prop-types';
import flip from '../assets/flip-svgrepo-com.svg';
import up from '../assets/arrow-up-outline.svg';
import down from '../assets/arrow-down-outline.svg';
import crop from '../assets/crop-outline.svg';
import close from '../assets/close-circle-outline.svg';
import back from '../assets/arrow-back-outline.svg';
import forward from '../assets/arrow-forward-outline.svg';
import styles from '../style';


const Canvas = ( {height, width, items, isItemSelected} ) => { 
  
  const canvas = useRef();
  const [idSelected, setIdSelected] = useState();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isMoved, setIsMoved] = useState(false);

  function handleClickDelete(event) {
    items.splice(event.currentTarget.value, 1);
    setIsDeleted(current => !current);
    if (items.length == 0) {
      isItemSelected(null);
    }
  };

  function handleClickUp(event) {
    let index = Number(event.currentTarget.value);
    setIsMoved(current => !current);
    if(index != items.length-1) {
      [items[index], items[index+1]] = [items[index+1], items[index]];
    }
  };

  function handleClickDown(event) {
    let index = Number(event.currentTarget.value);
    setIsMoved(current => !current);
    if(index != 0) {
      [items[index], items[index-1]] = [items[index-1], items[index]];
    }
  };


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
          setIdSelected(index);
          is_dragging = true;
          outline = true;
          return;
        }
        else  {
          outline = false;
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
      outline = true;
     // i can memorize clicked item here
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
     


        draw(context);

        startX = mouseX;
        startY = mouseY; 
      }
       
    };
    canvas.current.onmousedown = mouse_down;
    canvas.current.onmouseup = mouse_up;
    canvas.current.onmouseout = mouse_out;
    canvas.current.onmousemove = mouse_move;

  });
  
  return (
    <div className={`flex-col ${styles.canavsSection1} ${styles.flexCenter} justify-between`}>
      <div className='flex-row justify-between'>
        <button className='p-2'><img src={flip} alt="flip" className='w-[23px] h-[23px]'/></button>
        <button value={idSelected} onClick={handleClickUp} className='p-2'><img src={up} alt="up" className='w-[23px] h-[23px]'/></button>
        <button value={idSelected} onClick={handleClickDown} className='p-2'><img src={down} alt="down" className='w-[23px] h-[23px]'/></button>
        <button className='p-2'><img src={crop} alt="crop" className='w-[23px] h-[23px]'/></button>
        <button value={idSelected} onClick={handleClickDelete} className='p-2'><img src={close} alt="close" className='w-[23px] h-[23px]'/></button>
      </div>
      <div className='flex-row w-[650px]'>
            <canvas ref={canvas} width={width} height={height} />
      </div>
      <div className='flex-row justify-between'>
        <button className='p-2'><img src={back} alt="back" className='w-[23px] h-[23px]'/></button>
        <button className='p-2'><img src={forward} alt="forward" className='w-[23px] h-[23px]'/></button>
      </div>
    </div>

  )
}

Canvas.propTypes = {
  height: PropTypes.number.isRequired, 
  width: PropTypes.number.isRequired, 
  items: PropTypes.array.isRequired,
};

export default Canvas;
