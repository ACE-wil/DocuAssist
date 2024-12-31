import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { useTheme } from "@/contexts/ThemeContext";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease-out",
  },
  content: {
    position: "relative",
    top: "auto",
    left: "auto",
    right: "auto",
    bottom: "auto",
    width: "400px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transform: "scale(0.8)",
    opacity: 0,
    transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
  },
};

// 在应用启动时设置
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

export default function RecentGames() {
  const dispatch = useDispatch();
  const { toggleTheme, setTheme, theme, isDark } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [file, setFile] = useState(null);
  const [option, setOption] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [character, setCharacter] = useState("warrior");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [language, setLanguage] = useState("zh");
  const [gameMode, setGameMode] = useState("single");
  const router = useRouter();
  const [appType, setAppType] = useState(null);
  const [nullcenes, setNullScenes] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-my-apps`
        );
        setTemplates(response.data.myApps);
      } catch (error) {
        console.error("获取应用数据失败:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  const handleBoxClick = (e) => {
    setSelectedAppId(e.currentTarget.id);
    setAppType(e.currentTarget.dataset.type);
    console.log("sdadsa", e.currentTarget.id);
    console.log("appType", e.currentTarget.dataset.type);
    setIsModalOpen(true);
    setTheme("dark");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const handleStartGame = () => {
    setIsModalOpen(false);
    console.log("selectedAppId", selectedAppId);
    router.push(`/app/${selectedAppId}?type=${appType}`); // 传递 id 和 type
  };

  const characterQuotes = [
    {
      name: "宫崎骏",
      image: "http://cdn.docuparser.top/avatar/gongqijun.jpg",
      quote:
        "“人生就是一列开往坟墓的列车，路途上会有很多站，很难有人可以自始至终陪着走完。当陪你的人要下车时，即使不舍也该心存感激，然后挥手道别。” ——《千与千寻》",
    },
    {
      name: "阿甘",
      image: "http://cdn.docuparser.top/avatar/forrestgump.jpg",
      quote: "“生活就像一盒巧克力，你永远不知道你会得到什么。” ——《阿甘正传》",
    },
    {
      name: "多莉",
      image: "http://cdn.docuparser.top/avatar/dory.jpg",
      quote: "“继续游，继续游。” ——《海底总动员》",
    },
    {
      name: "阿尔弗雷德",
      image: "http://cdn.docuparser.top/avatar/alfred.jpg",
      quote: "“为什么我们会跌倒？为了学会重新站起来。” ——《蝙蝠侠：侠影之谜》",
    },
    {
      name: "克里斯·加德纳",
      image: "http://cdn.docuparser.top/avatar/chrisgardner.jpg",
      quote:
        "“别让别人告诉你你不能做什么。即使是我也不行。” ——《当幸福来敲门》",
    },
    {
      name: "山姆",
      image: "http://cdn.docuparser.top/avatar/sam.jpg",
      quote: "“即使在黑暗中，也会有光明。” ——《指环王》",
    },
    {
      name: "艾尔莎",
      image: "http://cdn.docuparser.top/avatar/elsa.jpg",
      quote: "“放手吧，过去的事就让它过去。” ——《冰雪奇缘》",
    },
    {
      name: "哈利·波特",
      image: "http://cdn.docuparser.top/avatar/harrypotter.jpg",
      quote:
        "“幸福可以在最黑暗的时刻找到，只要记得打开灯。” ——《哈利·波特与阿兹卡班的囚徒》",
    },
    {
      name: "雷米",
      image: "http://cdn.docuparser.top/avatar/remy.jpg",
      quote: "“每个人都可以做出伟大的事情。” ——《料理鼠王》",
    },
    {
      name: "伍迪",
      image: "http://cdn.docuparser.top/avatar/woody.jpg",
      quote: "“你有一个朋友。” ——《玩具总动员》",
    },
  ];

  const randomCharacterQuote =
    characterQuotes[Math.floor(Math.random() * characterQuotes.length)];

  const randomBackgrounds = [
    "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "linear-gradient(135deg, #f6d365, #fda085)",
    "linear-gradient(135deg, #84fab0, #8fd3f4)",
  ];

  const randomBackground =
    randomBackgrounds[Math.floor(Math.random() * randomBackgrounds.length)];

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      <h1 style={{ color: theme.text.primary }}>我的游戏</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              color: "#999",
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={isDark ? "/icons/empty-dark.png" : "/icons/empty.png"}
              alt="No Templates"
              style={{ width: "150px", marginBottom: "20px" }}
            />
            <h2>暂无我的游戏</h2>
            <p>您还没有任何游戏记录。开始创建一个新的游戏吧！</p>
            <button
              onClick={() => router.push("/templates/recommended")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: theme.button.primary,
                color: "white",
                border: "none",
                borderRadius: "5px",
                letterSpacing: "1px",
                cursor: "pointer",
              }}
            >
              创建新游戏
            </button>
          </div>
        ) : (
          templates
            .filter((app) => app.scene)
            .map((template, index) => (
              <div
                key={index}
                id={template.id}
                data-type={template.type}
                className={styles.template}
                onClick={(e) => handleBoxClick(e)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={template.app_avatar || "/default-image.png"}
                  alt={template.app_name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <div style={{ paddingLeft: "3px" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      margin: "2px 0px 2px 0px",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {template.app_name}
                    <button
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "rgb(240 240 240)",
                        borderRadius: "5px",
                        border: "none",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/icons/fileIcon.png"
                        style={{ width: "16px", height: "16px" }}
                      />
                      应用
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#06070980",
                      margin: "4px 0px 8px 0px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/logo.png"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginRight: "5px",
                      }}
                    />
                    DA官方
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#06070980",
                      lineHeight: "1.5",
                    }}
                  >
                    {template.app_description}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>免费</div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#06070980",
                        lineHeight: "30px",
                      }}
                    >
                      {/* <span style={{ marginRight: "4px" }}>
                    {template.visit_count || "N/A"}
                  </span> */}
                      <span>复制</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setTheme("light");
        }}
        contentLabel="开始游戏"
        style={{
          ...customStyles,
          content: {
            ...customStyles.content,
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            padding: "30px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
          },
        }}
        onAfterOpen={() => {
          setTimeout(() => {
            const content = document.querySelector(".ReactModal__Content");
            if (content) {
              content.style.opacity = 1;
              content.style.transform = "scale(1)";
            }
          }, 0);
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            animation: "fadeIn 1s",
          }}
        >
          <img
            src={randomCharacterQuote.image}
            alt={randomCharacterQuote.name}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <h3>{randomCharacterQuote.name} 说：</h3>
          <p style={{ color: "#ddd" }}>{randomCharacterQuote.quote}</p>
        </div>
        <button
          onClick={handleStartGame}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#357ABD";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#4a90e2";
            e.target.style.transform = "scale(1)";
          }}
        >
          开始游戏
        </button>
      </Modal>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
