import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../store/avatarSlice";
import { useTheme } from "../contexts/ThemeContext";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.avatar);
  const [name, setName] = useState("张三");
  const [email, setEmail] = useState("zhangsan@example.com");
  const [bio, setBio] = useState("我是一名热爱技术的开发者");
  const [preferredLanguage, setPreferredLanguage] = useState("中文");
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [theme, setTheme] = useState("light");
  const { theme: currentTheme, isDark, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("保存个人信息", {
      name,
      email,
      bio,
      avatar,
      preferredLanguage,
      notificationSettings,
      theme,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setAvatar(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-settings">
      <div className="left-column">
        <h1>个人信息设置</h1>
        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <div
              className="avatar-container"
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              <img src={avatar} alt="Avatar" className="current-avatar" />
              <div className="avatar-overlay">
                <span>点击上传</span>
              </div>
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">个人简介</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">首选语言</label>
            <select
              id="language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
            >
              <option value="中文">中文</option>
              <option value="English">English</option>
            </select>
          </div>
          <button type="submit" className="save-button">
            保存更改
          </button>
        </form>
      </div>
      <div className="right-column">
        <h2>通知设置</h2>
        <div className="form-group">
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.email}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    email: e.target.checked,
                  })
                }
              />{" "}
              邮件通知
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.push}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    push: e.target.checked,
                  })
                }
              />{" "}
              推送通知
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.sms}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    sms: e.target.checked,
                  })
                }
              />{" "}
              短信通知
            </label>
          </div>
        </div>
        <h2>界面设置</h2>
        <div className="form-group">
          <label htmlFor="theme">界面主题</label>
          <div className="theme-switch">
            <button
              className={`theme-button ${!isDark ? "active" : ""}`}
              onClick={() => toggleTheme("light")}
            >
              🌞 浅色
            </button>
            <button
              className={`theme-button ${isDark ? "active" : ""}`}
              onClick={() => toggleTheme("dark")}
            >
              🌙 深色
            </button>
          </div>
        </div>
        <h2>更多设置</h2>
        <ul className="additional-links">
          <li>
            <Link href="/workspace/my-bots">
              <a>我的机器人</a>
            </Link>
          </li>
          <li>
            <Link href="/workspace/project-management">
              <a>项目管理</a>
            </Link>
          </li>
          <li>
            <Link href="/docs/api">
              <a>API 文档</a>
            </Link>
          </li>
          <li>
            <Link href="/docs/plugins">
              <a>插件使用</a>
            </Link>
          </li>
          <li>
            <Link href="/messages/inbox">
              <a>消息中心</a>
            </Link>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .profile-settings {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 20px;
          background-color: ${currentTheme.background};
          overflow-y: auto;
          height: calc(100vh - 60px);
        }

        .left-column,
        .right-column {
          width: calc(50% - 20px);
          position: relative;
          background-color: ${currentTheme.surface};
          border-radius: 12px;
          padding: 20px;
          box-shadow: ${currentTheme.shadow};
          overflow-y: auto;
          height: 100%;
        }

        h1,
        h2 {
          color: ${currentTheme.text.primary};
          margin-bottom: 20px;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: ${currentTheme.text.secondary};
          font-weight: 500;
          font-size: 14px;
        }

        input[type="text"],
        input[type="email"],
        textarea,
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid ${currentTheme.border};
          border-radius: 4px;
          font-size: 14px;
          background: ${currentTheme.input.background};
          color: ${currentTheme.text.primary};
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus,
        select:focus {
          border-color: ${currentTheme.input.focus};
          box-shadow: 0 0 0 2px ${currentTheme.input.focus}25;
          outline: none;
        }

        .save-button {
          display: block;
          width: 90%;
          padding: 10px;
          background-color: ${currentTheme.button.primary};
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          position: absolute;
          bottom: 30px;
          left: 5%;
        }

        .save-button:hover {
          background-color: ${currentTheme.button.hover};
        }

        .additional-links a {
          color: ${currentTheme.primary};
          text-decoration: none;
        }

        .additional-links a:hover {
          text-decoration: underline;
        }
        .avatar-container {
          position: relative;
          cursor: pointer;
        }
        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 90px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 50%;
        }
        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }
        .current-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
        }
        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .theme-switch {
          display: flex;
          gap: 10px;
        }

        .theme-button {
          flex: 1;
          padding: 10px;
          border: 1px solid ${currentTheme.border};
          border-radius: 4px;
          background: ${currentTheme.input.background};
          color: ${currentTheme.text.primary};
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .theme-button.active {
          background: ${currentTheme.primary};
          color: white;
          border-color: ${currentTheme.primary};
        }

        .theme-button:hover:not(.active) {
          border-color: ${currentTheme.primary};
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: ${currentTheme.primary};
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
