import { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    width: '90%',
    height:'90vh',
    maxWidth: '600px',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
  }
};

export default function CreateAppModal({ isOpen, onClose }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [appIcon, setAppIcon] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('app_name', appName);
    formData.append('app_description', appDescription);
    formData.append('creator_name', creatorName);
    
    if (appIcon) {
      formData.append('app_avatar', appIcon);
    }
    
    if (docFile) {
      formData.append('doc_file', docFile);
    }

    try {
      console.log('发送的表单数据:', {
        app_name: appName,
        app_description: appDescription,
        creator_name: creatorName,
        app_avatar: appIcon ? appIcon.name : null,
        doc_file: docFile ? docFile.name : null
      });

      const response = await fetch('http://127.0.0.1:5000/api/create-app', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const result = await response.json();
      console.log('后端响应:', result);
      
      onClose();
    } catch (error) {
      console.error('提交错误:', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      style={customStyles}
    >
      <div className="modal-header">
        <h2>创建新应用</h2>
        <button onClick={onClose} className="close-button">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="create-app-form">
        <div className="form-group">
          <label>应用名称</label>
          <input
            type="text" 
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="输入应用名称"
          />
        </div>

        <div className="form-group">
          <label>应用描述</label>
          <textarea
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            placeholder="描述您的应用..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>创建者名称</label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="输入创建者名称"
          />
        </div>
<div style={{display:'flex',flexDirection:'row'}}>
        <div className="form-group" style={{margin:'20px'}}>
          <label>应用图标</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={(e) => setAppIcon(e.target.files[0])}
              accept="image/*"
              id="app-icon"
            />
            <label htmlFor="app-icon" className="file-label">
              选择图片
            </label>
          </div>
        </div>

        <div className="form-group" style={{margin:'20px'}}>
          <label>文档文件</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={(e) => setDocFile(e.target.files[0])}
              id="doc-file"
            />
            <label htmlFor="doc-file" className="file-label">
              选择文件
            </label>
          </div>
        </div>
  </div>
        <button type="submit" className="submit-button">创建应用</button>
      </form>

      <style jsx>{`
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .create-app-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input[type="text"],
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input[type="text"]:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input-wrapper input[type="file"] {
          display: none;
        }

        .file-label {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-label:hover {
          background-color: #eee;
        }

        .submit-button {
          background-color: #4a90e2;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #357abd;
        }
      `}</style>
    </Modal>
  );
}