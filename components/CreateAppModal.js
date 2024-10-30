import { useState } from 'react';
import Modal from 'react-modal';
import Toast from './Toast';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'opacity 0.3s ease-out',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    width: '90%',
    maxWidth: '700px',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    maxHeight: '90vh',
    overflow: 'visible',
    zIndex: 1001,
    transform: 'scale(0.8)',
    opacity: 0,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  }
};

export default function CreateAppModal({ isOpen, onClose }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [appIcon, setAppIcon] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ icon: 0, doc: 0 });
  const [previewIcon, setPreviewIcon] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!appName.trim()) {
      showToast('请输入应用名称', 'error');
      return;
    }
    if (!appDescription.trim()) {
      showToast('请输入应用描述', 'error');
      return;
    }
    if (!creatorName.trim()) {
      showToast('请输入创建者名称', 'error');
      return;
    }

    showToast('正在创建应用...', 'loading');
    
    const formData = new FormData();
    formData.append('app_name', appName);
    formData.append('app_description', appDescription);
    formData.append('creator_name', creatorName);
    
    if (appIcon) formData.append('app_avatar', appIcon);
    if (docFile) formData.append('doc_file', docFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/create-app', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('创建失败，请稍后重试');
      }

      const result = await response.json();
      showToast('应用创建成功！', 'success');
      
      // 延迟关闭模态框，让用户看到成功提示
      setTimeout(() => {
        onClose();
        // 重置表单
        setAppName('');
        setAppDescription('');
        setCreatorName('');
        setAppIcon(null);
        setDocFile(null);
        setPreviewIcon(null);
        setUploadProgress({ icon: 0, doc: 0 });
      }, 1500);
      
    } catch (error) {
      console.error('提交错误:', error);
      showToast(error.message || '创建失败，请稍后重试', 'error');
    }
  };

  // 处理图标上传
  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAppIcon(file);
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result);
      };
      reader.readAsDataURL(file);
      
      // 模拟上传进度
      simulateUploadProgress('icon');
    }
  };

  // 处理文档上传
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFile(file);
      // 模拟上传进度
      simulateUploadProgress('doc');
    }
  };

  // 模拟上传进度
  const simulateUploadProgress = (type) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(prev => ({
        ...prev,
        [type]: progress
      }));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onRequestClose={onClose}
        style={customStyles}
        onAfterOpen={() => {
          setTimeout(() => {
            const content = document.querySelector('.ReactModal__Content');
            if (content) {
              content.style.opacity = 1;
              content.style.transform = 'scale(1)';
            }
          }, 0);
        }}
      >
        <div className="modal-header">
          <h2>创建新应用</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="create-app-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <label>创建者名称</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="输入创建者名称"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>应用描述</label>
            <textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              placeholder="描述您的应用..."
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.25rem',
            margin: '0.25rem 0'
          }}>
            <div className="upload-container">
              <label>应用图标</label>
              <div className="upload-box" style={{ 
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                {previewIcon ? (
                  <div className="preview-container" style={{ textAlign: 'center' }}>
                    <img 
                      src={previewIcon} 
                      alt="应用图标" 
                      className="preview-image"
                      style={{ 
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <div className="preview-overlay">
                      <button onClick={() => {setPreviewIcon(null); setAppIcon(null)}}>
                        删除
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="upload-placeholder" 
                    onClick={() => document.getElementById('app-icon').click()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="upload-icon" style={{ fontSize: '32px' }}>📁</span>
                    <span>点击上传图标</span>
                  </div>
                )}
                <input
                  type="file"
                  id="app-icon"
                  onChange={handleIconUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {uploadProgress.icon > 0 && uploadProgress.icon < 100 && (
                  <div className="progress-bar" style={{ width: '80%', margin: '10px 0' }}>
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress.icon}%` }}
                    />
                    <span className="progress-text">{uploadProgress.icon}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-container">
              <label>文档文件</label>
              <div className="upload-box" style={{ 
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                {docFile ? (
                  <div className="file-info" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    width: '80%'
                  }}>
                    <span className="file-icon" style={{ fontSize: '24px' }}>📄</span>
                    <span className="file-name" style={{ flex: 1, textAlign: 'center' }}>{docFile.name}</span>
                    <button 
                      onClick={() => setDocFile(null)} 
                      className="remove-file"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#666'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div 
                    className="upload-placeholder" 
                    onClick={() => document.getElementById('doc-file').click()}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className="upload-icon" style={{ fontSize: '32px' }}>📄</span>
                    <span>点击上传文档</span>
                  </div>
                )}
                <input
                  type="file"
                  id="doc-file"
                  onChange={handleDocUpload}
                  style={{ display: 'none' }}
                />
                {uploadProgress.doc > 0 && uploadProgress.doc < 100 && (
                  <div className="progress-bar" style={{ width: '80%', margin: '10px 0' }}>
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress.doc}%` }}
                    />
                    <span className="progress-text">{uploadProgress.doc}%</span>
                  </div>
                )}
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
            margin-top: -5px;
          }

          .submit-button:hover {
            background-color: #357abd;
          }

          .upload-container {
            width: 45%;
          }
          
          .upload-box {
            border: 2px dashed #ddd;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f8f9fa;
            position: relative;
            min-height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .upload-box:hover {
            border-color: #4a90e2;
            background: #f0f7ff;
          }

          .upload-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: #666;
          }

          .upload-icon {
            font-size: 2rem;
            margin-bottom: 10px;
          }

          .preview-container {
            position: relative;
            width: 100px;
            height: 100px;
          }

          .preview-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }

          .preview-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 8px;
          }

          .preview-container:hover .preview-overlay {
            opacity: 1;
          }

          .preview-overlay button {
            background: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
          }

          .file-info {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .file-icon {
            font-size: 1.5rem;
          }

          .file-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .remove-file {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 1.2rem;
          }

          .progress-bar {
            width: 100%;
            height: 4px;
            background: #eee;
            border-radius: 2px;
            margin-top: 10px;
            position: relative;
          }

          .progress-fill {
            height: 100%;
            background: #4a90e2;
            border-radius: 2px;
            transition: width 0.3s ease;
          }

          .progress-text {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 12px;
            color: #666;
          }
        `}</style>
      </Modal>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </>
  );
}