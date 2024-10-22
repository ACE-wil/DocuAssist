import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="top-banner">
        {/* 这里可以放置长方形圆边盒子的内容 */}
      </div>
      
      <div className="tutorial-section">
        <h2 style={{display: 'flex', flexDirection: 'row'}}>新手教程
          <Link href="/tutorial">
          <a className="tutorial-link">
            <span className="icon">🔗</span>
          </a>
        </Link>
        </h2>
        
      </div>
      
      <div className="feature-section">
        <div className="feature-item">
          <img src="/bn-1.jpeg" alt="功能1" />
          <h3>功能1</h3>
        </div>
        <div className="feature-item">
          <img src="/bn-2.jpeg" alt="功能2" />
          <h3>功能2</h3>
        </div>
        <div className="feature-item">
          <img src="/bn-3.jpeg" alt="功能3" />
          <h3>功能3</h3>
        </div>
      </div>
      
      <style jsx>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .top-banner {
          background-image: url('/banner.jpeg');
          background-size: cover;
          height: 30vh;
          background-position: center;
          border-radius: 15px;
          padding:20px 40px;
          text-align: center;
        }
        .tutorial-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .tutorial-link {
          display: flex;
          align-items: center;
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }
        .icon {
          margin-left: 10px;
          font-size: 20px;
        }
        .feature-section {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }
        .feature-item {
          flex: 1;
          text-align: center;
        }
        .feature-item img {
          width: 100%;
          height: 200px; // 设置一个固定高度，确保长方形
          object-fit: cover; // 确保图片填充整个区域
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
