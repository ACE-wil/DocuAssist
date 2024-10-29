import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="icon">✅</span>}
        {type === 'error' && <span className="icon">❌</span>}
        {type === 'loading' && <span className="icon">⏳</span>}
        <span className="message">{message}</span>
      </div>
      <style jsx>{`
        .toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 16px 32px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .success {
          background-color: #f0fdf4;
          border: 1px solid #86efac;
        }

        .error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
        }

        .loading {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon {
          font-size: 20px;
        }

        .message {
          color: #1f2937;
          font-size: 16px;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}