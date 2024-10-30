import { useState, useEffect } from 'react';
import { 
  FiFolder, FiFile, FiList, FiGrid, 
  FiChevronRight, FiArrowLeft, FiSearch,
  FiFileText, FiImage
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
            name: '知识竞赛',
            type: 'folder',
            children: [
              { id: '2-2-1', name: '题库.xlsx', type: 'file', url: '/files/questions.xlsx' }
            ]
          }
        ]
      }
    ]
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

  return (
    <div className="file-explorer">
      <div className="toolbar">
        <div className="navigation">
          <button 
            onClick={handleBack} 
            disabled={currentPath.length === 0}
            className="nav-button"
          >
            <FiArrowLeft />
          </button>
          <div className="path-display">
            {currentPath.length === 0 ? '根目录' : getCurrentFolder().name}
          </div>
        </div>
        <div className="view-controls">
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FiList />
          </button>
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      <div className={`content ${viewMode}`}>
        {getCurrentFolder().children.map(item => (
          <div 
            key={item.id}
            className="item"
            onClick={() => handleClick(item)}
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
              <button onClick={() => setPreviewFile(null)}>关闭</button>
            </div>
            <div className="preview-content">
              {/* 根据文件类型显示不同的预览内容 */}
              {previewFile.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={previewFile.url || '#'} alt={previewFile.name} />
              ) : (
                <iframe
                  src={previewFile.url || '#'}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                />
              )}
            </div>
          </div>
        )}
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
        }

        .navigation {
          display: flex;
          align-items: center;
          gap: 1rem;
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
      `}</style>
    </div>
  );
}

