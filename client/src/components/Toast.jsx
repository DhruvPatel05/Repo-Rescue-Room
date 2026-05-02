import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-icon';
      case 'error':
        return 'alert-triangle-icon';
      case 'info':
        return 'alert-circle-icon';
      default:
        return 'check-icon';
    }
  };
  
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <svg className="toast-icon" role="presentation" aria-hidden="true">
          <use href={`/icons.svg#${getIcon()}`}></use>
        </svg>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#x-close-icon"></use>
        </svg>
      </button>
    </div>
  );
}

export default Toast;

// Made with Bob
