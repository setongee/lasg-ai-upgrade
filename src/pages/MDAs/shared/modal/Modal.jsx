import { Xmark } from 'iconoir-react';
import React from 'react';
import './modal.css';

const Modal = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="backdrop h-[100vh] w-[100vw] fixed top-0 left-0 z-[1000] bg-black/50">
      <div className="modal_content mb-40">
        <button className="absolute top-[30px] right-[30px] cursor-pointer" onClick={onClose}>
          <Xmark />
        </button>
        {<br></br>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
