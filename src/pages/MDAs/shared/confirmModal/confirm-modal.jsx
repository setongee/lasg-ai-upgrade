import React from 'react';
import './confirm-modal.css';

const ConfirmModal = ({ children, open, onClose, onConfirm }) => {
  if (!open) return null;
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <div className="confirm-backdrop h-[100vh] w-[100vw] fixed top-0 left-0 z-[999999999999] bg-black/50">
      <div className="modal_content mb-40">
        <div className="confirmTitle">Confirm Action</div>

        {children}

        <div className="btn-grp flex">
          <button className="bg-gray-300 text-gray-700" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-700 text-white" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
