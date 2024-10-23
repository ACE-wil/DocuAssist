import { useState } from 'react';
import Link from 'next/link';

export default function ProfileSettings() {
  const [name, setName] = useState('张三');
  const [email, setEmail] = useState('zhangsan@example.com');
  const [bio, setBio] = useState('我是一名热爱技术的开发者');
  const [avatar, setAvatar] = useState('/avatar.png');
  const [preferredLanguage, setPreferredLanguage] = useState('中文');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [theme, setTheme] = useState('light');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('保存个人信息', { name, email, bio, avatar, preferredLanguage, notificationSettings, theme });
  };

  return (
    <div className="profile-settings">
      <div className="left-column">
        <h1>个人信息设置</h1>
        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <img src={avatar} alt="Avatar" className="current-avatar" />
           </div>
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">个人简介</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="language">首选语言</label>
            <select id="language" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
              <option value="中文">中文</option>
              <option value="English">English</option>
              <option value="日本語">日本語</option>
            </select>
          </div>
          <button type="submit" className="save-button">保存更改</button>
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
                onChange={(e) => setNotificationSettings({...notificationSettings, email: e.target.checked})}
              /> 邮件通知
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.push}
                onChange={(e) => setNotificationSettings({...notificationSettings, push: e.target.checked})}
              /> 推送通知
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.sms}
                onChange={(e) => setNotificationSettings({...notificationSettings, sms: e.target.checked})}
              /> 短信通知
            </label>
          </div>
        </div>
        <h2>界面设置</h2>
        <div className="form-group">
          <label htmlFor="theme">界面主题</label>
          <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">跟随系统</option>
          </select>
        </div>
        <h2>更多设置</h2>
        <ul className="additional-links">
          <li><Link href="/workspace/my-bots"><a>我的机器人</a></Link></li>
          <li><Link href="/workspace/project-management"><a>项目管理</a></Link></li>
          <li><Link href="/docs/api"><a>API 文档</a></Link></li>
          <li><Link href="/docs/plugins"><a>插件使用</a></Link></li>
          <li><Link href="/messages/inbox"><a>消息中心</a></Link></li>
        </ul>
      </div>
      <style jsx>{`
        .profile-settings {
          display: flex;
          justify-content: space-between;
          position: relative;
          top: 0px;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 20px;
          background-color: #f5f5f5;
          overflow-y: auto;
          height: calc(100vh - 60px); // 假设导航栏高度为60px
        }
        .left-column, .right-column {
          width: calc(50% - 20px);
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow-y: auto;
          height: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 24px; // 减小标题字体大小
        }
        h2 {
          color: #333;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 20px; // 减小二级标题字体大小
        }
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        .current-avatar {
          width: 90px; // 减小头像大小
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 10px;
          border: 3px solid #f0f0f0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
          font-weight: 500;
          font-size: 14px;
        }
        input[type="text"],
        input[type="email"],
        textarea,
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus,
        select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
          outline: none;
        }
        textarea {
          height: 50px;
          resize: vertical;
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
        .save-button {
          display: block;
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
        }
        .save-button:hover {
          background-color: #0056b3;
        }
        .save-button:active {
          transform: translateY(1px);
        }
        .additional-links {
          list-style-type: none;
          padding: 0;
        }
        .additional-links li {
          margin-bottom: 10px;
        }
        .additional-links a {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }
        .additional-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
