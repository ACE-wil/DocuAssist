import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";

export default function Api() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div
      style={{ display: "flex", padding: "20px", color: theme.text.primary }}
    >
      <div style={{ flex: 3, paddingRight: "20px" }}>
        <h1
          id="introduction"
          style={{ borderBottom: "2px solid", paddingBottom: "10px" }}
        >
          接口文档
        </h1>
        <p style={{ color: theme.text.secondary }}>
          欢迎使用我们的平台！本指南将帮助您快速上手，了解平台的基本功能和使用方法。
        </p>
        <img
          src="/dall-e-3.jpg"
          alt="Quick Start"
          style={{ width: "70%", marginTop: "20px", borderRadius: "8px" }}
        />

        <h2
          id="setup"
          style={{
            marginTop: "20px",
            borderBottom: "1px solid",
            paddingBottom: "5px",
          }}
        >
          设置
        </h2>
        <p>在开始使用之前，请确保您已完成以下设置步骤：</p>
        <ul>
          <li>注册并登录您的账户。</li>
          <li>配置您的个人资料和偏好设置。</li>
          <li>安装必要的插件和扩展。</li>
        </ul>
        <img
          src="/GPT4V.png"
          alt="Setup"
          style={{ width: "70%", marginTop: "20px", borderRadius: "8px" }}
        />

        <h2
          id="features"
          style={{
            marginTop: "20px",
            borderBottom: "1px solid",
            paddingBottom: "5px",
          }}
        >
          主要功能
        </h2>
        <p>我们的平台提供了多种功能，帮助您更好地管理和使用资源：</p>
        <ul>
          <li>实时数据分析和报告。</li>
          <li>自定义工作空间和仪表板。</li>
          <li>与第三方应用的无缝集成。</li>
        </ul>
        <img
          src="/LLaMa2.png"
          alt="Features"
          style={{ width: "70%", marginTop: "20px", borderRadius: "8px" }}
        />

        <h2
          id="support"
          style={{
            marginTop: "20px",
            borderBottom: "1px solid",
            paddingBottom: "5px",
          }}
        >
          支持与帮助
        </h2>
        <p>如果您在使用过程中遇到问题，可以通过以下方式获取帮助：</p>
        <ul>
          <li>
            访问我们的
            <a href="/docs/faq" style={{ color: theme.link.primary }}>
              常见问题
            </a>
            页面。
          </li>
          <li>
            联系
            <a href="/contact" style={{ color: theme.link.primary }}>
              客服支持
            </a>
            。
          </li>
          <li>
            加入我们的
            <a href="/community" style={{ color: theme.link.primary }}>
              用户社区
            </a>
            。
          </li>
        </ul>
        <img
          src="/GPT-3.5.png"
          alt="Support"
          style={{ width: "70%", marginTop: "20px", borderRadius: "8px" }}
        />
      </div>

      <div
        style={{
          width: "200px",
          borderLeft: "1px solid #ccc",
          paddingLeft: "20px",
          position: "sticky",
          top: "20px",
        }}
      >
        <h3>目录</h3>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <a
              href="#introduction"
              style={{
                color: theme.link.primary,
                textDecoration: "none",
                padding: "5px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f7ff")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              快速开始指南
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a
              href="#setup"
              style={{
                color: theme.link.primary,
                textDecoration: "none",
                padding: "5px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f7ff")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              设置
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a
              href="#features"
              style={{
                color: theme.link.primary,
                textDecoration: "none",
                padding: "5px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f7ff")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              主要功能
            </a>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <a
              href="#support"
              style={{
                color: theme.link.primary,
                textDecoration: "none",
                padding: "5px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f7ff")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              支持与帮助
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
