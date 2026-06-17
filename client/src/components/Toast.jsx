import { useEffect } from 'react';

const types = {
  success: { bg: '#82b864', icon: '✓' },
  warning: { bg: '#cd2c2e', icon: '!' },
  error:   { bg: '#cd2c2e', icon: '✕' },
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
