import { useState } from 'react';
import Modal from 'react-modal';

export default function CreateAppModal({ isOpen, onClose }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [appIcon, setAppIcon] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('开始提交表单');
    
    const formData = new FormData();
    
    // 添加表单数据
    formData.append('app_name', appName);
    formData.append('app_description', appDescription);
    formData.append('creator_name', creatorName);
    
    // 添加文件（如果有）
    if (appIcon) {
      formData.append('app_avatar', appIcon);
      console.log('添加图标文件:', appIcon.name);
    }
    if (docFile) {
      formData.append('doc_file', docFile);
      console.log('添加文档文件:', docFile.name);
    }

    // 打印 FormData 内容
    for (let pair of formData.entries()) {
      console.log('FormData 内容:', pair[0], pair[1]);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/create-app', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('响应状态:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('成功响应:', data);
        alert('应用创建成功！');
        onClose();
      } else {
        const errorData = await response.json();
        console.error('错误响应:', errorData);
        alert(`创建失败: ${errorData.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('请求错误:', error);
      alert('创建应用时发生错误，请查看控制台');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>创建新应用</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="appName">应用名称</label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="appDescription">应用描述</label>
          <textarea
            id="appDescription"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="creatorName">创建者名称</label>
          <input
            type="text"
            id="creatorName"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="appIcon">应用图标</label>
          <input
            type="file"
            id="appIcon"
            onChange={(e) => setAppIcon(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="docFile">文档文件</label>
          <input
            type="file"
            id="docFile"
            onChange={(e) => setDocFile(e.target.files[0])}
          />
        </div>
        <button type="submit">创建</button>
        <button type="button" onClick={onClose}>取消</button>
      </form>
    </Modal>
  );
}
