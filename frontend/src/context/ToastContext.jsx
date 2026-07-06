import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, variant = 'info', title = '') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant, title }]);

    window.setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const value = useMemo(
    () => ({
      showToast,
      showSuccess: (message, title) => showToast(message, 'success', title),
      showError: (message, title) => showToast(message, 'danger', title),
      showInfo: (message, title) => showToast(message, 'info', title),
      showWarning: (message, title) => showToast(message, 'warning', title),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1080 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant}
            onClose={() => removeToast(toast.id)}
            show
            autohide
            delay={5000}
          >
            {toast.title && (
              <Toast.Header closeButton>
                <strong className="me-auto">{toast.title}</strong>
              </Toast.Header>
            )}
            <Toast.Body className={toast.variant === 'danger' || toast.variant === 'success' ? 'text-white' : ''}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastContext;
