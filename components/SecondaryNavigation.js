import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const navContents = {
  home: [
    { icon: "📊", label: "概览", href: "/" },
    { icon: "🚀", label: "快速开始", href: "/quick-start" },
  ],
  workspace: [
    { icon: "🤖", label: "我的机器人", href: "/workspace/my-bots" },
    { icon: "📁", label: "项目管理", href: "/workspace/project-management" },
    { icon: "📝", label: "文档解析", href: "/workspace/document-parser" },
    { icon: "🎮", label: "游戏预览", href: "/workspace/game-preview" },
    { icon: "🎮", label: "单词拼写", href: "/workspace/word-Spell" },
  ],
  store: [
    { icon: "🔥", label: "热门应用", href: "/store/popular" },
    { icon: "🆕", label: "最新上架", href: "/store/new-arrivals" },
    // {
    //   icon: "🏪",
    //   label: "代理店",
    //   href: "/store/agency",
    //   subItems: [
    //     { icon: "📌", label: "热门代理", href: "/store/agency/popular" },
    //     { icon: "🔍", label: "搜索代理", href: "/store/agency/search" },
    //   ],
    // },
    // {
    //   icon: "🔌",
    //   label: "插件商店",
    //   href: "/store/plugins",
    //   subItems: [
    //     { icon: "⭐", label: "推荐插件", href: "/store/plugins/recommended" },
    //     { icon: "🔍", label: "浏览全部", href: "/store/plugins/browse" },
    //   ],
    // },
  ],
  templates: [
    { icon: "💡", label: "推荐模板", href: "/templates/recommended" },
    { icon: "🔍", label: "浏览全部", href: "/templates/browse-all" },
  ],
  gamespace: [
    { icon: "🎮", label: "最近游戏", href: "/gamespace/recent" },
    { icon: "🎮", label: "正在创建", href: "/gamespace/creating" },
    { icon: "🎮", label: "我的游戏", href: "/gamespace/my-games" },
  ],
  docs: [
    { icon: "📚", label: "快速入门", href: "/docs/quick-start" },
    { icon: "🔧", label: "基本功能", href: "/docs/basic-features" },
    // { icon: "🚀", label: "高级功能", href: "/docs/advanced-features" },
    // { icon: "🔌", label: "插件使用", href: "/docs/plugins" },
    { icon: "🔍", label: "API文档", href: "/docs/api" },
    { icon: "❓", label: "常见问题", href: "/docs/faq" },
  ],
  messages: [
    { icon: "📥", label: "收件箱", href: "/messages/inbox" },
    { icon: "📤", label: "已发送", href: "/messages/sent" },
    { icon: "📝", label: "草稿", href: "/messages/drafts" },
  ],
};

export default function SecondaryNavigation({ activeMainNav, isExpanded }) {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [expandedSubItems, setExpandedSubItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const items = navContents[activeMainNav] || [];

  useEffect(() => {
    const path = router.pathname;
    items.forEach((item, index) => {
      if (item.subItems && path.startsWith(item.href)) {
        setExpandedSubItems((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [router.pathname, items]);

  const toggleSubItems = (index) => {
    setExpandedSubItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemClick = (e, item, index) => {
    e.preventDefault();
    if (item.subItems) {
      setExpandedSubItems((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
      if (!expandedSubItems[index]) {
        router.push(item.subItems[0].href);
      }
    } else {
      router.push(item.href);
    }
  };

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <nav className={`secondary-nav ${isExpanded ? "expanded" : "collapsed"}`}>
      {activeMainNav === "home" ? (
        <>
          <h3 style={{ color: theme.text.primary }}>最近编辑</h3>
          <p style={{ color: theme.text.tertiary }}>暂无最近编辑的内容</p>

          <h3 style={{ color: theme.text.primary }}>收藏</h3>
          <p style={{ color: theme.text.tertiary }}>暂无收藏的内容</p>
        </>
      ) : (
        items.map((item, index) => (
          <div key={index}>
            <a
              href={item.href}
              className={`nav-item ${
                router.pathname.startsWith(item.href) ? "active" : ""
              }`}
              onClick={(e) => handleItemClick(e, item, index)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.subItems && (
                <span className="expand-icon">
                  {expandedSubItems[index] ? (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 4 L6 8 L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M4 2 L8 6 L4 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </span>
              )}
            </a>
            {item.subItems && expandedSubItems[index] && (
              <div className="sub-items">
                {item.subItems.map((subItem, subIndex) => (
                  <Link href={subItem.href} key={subIndex}>
                    <a
                      className={`nav-item sub-item ${
                        router.pathname === subItem.href ? "active" : ""
                      }`}
                    >
                      <span className="icon">{subItem.icon}</span>
                      <span className="label">{subItem.label}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <style jsx>{`
        .secondary-nav {
          width: ${isExpanded ? "200px" : "0px"};
          background-color: ${theme.surface};
          padding: ${isExpanded ? "20px" : "0px"};
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px;
          color: ${theme.text.primary};
          text-decoration: none;
          border-radius: 10px;
          margin-bottom: 5px;
          transition: background-color 0.3s;
          white-space: nowrap;
        }
        .nav-item:hover {
          background-color: ${isDark ? "#2d2d2d" : "#f0f0f0"};
        }
        .nav-item.active {
          background-color: ${theme.primary};
          color: white;
        }
        .icon {
          margin-right: 10px;
        }
        .expand-icon {
          margin-left: auto;
          cursor: pointer;
        }
        .sub-items {
          margin-left: 20px;
        }
        .sub-item {
          font-size: 0.9em;
        }
        .collapsed .label,
        .collapsed .expand-icon {
          display: none;
        }
        .parent-active {
          background-color: ${isDark ? "#2d2d2d" : "#e6f2ff"};
          font-weight: bold;
        }
        .sub-item.active {
          background-color: ${theme.primary};
          color: white;
        }
      `}</style>
    </nav>
  );
}
