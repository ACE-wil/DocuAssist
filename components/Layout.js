import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainNavigation from './MainNavigation';
import SecondaryNavigation from './SecondaryNavigation';

export default function Layout({ children }) {
  const [activeMainNav, setActiveMainNav] = useState('home');
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
      <div className="navigation-container">
        <MainNavigation activeNav={activeMainNav} setActiveNav={setActiveMainNav} />
        <SecondaryNavigation activeMainNav={activeMainNav} />
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
          display: flex;
          width: 280px; // 调整宽度以适应您的需求
          background-color: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          margin: 20px;
        }
        .content-container {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
