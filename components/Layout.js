import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainNavigation from './MainNavigation';
import SecondaryNavigation from './SecondaryNavigation';

export default function Layout({ children }) {
  const [activeMainNav, setActiveMainNav] = useState('home');
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;
    if (path === '/' || path === '/home') setActiveMainNav('home');
    else if (path.startsWith('/workspace')) setActiveMainNav('workspace');
    else if (path.startsWith('/store')) setActiveMainNav('store');
    else if (path.startsWith('/templates')) setActiveMainNav('templates');
  }, [router.pathname]);

  return (
    <div className="layout">
      <div className={`navigation-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <MainNavigation activeNav={activeMainNav} setActiveNav={setActiveMainNav} />
        <SecondaryNavigation activeMainNav={activeMainNav} isExpanded={isExpanded} />
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '<<' : '>>'}
        </button>
      </div>
      <main className="content-container">
        {children}
      </main>
      <style jsx>{`
        .layout {
          display: flex;
          height: 100vh;
          background-color: #f0f0f0;
        }
        .navigation-container {
          min-width: 80px;
          display: flex;
          background-color: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          margin: 20px;
          position: relative;
          transition: width 0.3s ease;
        }
        .navigation-container.expanded {
          width: 280px;
        }
        .navigation-container.collapsed {
          width: 80px;
        }
        .content-container {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
        }
        .toggle-btn {
          position: absolute;
          bottom: 20px;
          right: ${isExpanded ? '10px' : '25px'};
          background: none;
          border: none;
          cursor: pointer;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
