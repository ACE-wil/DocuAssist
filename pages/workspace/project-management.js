import { useState, useEffect } from 'react';
import { 
  FiFolder, FiFile, FiList, FiGrid, 
  FiChevronRight, FiArrowLeft, FiSearch,
  FiFileText, FiImage, FiPlus, FiUpload, FiX, FiEdit2, FiTrash2
} from 'react-icons/fi';
import Modal from 'react-modal';

export default function ProjectManagement() {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPath, setCurrentPath] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  
  const [projects, setProjects] = useState({
    id: 'root',
    name: '根目录',
    type: 'folder',
    children: [
      {
        id: '1',
        name: '文档解析项目',
        type: 'folder',
        children: [
          { id: '1-1', name: '数学试题.pdf', type: 'file', url: '/files/math.pdf' },
          { id: '1-2', name: '物理试题.pdf', type: 'file', url: '/files/physics.pdf' }
        ]
      },
      {
        id: '2',
        name: '游戏项目',
        type: 'folder',
        children: [
          { id: '2-1', name: '答题闯关.doc', type: 'file', url: '/files/game.doc' },
          { 
            id: '2-2', 
            name: '识竞赛',
            type: 'folder',
            children: [
              { id: '2-2-1', name: '题库.xlsx', type: 'file', url: '/files/questions.xlsx' }
            ]
          }
        ]
      }
    ]
  });

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileInput, setFileInput] = useState(null);

  const [contextMenu, setContextMenu] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    item: null,
    type: 'blank' // 'blank' 或 'item'
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null
  });

  // 获取当前目录内容
  const getCurrentFolder = () => {
    let current = projects;
    for (const id of currentPath) {
      current = current.children.find(item => item.id === id);
    }
    return current;
  };

  // 返回上一级
  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  // 获取当前路径显示
  const getPathDisplay = () => {
    if (currentPath.length === 0) return '根目录';
    
    let current = projects;
    let path = [];
    for (const id of currentPath) {
      current = current.children.find(item => item.id === id);
      path.push(current.name);
    }
    return path.join(' / ');
  };

  // 处理单击
  const handleClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.id]);
    } else {
      // 检查文件类型
      const ext = item.name.split('.').pop().toLowerCase();
      if (['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
        setPreviewFile(item);
      }
    }
  };

  // 获取文件图标
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext)) {
      return <FiFileText size={40} />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return <FiImage size={40} />;
    }
    return <FiFile size={40} />;
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      children: []
    };

    const updatedProjects = { ...projects };
    let current = updatedProjects;
    for (const id of currentPath) {
      current = current.children.find(item => item.id === id);
    }
    current.children.push(newFolder);
    
    setProjects(updatedProjects);
    setNewFolderName('');
    setIsCreateFolderModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      type: 'file',
      url: URL.createObjectURL(file)
    };

    const updatedProjects = { ...projects };
    let current = updatedProjects;
    for (const id of currentPath) {
      current = current.children.find(item => item.id === id);
    }
    current.children.push(newFile);
    
    setProjects(updatedProjects);
  };

  const handleRename = (item) => {
    const newName = prompt('请输入新名称:', item.name);
    if (newName && newName !== item.name) {
      const updatedProjects = { ...projects };
      let current = updatedProjects;
      for (const id of currentPath) {
        current = current.children.find(i => i.id === id);
      }
      const targetItem = current.children.find(i => i.id === item.id);
      targetItem.name = newName;
      setProjects(updatedProjects);
    }
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleDelete = (item) => {
    setDeleteModal({
      isOpen: true,
      item: item
    });
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const confirmDelete = () => {
    const item = deleteModal.item;
    const updatedProjects = { ...projects };
    let current = updatedProjects;
    for (const id of currentPath) {
      current = current.children.find(i => i.id === id);
    }
    current.children = current.children.filter(i => i.id !== item.id);
    setProjects(updatedProjects);
    setDeleteModal({ isOpen: false, item: null });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, item: null });
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="file-explorer">
      <div className="toolbar">
        <div className="navigation">
          <button 
            onClick={handleBack} 
            disabled={currentPath.length === 0}
            className="nav-button"
          >
            <FiArrowLeft size={20} color={currentPath.length === 0 ? '#ccc' : '#666'} />
          </button>
          <div className="path-display">
            {currentPath.length === 0 ? '根目录' : getCurrentFolder().name}
          </div>
        </div>
        <div className="actions">
          <button 
            className="action-button"
            onClick={() => setIsCreateFolderModalOpen(true)}
          >
            <FiPlus size={18} />
            <span>新建文件夹</span>
          </button>
          <button 
            className="action-button upload"
            onClick={() => fileInput.click()}
          >
            <FiUpload size={18} />
            <span>上传文件</span>
          </button>
          <input
            type="file"
            ref={ref => setFileInput(ref)}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
        <div className="view-controls">
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FiList size={20} color={viewMode === 'list' ? '#1890ff' : '#666'} />
          </button>
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid size={20} color={viewMode === 'grid' ? '#1890ff' : '#666'} />
          </button>
        </div>
      </div>

      <div 
        className={`content ${viewMode}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            item: null,
            type: 'blank'
          });
        }}
      >
        {getCurrentFolder().children.map(item => (
          <div 
            key={item.id}
            className="item"
            onClick={() => handleClick(item)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({
                visible: true,
                x: e.pageX,
                y: e.pageY,
                item: item,
                type: 'item'
              });
            }}
          >
            <div className="item-icon">
              {item.type === 'folder' ? 
                <FiFolder size={40} /> : 
                getFileIcon(item.name)
              }
            </div>
            <div className="item-name">{item.name}</div>
          </div>
        ))}
      </div>

      {/* 文件预览弹窗 */}
      <Modal
        isOpen={!!previewFile}
        onRequestClose={() => setPreviewFile(null)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
            width: '80%',
            height: '80%',
            padding: '20px'
          }
        }}
      >
        {previewFile && (
          <div className="preview-container">
            <div className="preview-header">
              <h3>{previewFile.name}</h3>
              <button 
                onClick={() => setPreviewFile(null)}
                className="close-button"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="preview-content">
              {previewFile.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              ) : previewFile.name.match(/\.pdf$/i) ? (
                <object
                  data={previewFile.url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>您的浏览器不支持 PDF 预览，<a href={previewFile.url} target="_blank" rel="noopener noreferrer">点击下载</a></p>
                </object>
              ) : (
                <div className="unsupported-file">
                  <FiFile size={60} />
                  <p>此文件类型暂不支持预览</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCreateFolderModalOpen}
        onRequestClose={() => setIsCreateFolderModalOpen(false)}
        style={{
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
            width: '400px',
            padding: '20px',
            borderRadius: '8px',
            background: 'white'
          }
        }}
      >
        <div className="modal-header">
          <h3>新建文件夹</h3>
          <button 
            onClick={() => setIsCreateFolderModalOpen(false)}
            className="close-button"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="请输入文件夹名称"
            className="folder-name-input"
          />
        </div>
        <div className="modal-footer">
          <button 
            onClick={() => setIsCreateFolderModalOpen(false)}
            className="cancel-button"
          >
            取消
          </button>
          <button 
            onClick={handleCreateFolder}
            className="confirm-button"
            disabled={!newFolderName.trim()}
          >
            确定
          </button>
        </div>
      </Modal>

      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{ 
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            padding: '4px 0',
            minWidth: '180px',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {contextMenu.type === 'item' ? (
            <>
              <div 
                className="menu-item"
                onClick={() => handleRename(contextMenu.item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FiEdit2 size={14} />
                <span>重命名</span>
              </div>
              <div 
                className="menu-item delete"
                onClick={() => handleDelete(contextMenu.item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: '#ff4d4f',
                  transition: 'all 0.2s'
                }}
              >
                <FiTrash2 size={14} />
                <span>删除</span>
              </div>
            </>
          ) : (
            <>
              <div 
                className="menu-item"
                onClick={() => setIsCreateFolderModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FiFolder size={14} />
                <span>新建文件夹</span>
              </div>
              <div 
                className="menu-item"
                onClick={() => fileInput.click()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FiUpload size={14} />
                <span>上传文件</span>
              </div>
            </>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onRequestClose={() => setDeleteModal({ isOpen: false, item: null })}
        style={{
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
            width: '400px',
            padding: '20px',
            borderRadius: '8px',
            background: 'white'
          }
        }}
      >
        <div className="modal-header">
          <h3>确认删除</h3>
          <button 
            onClick={() => setDeleteModal({ isOpen: false, item: null })}
            className="close-button"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="modal-content" style={{ margin: '20px 0' }}>
          <p>确定要删除 "{deleteModal.item?.name}" 吗？</p>
          {deleteModal.item?.type === 'folder' && (
            <p style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '8px' }}>
              注意：文件夹中的所有内容都将被删除！
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button 
            onClick={() => setDeleteModal({ isOpen: false, item: null })}
            className="cancel-button"
          >
            取消
          </button>
          <button 
            onClick={confirmDelete}
            className="confirm-button delete"
          >
            删除
          </button>
        </div>
      </Modal>

      <style jsx>{`
        .file-explorer {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .navigation {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .nav-button:hover:not(:disabled) {
          background: #e9ecef;
        }

        .nav-button:disabled {
          cursor: not-allowed;
        }

        .path-display {
          font-size: 1rem;
          color: #495057;
          font-weight: 500;
        }

        .view-controls {
          display: flex;
          gap: 0.5rem;
        }

        .view-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-button:hover {
          background: #e9ecef;
        }

        .view-button.active {
          background: #e6f7ff;
        }

        .content {
          flex: 1;
          padding: 1rem;
          overflow: auto;
        }

        .content.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          align-items: start;
        }

        .content.list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item {
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          background: white;
          transition: background-color 0.2s;
          height: fit-content;
        }

        .item:hover {
          background: #f5f5f5;
        }

        .content.list .item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .preview-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .preview-content {
          flex: 1;
          overflow: auto;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-content img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: white;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .action-button:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .action-button svg {
          color: #1890ff;
        }

        .action-button span {
          font-weight: 500;
        }

        .action-button.upload {
          background: #e6f7ff;
          color: #1890ff;
        }

        .action-button.upload:hover {
          background: #bae7ff;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .folder-name-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .folder-name-input:focus {
          border-color: #1890ff;
          outline: none;
          box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-button {
          padding: 6px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .confirm-button {
          padding: 6px 16px;
          border: none;
          border-radius: 4px;
          background: #1890ff;
          color: white;
          cursor: pointer;
        }

        .confirm-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .context-menu {
          background: white;
          border-radius: 8px;
          padding: 4px 0;
          min-width: 160px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: fadeIn 0.15s ease-out;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          cursor: pointer;
          color: #333;
          transition: all 0.2s;
          font-size: 14px;
        }

        .menu-item:hover {
          background: #f5f5f5;
        }

        .menu-item.delete {
          color: #ff4d4f;
        }

        .menu-item.delete:hover {
          background: #fff1f0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

