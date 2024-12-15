import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";
import { useRouter } from "next/router";
import { Alert } from "antd"; // 引入 Ant Design 的 Alert 组件

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
  const [isCreating, setIsCreating] = useState(false); // 新增状态
  const [progress, setProgress] = useState(0); // 进度条状态
  const [showAlert, setShowAlert] = useState(false); // 控制警告对话框的显示

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
    if (!isCreating) {
      setShowAlert(true); // 显示自定义警告对话框
      setTimeout(() => setShowAlert(false), 2000); // 2秒后自动隐藏
      return; // 如果正在创建，禁止点击
    }
    setSelectedAppId(e.currentTarget.id);
    setAppType(e.currentTarget.dataset.type);
    console.log("sdadsa", e.currentTarget.id);
    console.log("appType", e.currentTarget.dataset.type);
  };

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
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
              style={{
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              <img
                src={template.app_avatar || "/default-image.png"}
                alt={template.app_name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease",
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
              {!isCreating && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
                    letterSpacing: "2px",
                    zIndex: 1,
                    transition: "opacity 0.3s ease",
                    opacity: 0.9,
                  }}
                >
                  正在创建应用中...
                </div>
              )}
            </div>
          ))}
      </div>

      {showAlert && (
        <Alert
          message="提示"
          description="应用暂未创建完成，请稍后再试。"
          type="warning"
          showIcon
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
            width: "300px",
            textAlign: "center",
            animation: "fadeInOut 3s forwards",
          }}
        />
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
