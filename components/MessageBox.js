import React, { forwardRef } from 'react';

const MessageBox = forwardRef(({ isOpen, onClose }, ref) => {
  if (!isOpen) return null;

  const messages = [
    { id: 1, sender: '系统', content: '欢迎使用我们的平台!', time: '10:00 AM' },
    { id: 2, sender: '支持团队', content: '有任何问题随时问我们哦!', time: '11:30 AM' },
    { id: 3, sender: '系统', content: '您有一个新的任务待处理。', time: '2:15 PM' },
  ];

  return (
    <div className={`message-box ${isOpen ? 'open' : ''}`} ref={ref}>
      <button className="close-button" onClick={onClose}>×</button>
      <h3>消息</h3>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <span className="sender">{message.sender}</span>
              <span className="time">{message.time}</span>
            </div>
            <div className="message-content">{message.content}</div>
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
          background-color: white;
          border-radius: 10px;
          box-shadow: -10px 0 20px -5px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.1);
          padding: 20px;
          transform: translateY(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
        }
        .message-box.open {
          transform: translateY(0);
        }
        .close-button {
          position: absolute;
          right: 10px;
          top: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        h3 {
          margin-top: 0;
        }
        .message-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .message-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 0.9em;
        }
        .sender {
          font-weight: bold;
        }
        .time {
          color: #888;
        }
        .message-content {
          font-size: 0.95em;
        }
      `}</style>
    </div>
  );
});

export default MessageBox;
