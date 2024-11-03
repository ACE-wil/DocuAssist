import React, { forwardRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const MessageBox = forwardRef(({ isOpen, onClose }, ref) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const messages = [
    { id: 1, sender: '系统', content: '欢迎使用我们的平台!', time: '10:00 AM' },
    { id: 2, sender: '支持团队', content: '有任何问题随时问我们哦!', time: '11:30 AM' },
    { id: 3, sender: '系统', content: '您有一个新的任务待处理。', time: '2:15 PM' },
  ];

  return (
    <div className={`message-box ${isOpen ? 'open' : ''}`} ref={ref} style={{
      backgroundColor: theme.surface,
      color: theme.text.primary
    }}>
      <button className="close-button" onClick={onClose} style={{ color: theme.text.primary }}>×</button>
      <h3 style={{ color: theme.text.primary }}>消息</h3>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item" style={{
            borderBottom: `1px solid ${theme.border}`
          }}>
            <div className="message-header">
              <span className="sender" style={{ color: theme.text.primary }}>{message.sender}</span>
              <span className="time" style={{ color: theme.text.tertiary }}>{message.time}</span>
            </div>
            <div className="message-content" style={{ color: theme.text.secondary }}>{message.content}</div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .message-box {
          position: fixed;
          left: 110px;
          bottom: 0;
          width: 30vw;
          height: 90vh;
          border-radius: 10px;
          box-shadow: ${theme.shadow};
          padding: 20px;
          transform: translateY(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
        }
        
        .message-item {
          margin-bottom: 15px;
          padding: 10px;
          transition: background-color 0.2s ease;
        }

      `}</style>
    </div>
  );
});

export default MessageBox;
