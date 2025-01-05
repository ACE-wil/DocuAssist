import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
import Toast from "@/components/Toast";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          remember: formData.remember,
        }),
        credentials: "include", // 支持跨域cookie
      });

      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        // 登录成功
        setToastMessage("登录成功!");
        setShowToast(true);

        // 存储token或其他认证信息
        localStorage.setItem("token", data.token);

        // 延迟跳转
        setTimeout(() => {
          router.push("/home/overview");
        }, 1500);
      } else {
        setError(data.message || "登录失败");
      }
    } catch (err) {
      setError("网络错误，请稍后重试");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>登录</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <span>记住我</span>
            </label>
            <a href="/forgot-password" className="forgot-password">
              忘记密码?
            </a>
          </div>

          <button type="submit">登录</button>
        </form>

        <div className="register-link">
          还没有账号? <a href="/register">立即注册</a>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${theme.background};
        }

        .login-box {
          background: ${theme.surface};
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          color: ${theme.text.primary};
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          color: ${theme.text.secondary};
          margin-bottom: 0.5rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid ${theme.border};
          border-radius: 4px;
          background: ${theme.input.background};
          color: ${theme.text.primary};
        }

        input:focus {
          outline: none;
          border-color: ${theme.primary};
          box-shadow: 0 0 0 2px ${theme.primary}25;
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
          gap: 0.5rem;
          color: ${theme.text.secondary};
        }

        .forgot-password {
          color: ${theme.link.primary};
          text-decoration: none;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background: ${theme.primary};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        button:hover {
          background: ${theme.primaryDark};
        }

        .error-message {
          background: ${theme.error}15;
          color: ${theme.error};
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }

        .register-link {
          text-align: center;
          margin-top: 1.5rem;
          color: ${theme.text.secondary};
        }

        .register-link a {
          color: ${theme.link.primary};
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
