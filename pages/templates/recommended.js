import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

const templates = [
  {
    title: "知乎应用搭建快速入门",
    description: "通过两个简单的应用案例，帮你快速上手知乎的应用搭建。",
    copies: "5.3K 复制",
    price: "免费",
    image: "/GPT-3.5.png",
  },
  {
    title: "智能搜索",
    description: "利用应用搜索插件和大模型，智能总结互联网信息。",
    copies: "882 复制",
    price: "免费",
    image: "/GPT-3.5.png",
  },
  {
    title: "智能搜索",
    description: "利用应用搜索插件和大模型，智能总结互联网信息。",
    copies: "882 复制",
    price: "免费",
    image: "/GPT-3.5.png",
  },
  {
    title: "智能搜索",
    description: "利用应用搜索插件和大模型，智能总结互联网信息。",
    copies: "882 复制",
    price: "免费",
    image: "/GPT-3.5.png",
  },
  {
    title: "智能搜索",
    description: "利用应用搜索插件和大模型，智能总结互联网信息。",
    copies: "882 复制",
    price: "免费",
    image: "/GPT-3.5.png",
  },
  // 添加更多模板...
];

export default function RecommendedTemplates() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div style={{ padding: "10px 20px 20px 20px" }}>
      <h1>模板</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {templates.map((template, index) => (
          <div
            key={index}
            style={{
              width: "calc(25% - 20px)",
              border: "1px solid #ddd",
              borderRadius: "15px",
              overflow: "hidden",
              padding: "12px",
              backgroundColor: "#fff",
              cursor: "pointer",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            }}
          >
            <img
              src={template.image}
              alt={template.title}
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
                {template.title}
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
                {template.description}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div>{template.price}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#06070980",
                    lineHeight: "30px",
                  }}
                >
                  {template.copies}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
