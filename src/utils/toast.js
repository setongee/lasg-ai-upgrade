import toast from 'react-hot-toast';

export const notify = {
  success: (msg, duration = 2000) => toast.success(msg, { duration }),
  error: (msg, duration = 4000) => toast.error(msg, { duration }),
  info: (msg, duration = 4000) => toast(msg, { duration, icon: '⚠️' }),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
};
