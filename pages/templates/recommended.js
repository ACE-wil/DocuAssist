import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import styles from "@/styles/recommended.module.css";

export default function RecommendedTemplates() {
  const dispatch = useDispatch();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // 获取应用数据
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/get-apps");
        setTemplates(response.data.applications);
      } catch (error) {
        console.error("获取应用数据失败:", error);
      } finally {
        // 组件挂载后关闭 loading
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      <h1>模板</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates.map((template, index) => (
          <div key={index} className={styles.template}>
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
                  ></img>
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
                  {template.copies || "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
