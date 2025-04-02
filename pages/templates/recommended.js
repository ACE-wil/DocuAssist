import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";
import { useRouter } from "next/router";
import Modal from "react-modal";
import CreateAppModal from "@/components/CreateAppModal";
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

export default function RecommendedTemplates() {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectType, setSelectType] = useState("");
  const [file, setFile] = useState(null);
  const [option, setOption] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [character, setCharacter] = useState("warrior");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [language, setLanguage] = useState("zh");
  const [gameMode, setGameMode] = useState("single");
  const router = useRouter();
  const { theme } = useTheme();
  const [isCreateAppModalOpen, setIsCreateAppModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-apps`
        );
        setTemplates(response.data.applications);
      } catch (error) {
        console.error("获取应用数据失败:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  const handleBoxClick = (appId, type) => {
    setSelectedAppId(appId);
    setSelectType(type);
    setIsCreateAppModalOpen(true);
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
    router.push(`/app/${selectedAppId}`);
  };

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      <h1 style={{ color: theme.text.primary }}>模板</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates.map((template, index) => (
          <div
            key={index}
            className={styles.template}
            onClick={() => {
              console.log("template", template);
              handleBoxClick(template.appId, template.type);
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={template.app_avatar_path || "/default-image.png"}
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
                  <span style={{ marginRight: "4px" }}>
                    {template.visit_count || "N/A"}
                  </span>
                  <span>复制</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateAppModal
        isOpen={isCreateAppModalOpen}
        onClose={() => setIsCreateAppModalOpen(false)}
        appId={selectedAppId}
        apptype={selectType}
      />
    </div>
  );
}
