import './confirm-modal.css';

const ConfirmModal = ({
  children,
  open,
  onClose,
  onConfirm,
  customClass,
  buttonGroupClasses,
  loading,
  keepOpenOnConfirm,
}) => {
  if (!open) return null;
  const handleConfirm = () => {
    if (!keepOpenOnConfirm) {
      onClose();
    }
    onConfirm();
  };

  return (
    <div className="confirm-backdrop h-[100vh] w-[100vw] fixed top-0 left-0 z-[999999999999] bg-black/50">
      <div className={`modal_content mb-40 ${customClass}`}>
        <div className="confirmTitle">Confirm Action</div>

        {children}

        <div className={`btn-grp flex ${buttonGroupClasses || ''}`}>
          <button className="bg-gray-300 text-gray-700" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="bg-green-700 text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Confirming...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
