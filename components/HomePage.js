import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  const { theme } = useTheme();

  return (
    <div className="home-page" style={{ backgroundColor: theme.background }}>
      <div className="background-decorations">
        <div className="decoration-box box1"></div>
        <div className="decoration-box box2"></div>
        <div className="decoration-box box3"></div>
        <div className="decoration-box box4"></div>
      </div>

      <div className="content-wrapper">
        <div
          className="top-banner cursor-pointer"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              color: "white",
              fontSize: "40px",
              fontWeight: "bold",
              textAlign: "left",
              marginTop: "-20px",
            }}
          >
            以自己的方式创建 AI 应用
          </div>
          <div
            style={{
              position: "relative",
              color: theme.text.secondary,
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            新一代AI应用构建平台，无需编码即可快速创建AI应用并发布到平台开放使用。
          </div>
        </div>

        <div className="tutorial-section">
          <h2
            style={{
              display: "flex",
              flexDirection: "row",
              color: theme.text.primary,
            }}
          >
            新手教程
            <Link href="/tutorial">
              <a className="tutorial-link">
                <span style={{ marginLeft: "3px" }}>🔗</span>
              </a>
            </Link>
          </h2>
        </div>

        <div className="feature-section">
          {[
            {
              img: "/bn-1.jpeg",
              title: "什么是DocuAssist",
              description: "点击查看",
            },
            { img: "/bn-2.jpeg", title: "快速入门", description: "点击查看" },
            { img: "/bn-3.jpeg", title: "发行说明", description: "点击查看" },
          ].map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-image cursor-pointer">
                <img src={feature.img} alt={feature.title} />
                <div className="feature-text">
                  <h3 style={{ color: theme.text.indexTitleColor }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: theme.text.indexTipColor }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="content-section">
          <div className="left-content">
            <div className="section-header">
              <h2
                className="section-title"
                style={{ color: theme.text.primary }}
              >
                关注
                <Link href="/following">
                  <a className="header-link">
                    <span className="icon">👀</span>
                  </a>
                </Link>
              </h2>
            </div>
            <div className="app-list">
              {[
                {
                  name: "AI标题工厂",
                  image: "/icons/ai-company.jpg",
                  description:
                    "别等啦🚀💥让关键词瞬间变身小红书、抖音爆款标题，击率提升50%📈，一键搞定。",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
                {
                  name: "百变手抄报",
                  image: "/icons/baibian.png",
                  description:
                    "还在为手抄报绞尽脑汁？还在对着空白的纸张无从下手？【百变手抄报】是一款超好用的手抄报神器：风格百变，创意无限！根据主题快速给出手抄报的设计方案和设计效果。让你告别繁琐的排版和绘画，让你的创意尽情挥洒，一键生成超好用的精美手抄报！",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
                {
                  name: "色卡生成器V1.0",
                  image: "/icons/seka.jpg",
                  description: "上传你喜欢的图片，提取色彩，获取你的专属色卡！",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
              ].map((item) => (
                <div
                  key={item}
                  className="app-card"
                  style={{ backgroundColor: theme.surface }}
                >
                  <div className="app-info">
                    <img src={item.image} alt="应用图标" className="app-icon" />
                    <div className="app-details">
                      <div className="app-header">
                        <div className="app-title">
                          <h3 style={{ color: theme.text.primary }}>
                            {item.name}
                          </h3>
                          <span
                            className="app-author"
                            style={{ color: theme.text.secondary }}
                          >
                            @{item.name}
                          </span>
                        </div>
                        <button className="follow-button">
                          <span className="follow-icon">+</span>
                          关注
                        </button>
                      </div>
                      <p
                        className="app-description"
                        style={{ color: theme.text.secondary }}
                      >
                        {item.description}
                      </p>
                      <div
                        className="app-stats"
                        style={{ color: theme.text.tertiary }}
                      >
                        <span>
                          <i className="icon">👁️</i> 1.2k
                        </span>
                        <span>
                          <i className="icon">💬</i> 234
                        </span>
                        <span>
                          <i className="icon">⭐</i> 567
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-content">
            <div className="section-header">
              <h2
                className="section-title"
                style={{ color: theme.text.primary }}
              >
                推荐
                <Link href="/recommended">
                  <a className="header-link">
                    <span className="icon">🔥</span>
                  </a>
                </Link>
              </h2>
            </div>
            <div className="recommended-grid">
              {[
                {
                  name: "单人剧本杀-鬼魅酒店👻",
                  image: "/icons/jubensha.jpg",
                  description:
                    "别等啦🚀💥让关键词瞬间变身小红书、抖音爆款标题，击率提升50%📈，一键搞定。",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
                {
                  name: "认真看一百本书",
                  image: "/icons/real.jpg",
                  description:
                    "还在为手抄报绞尽脑汁？还在对着空白的纸张无从下手？【百变手抄报】是一款超好用的手抄报神器：风格百变，创意无限！根据主题快速给出手抄报的设计方案和设计效果。让你告别繁琐的排版和绘画，让你的创意尽情挥洒，一键生成超好用的精美手抄报！",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
                {
                  name: "色卡生成器V1.0",
                  image: "/icons/seka.jpg",
                  description: "上传你喜欢的图片，提取色彩，获取你的专属色卡！",
                  viewer: 1234,
                  star: 1234,
                  like: 1234,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="recommended-card"
                  style={{ backgroundColor: theme.surface }}
                >
                  <div className="card-image">
                    <img src={item.image} alt="应用图标" />
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3 style={{ color: theme.text.primary }}>{item.name}</h3>
                      <button className="mini-follow-button">
                        <span>+</span>
                      </button>
                    </div>
                    <div
                      className="card-stats"
                      style={{
                        color: theme.text.tertiary,
                        marginTop: "auto",
                      }}
                    >
                      <span>
                        <i className="icon">👁️</i> {item.viewer}
                      </span>
                      <span>
                        <i className="icon">⭐</i> {item.star}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          position: relative;
          min-height: 100vh;
          background: #f8fafc;
          overflow: hidden;
        }

        .background-decorations {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .decoration-box {
          position: absolute;
          border-radius: 20px;
          opacity: 0.05;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .box1 {
          width: 300px;
          height: 300px;
          top: -50px;
          right: -100px;
          transform: rotate(15deg);
        }

        .box2 {
          width: 200px;
          height: 200px;
          bottom: 100px;
          left: -50px;
          transform: rotate(-20deg);
        }

        .box3 {
          width: 150px;
          height: 150px;
          top: 40%;
          right: 15%;
          transform: rotate(45deg);
        }

        .box4 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 25%;
          transform: rotate(-15deg);
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        .top-banner {
          background-image: url("/banner.jpeg");
          background-size: cover;
          height: 30vh;
          background-position: center;
          border-radius: 15px;
          padding: 20px 40px;
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
          margin-left: -3px;
          font-size: 20px;
        }
        .feature-section {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-top: 20px;
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
          background: linear-gradient(
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.8) 100%
          );
          border-radius: 10px;
        }
        .feature-text h3 {
        }
        .feature-text p {
          margin: 0;
          font-size: 14px;
        }
        .content-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-top: 30px;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .header-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          margin-left: 0px;
        }

        .icon {
          font-size: 20px;
          line-height: 1;
        }

        .app-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .app-info {
          display: flex;
          gap: 16px;
        }

        .app-icon {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          cursor: pointer;
        }

        .app-details {
          flex: 1;
        }

        .app-details h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #333;
        }

        .app-description {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .app-stats {
          display: flex;
          gap: 16px;
          color: #666;
          font-size: 13px;
        }

        .app-stats span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .app-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .app-author {
          color: #666;
          font-size: 14px;
        }

        .follow-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 16px;
          border: none;
          background-color: #fce7f3;
          color: #ec4899;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .follow-button:hover {
          background-color: #fbcfe8;
          transform: translateY(-1px);
        }

        .follow-icon {
          font-size: 16px;
          font-weight: bold;
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .recommended-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .recommended-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-image {
          width: 100%;
          height: 140px;
          overflow: hidden;
          cursor: pointer;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .recommended-card:hover .card-image img {
          transform: scale(1.05);
        }

        .card-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          height: 100px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .card-header h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .mini-follow-button {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #fce7f3;
          color: #ec4899;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .mini-follow-button:hover {
          background-color: #fbcfe8;
          transform: scale(1.1);
        }

        .card-stats {
          display: flex;
          gap: 12px;
          color: #666;
          font-size: 13px;
        }

        .card-stats span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
