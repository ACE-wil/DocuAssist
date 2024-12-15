import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";
import { useRouter } from "next/router";
import Modal from "react-modal";

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

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      <h1>最近游戏</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates
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
          ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="开始游戏"
        style={customStyles}
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
        <h2>上传文件并选择选项</h2>
        <div
          onClick={() =>
            !file && document.getElementById("file-upload").click()
          }
          style={{
            border: "1px dashed #ddd",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          {file ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="file-icon" style={{ fontSize: "32px" }}>
                📄
              </span>
              <span>{file.name}</span>
              <button
                onClick={handleRemoveFile}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                &times;
              </button>
            </div>
          ) : (
            <div
              className="upload-placeholder"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="upload-icon" style={{ fontSize: "32px" }}>
                📁
              </span>
              <span>点击上传文件</span>
            </div>
          )}
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ flex: "1", marginRight: "5px" }}>
            <label>剧情选择：</label>
            <select
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              style={{
                marginTop: "5px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "100%",
              }}
            >
              <option value="warrior">冒险</option>
              <option value="mage">励志</option>
              <option value="archer">爱情</option>
            </select>
          </div>
          <div style={{ flex: "1", marginLeft: "5px" }}>
            <label>难度级别：</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                marginTop: "5px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "100%",
              }}
            >
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ flex: "1", marginRight: "5px" }}>
            <label>语言设置：</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                marginTop: "5px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "100%",
              }}
            >
              <option value="zh">中文</option>
              {/* <option value="en">英文</option>
              <option value="jp">日文</option> */}
            </select>
          </div>
          <div style={{ flex: "1", marginLeft: "5px" }}>
            <label>游戏模式：</label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              style={{
                marginTop: "5px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "100%",
              }}
            >
              <option value="single">单人模式</option>
              {/* <option value="multi">多人模式</option> */}
            </select>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={() => setMusicEnabled(!musicEnabled)}
            />
            启用背景音乐
          </label>
        </div>
        <button
          onClick={handleStartGame}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          开始游戏
        </button>
      </Modal>
    </div>
  );
}
