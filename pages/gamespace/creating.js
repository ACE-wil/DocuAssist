import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";
import { useRouter } from "next/router";

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

export default function Creating() {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
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
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsCreating(true);
        const response = await axios.get(
          "http://127.0.0.1:5000/api/get-my-apps"
        );
        setTemplates(response.data.myApps);
      } catch (error) {
        console.error("获取应用数据失败:", error);
      } finally {
        dispatch(setLoading(false));
        setIsCreating(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleBoxClick = (e) => {
    if (isCreating) return;
  };

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      {isCreating && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: "center", color: "#fff" }}>
            <h2>正在创建中...</h2>
            <div
              style={{
                width: "80%",
                height: "10px",
                backgroundColor: "#ccc",
                borderRadius: "5px",
                overflow: "hidden",
                margin: "20px auto",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#4a90e2",
                  transition: "width 0.3s",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <h1>正在创建</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates
          .filter((app) => !app.scene)
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
                    <span>复制</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
