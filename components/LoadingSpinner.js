import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function LoadingSpinner() {
  const { theme, isDark } = useTheme();

  return (
    <div className="spinner">
      <style jsx>{`
        .spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 1vh;
          left: 0%;
          width: 99%;
          height: 98vh;
          border-radius: 20px;
          background-color: ${isDark
            ? "rgba(164, 164, 164, 0.9)"
            : "rgba(255, 255, 255, 0.8)"};
          z-index: 1000;
        }
        .spinner::after {
          content: "";
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-left-color: ${theme.primary};
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
