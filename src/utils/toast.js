import toast from 'react-hot-toast';

export const notify = {
  success: (msg, duration = 4000) => toast.success(msg, { duration }),
  error: (msg, duration = 5000) => toast.error(msg, { duration }),
  info: (msg, duration = 4000) => toast(msg, { duration }),
  loading: (msg) => toast.loading(msg),
};
