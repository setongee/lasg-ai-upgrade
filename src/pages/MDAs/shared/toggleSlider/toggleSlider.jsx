import React, { useCallback, useEffect, useState } from 'react';
import { notify } from '../../../../utils/toast';
import ConfirmModal from '../confirmModal/confirm-modal';
import './toggleSlider.css';

const ToggleSlider = ({ changeStatus, status }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  // Keep local status in sync with prop
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  const onClose = useCallback(() => {
    if (!isLoading) setOpen(false);
  }, [isLoading]);

  const handleChange = useCallback(async () => {
    const newStatus = !localStatus;
    setLocalStatus(newStatus); // Optimistic update

    try {
      setIsLoading(true);
      await changeStatus(newStatus);
      setOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      setLocalStatus(status);
      notify.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  }, [localStatus, status, changeStatus]);

  const confirmSwitch = useCallback(() => {
    if (!isLoading) setOpen(true);
  }, [isLoading]);

  return (
    <>
      <ConfirmModal open={open} onClose={onClose} onConfirm={handleChange} disabled={isLoading}>
        <div className="confirm-message leading-[1.6] mt-10">
          Are you sure you want to switch to <strong>{!status ? 'offline' : 'online'} mode?</strong>
          <br />
          <br />
          This will {!status ? 'make the site inaccessible' : 'make the site accessible'} to users
          and visitors. However, you'll still be able to edit and manage your application while
          offline.
        </div>
      </ConfirmModal>
      <div
        className={`switch ${!localStatus ? 'bg-[#d8e9e3]' : 'bg-[#d6d6d6]'}`}
        onClick={confirmSwitch}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        <div className={`toggle-ball ${!localStatus ? 'active' : 'inactive'}`}>
          {isLoading && <div className="spinner"></div>}
        </div>
      </div>
    </>
  );
};

export default React.memo(ToggleSlider);
