import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import MessageBox from './MessageBox';
import UpgradeModal from './UpgradeModal';

export default function MainNavigation({ activeNav, setActiveNav }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: '主页', href: '/' },
    { id: 'workspace', icon: '💼', label: '工作空间', href: '/workspace' },
    { id: 'store', icon: '🏪', label: '商店', href: '/store' },
    { id: 'templates', icon: '📋', label: '模板', href: '/templates' },
  ];

  const bottomNavItems = [
    { id: 'docs', icon: '📄', label: '文档', href: '/docs/quick-start' },
    { id: 'messages', icon: '💬', label: '消息' },
    { id: 'upgrade', icon: '⭐', label: '升级', href: '/upgrade' },
  ];

  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const messageBoxRef = useRef(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleOpen = () => {
    setIsMessageBoxOpen(true);
  };

  const handleClose = () => {
    setIsMessageBoxOpen(false);
  };



  useEffect(() => {
    function handleClickOutside(event) {
      if (messageBoxRef.current && !messageBoxRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="main-nav">
      <div className="top-section">
        <div className="logo">
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{borderRadius: '10px'}}/>
        </div>
        <button className="add-button">+</button>
        {navItems.map((item) => (
          <Link href={item.href} key={item.id}>
            <a
              className={activeNav === item.id ? 'active' : ''}
              onClick={() => setActiveNav(item.id)}
            >
              <span>{item.icon}</span>
              <span style={{}}>{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
      <div className="bottom-section">
        {bottomNavItems.map((item) => (
          <div key={item.id}>
            {item.id === 'messages' ? (
              <a
                className={`bottom-nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={handleOpen}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ) : item.id === 'upgrade' ? (
              <a
                className={`bottom-nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ) : (
              <Link href={item.href}>
                <a
                  className={`bottom-nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            )}
          </div>
        ))}
        <div className="avatar cursor-pointer">
          <Image src="/avatar.png" alt="Avatar" width={40} height={40} style={{borderRadius: '10px'}}/>
        </div>
      </div>
      <style jsx>{`
        .main-nav {
          width: 80px;
          min-width: 80px;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          height: 100vh;
        }
        .top-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .bottom-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: auto;
          padding-bottom: 60px;
        }
        .logo, .add-button, a, .bottom-nav-item, .avatar {
          margin-bottom: 20px;
        }
        .add-button {
          background: none;
          border: 1px solid #333;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 20px;
          cursor: pointer;
        }
        a, .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
          text-decoration: none;
          cursor: pointer;
        }
        .active {
          color: #007bff;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
      <MessageBox 
        isOpen={isMessageBoxOpen} 
        onClose={handleClose} 
        ref={messageBoxRef}
        style={{
          position: 'fixed',
          left: '110px',
          top: '50%',
          transform: 'translateY(-50%)',
          height: `${isMessageBoxOpen ? '90vh' : '0'}`,
          width: `${isMessageBoxOpen ? '30vw' : '0'}`,
          transition: 'all 0.3s ease',
          boxShadow: '-10px 0 20px -5px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.1)',
        }}
      />
      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onRequestClose={() => setIsUpgradeModalOpen(false)}
      />
    </nav>
  );
}
