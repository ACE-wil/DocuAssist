import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="spinner">
      <style jsx>{`
        .spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 3vh;
          left: 1%;
          width: 98%;
          height: 94vh;
          border-radius: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 1000;
        }
        .spinner::after {
          content: "";
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
