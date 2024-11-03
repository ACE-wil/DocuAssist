import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { theme, isDark } = useTheme();
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          color: isDark ? '#e0e0e0' : '#333333'
        }}
      >
        {isOpen ? '<<' : '>>'}
      </button>
      <nav>
        <Link href="/">
          <a>首页</a>
        </Link>
        <Link href="/about">
          <a>关于</a>
        </Link>
        <Link href="/contact">
          <a>联系</a>
        </Link>
      </nav>
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background-color: ${theme.surface};
          transition: width 0.3s;
          overflow: hidden;
        }
        .open {
          width: 200px;
        }
        .closed {
          width: 50px;
        }
        button {
          width: 100%;
          padding: 10px;
          background: none;
          border: none;
          cursor: pointer;
        }
        nav {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }
        a {
          margin-bottom: 10px;
          color: ${theme.text.primary};
        }
      `}</style>
    </div>
  );
}
