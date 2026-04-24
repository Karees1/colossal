import React, { useState, useCallback } from 'react';
import './Toast.css';

let showToastFn = null;

export function showToast(message, type = 'success') {
  if (showToastFn) showToastFn(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  showToastFn = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
