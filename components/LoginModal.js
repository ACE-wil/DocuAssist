import Modal from "react-modal";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Toast from "./Toast";

// 设置Modal的根元素
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    transition: "opacity 0.3s ease-out",
  },
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    width: "90%",
    maxWidth: "400px",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    border: "none",
    transform: "scale(0.8)",
    opacity: 0,
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
  },
};

export default function LoginModal({ isOpen, onClose }) {
  const { theme, isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // 添加注册模式状态

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      showToastMessage("请填写完整的信息", "error");
      return;
    }

    setIsLoading(true);
    try {
      // 根据当前模式选择API端点
      const endpoint = isRegisterMode ? "register" : "login";
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      // 检查响应类型
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("服务器返回了非JSON格式的响应，请检查API端点是否正确");
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      if (isRegisterMode) {
        // 注册成功后切换到登录模式
        showToastMessage("注册成功，请登录!");
        setIsRegisterMode(false);
        setFormData({username: formData.username, password: ""});
      } else {
        // 登录成功，保存token和用户信息
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);
        
        showToastMessage("登录成功!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      console.error(`${isRegisterMode ? "注册" : "登录"}错误:`, error);
      showToastMessage(error.message || `${isRegisterMode ? "注册" : "登录"}失败,请重试`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({username: "", password: ""});
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={modalStyles}
        onAfterOpen={() => {
          setTimeout(() => {
            const content = document.querySelector(".ReactModal__Content");
            if (content) {
              content.style.opacity = 1;
              content.style.transform = "scale(1)";
            }
          }, 0);
        }}
      >
        <div className="login-container">
          <button onClick={onClose} className="close-button">
            ×
          </button>
          <h2>{isRegisterMode ? "创建账号" : "欢迎回来"}</h2>
          <p className="subtitle">{isRegisterMode ? "请填写注册信息" : "请登录您的账号"}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isRegisterMode ? "请设置密码" : "请输入密码"}
                disabled={isLoading}
              />
            </div>

            {!isRegisterMode && (
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>记住我</span>
                </label>
                <a href="/forgot-password" className="forgot-password">
                  忘记密码?
                </a>
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (isRegisterMode ? "注册中..." : "登录中...") : (isRegisterMode ? "注册" : "登录")}
            </button>

            <div className="register-link">
              {isRegisterMode ? "已有账号?" : "还没有账号?"} 
              <a href="#" onClick={(e) => {e.preventDefault(); toggleMode();}}>
                {isRegisterMode ? "立即登录" : "立即注册"}
              </a>
            </div>
          </form>
        </div>

        <style jsx>{`
          .login-container {
            color: ${theme.text.primary};
          }

          h2 {
            margin: 0 0 0.5rem;
            font-size: 1.75rem;
            text-align: center;
          }

          .subtitle {
            text-align: center;
            color: ${theme.text.secondary};
            margin-bottom: 2rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          label {
            display: block;
            margin-bottom: 0.5rem;
            color: ${theme.text.secondary};
          }

          input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid ${theme.border};
            border-radius: 8px;
            background: ${theme.input.background};
            color: ${theme.text.primary};
            transition: border-color 0.3s;
          }

          input:focus {
            outline: none;
            border-color: ${theme.primary};
          }

          .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${theme.text.secondary};
            cursor: pointer;
            user-select: none;
          }

          .remember-me input[type="checkbox"] {
            width: auto;
            margin: 0;
            cursor: pointer;
          }

          .remember-me span {
            font-size: 0.9rem;
          }

          .forgot-password {
            color: ${theme.link.primary};
            text-decoration: none;
            font-size: 0.9rem;
          }

          .submit-button {
            width: 100%;
            padding: 0.75rem;
            background: ${theme.button.primary};
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
          }

          .submit-button:hover:not(:disabled) {
            background: ${theme.button.hover};
          }

          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .submit-button.loading {
            position: relative;
            color: transparent;
          }

          .submit-button.loading::after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin: -10px 0 0 -10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s infinite linear;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .register-link {
            text-align: center;
            margin-top: 1.5rem;
            color: ${theme.text.secondary};
          }

          .register-link a {
            color: ${theme.link.primary};
            text-decoration: none;
            margin-left: 0.5rem;
            cursor: pointer;
          }

          .register-link a:hover {
            text-decoration: underline;
          }

          .close-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: ${theme.text.secondary};
            cursor: pointer;
            padding: 0.5rem;
            line-height: 1;
          }

          .close-button:hover {
            color: ${theme.text.primary};
          }

          /* 添加模式切换动画 */
          .login-container {
            transition: height 0.3s ease-out;
          }

          form {
            transition: opacity 0.2s ease-out;
          }
        `}</style>
      </Modal>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
