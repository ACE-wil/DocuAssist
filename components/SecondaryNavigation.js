import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const navContents = {
  home: [
    { icon: '📊', label: '概览', href: '/' },
    { icon: '🚀', label: '快速开始', href: '/quick-start' },
  ],
  workspace: [
    { icon: '🤖', label: '我的机器人', href: '/workspace/my-bots' },
    { icon: '📁', label: '项目管理', href: '/workspace/project-management' },
  ],
  store: [
    { icon: '🔥', label: '热门应用', href: '/store/popular' },
    { icon: '🆕', label: '最新上架', href: '/store/new-arrivals' },
  ],
  templates: [
    { icon: '💡', label: '推荐模板', href: '/templates/recommended' },
    { icon: '🔍', label: '浏览全部', href: '/templates/browse-all' },
  ],
};

export default function SecondaryNavigation({ activeMainNav }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  if (activeMainNav === 'home') {
    return (
      <nav className={`secondary-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <h3>最近编辑</h3>
        <p style={{color: '#ccc'}}>暂无最近编辑的内容</p>
        
        <h3>收藏</h3>
        <p style={{color: '#ccc'}}>暂无收藏的内容</p>
        
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '<<' : '>>'}
        </button>
        
        <style jsx>{`
          .secondary-nav {
            width: ${isExpanded ? '200px' : '0px'};
            padding: ${isExpanded ? '20px' : '0px'};;
            transition: width 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          h3 {
            margin-top: 20px;
            margin-bottom: 10px;
            white-space: nowrap;
          }
          p {
            white-space: nowrap;
          }
          .toggle-btn {
            position: fixed;
            bottom: 40px;
            left: ${isExpanded ? '240px' : '120px'};
            background: none;
            border: none;
            transition: width 0.3s ease;
            cursor: pointer;
          }
        `}</style>
      </nav>
    );
  }

  const items = navContents[activeMainNav] || [];

  return (
    <nav className={`secondary-nav ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {items.map((item, index) => (
        <Link href={item.href} key={index}>
          <a className={`nav-item ${router.pathname === item.href ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </a>
        </Link>
      ))}


      <style jsx>{`
        .secondary-nav {
          width: ${isExpanded ? '200px' : '50px'};
          background-color: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px;
          color: #333;
          text-decoration: none;
          border-radius: 10px;
          margin-bottom: 5px;
          transition: background-color 0.3s;
          white-space: nowrap;
        }
        .nav-item:hover {
          background-color: #f0f0f0;
        }
        .nav-item.active {
          background-color: #007bff;
          color: white;
        }
        .icon {
          margin-right: 10px;
        }
        .toggle-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .collapsed {
          display: none;
        }
      `}</style>
    </nav>
  );
}
