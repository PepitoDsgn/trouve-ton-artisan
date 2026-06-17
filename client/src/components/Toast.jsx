import { useEffect } from 'react';

const types = {
  success: { bg: '#2e7d32', icon: '✓' },
  warning: { bg: '#e65100', icon: '!' },
  error:   { bg: '#c62828', icon: '✕' },
};

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { bg, icon } = types[type] || types.success;

  return (
    <div className="toast-artisan" style={{ background: bg }} role="alert">
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
