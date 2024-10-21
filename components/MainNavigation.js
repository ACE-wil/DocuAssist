import Link from 'next/link';
import Image from 'next/image';

export default function MainNavigation({ activeNav, setActiveNav }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: '主页', href: '/' },
    { id: 'workspace', icon: '💼', label: '工作空间', href: '/workspace' },
    { id: 'store', icon: '🏪', label: '商店', href: '/store' },
    { id: 'templates', icon: '📋', label: '模板', href: '/templates' },
  ];

  const bottomNavItems = [
    { id: 'docs', icon: '📄', label: '文档' },
    { id: 'messages', icon: '💬', label: '消息' },
    { id: 'upgrade', icon: '⭐', label: '升级' },
  ];

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
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
      <div className="bottom-section">
        {bottomNavItems.map((item) => (
          <a key={item.id} href="#" className="bottom-nav-item">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
        <div className="avatar">
          <Image src="/avatar.png" alt="Avatar" width={40} height={40} style={{borderRadius: '10px'}}/>
        </div>
      </div>
      <style jsx>{`
        .main-nav {
          width: 80px;
          background-color: #f8f8f8;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
        }
        .top-section, .bottom-section {
          display: flex;
          flex-direction: column;
          align-items: center;
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
        }
        .active {
          color: #007bff;
        }
      `}</style>
    </nav>
  );
}
