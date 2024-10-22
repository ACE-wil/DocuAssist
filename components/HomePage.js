import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="top-banner cursor-pointer" style={{display:'flex',justifyContent:'center',flexDirection:'column'}}>
      <div style={{position:'relative',color:'white',fontSize:'40px',fontWeight:'bold',textAlign:'left',marginTop:'-20px'}}>以自己的方式创建 AI 代理</div>
      <div style={{position:'relative',color:'gray',fontSize:'20px',fontWeight:'bold',textAlign:'left'}}>新一代AI Agent构建平台，无需编码即可快速创建Agent并发布到各大平台。</div>
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
        {[
          { img: '/bn-1.jpeg', title: '什么是DocuAssist', description: '' },
          { img: '/bn-2.jpeg', title: '快速启动', description: '' },
          { img: '/bn-3.jpeg', title: '发行说明', description: '' },
        ].map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-image cursor-pointer">
              <img src={feature.img} alt={feature.title} />
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
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
        .cursor-pointer {
          cursor: pointer;
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
          overflow: hidden;
        }
        .feature-item img {
          width: 100%;
          height: 200px; // 设置一个固定高度，确保长方形
          object-fit: cover; // 确保图片填充整个区域
          border-radius: 10px;
        }
        .feature-image {
          position: relative;
          overflow: hidden;
        }
        .feature-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
        }
        .feature-text {
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 20px;
          color: white;
          background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
          border-radius: 10px;
        }
        .feature-text h3 {
        }
        .feature-text p {
          margin: 0;
          font-size: 14px;
         
        }
      `}</style>
    </div>
  );
}
