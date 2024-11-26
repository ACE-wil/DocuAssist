import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "reactflow/dist/style.css";
import axios from "axios";
const { Prism: SyntaxHighlighter } = require("react-syntax-highlighter");
const {
  vscDarkPlus,
} = require("react-syntax-highlighter/dist/cjs/styles/prism");

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "你好！有什么我可以帮助你的吗？" },
    position: { x: 0, y: 50 },
    style: {
      width: "auto",
      height: "auto",
    },
  },
];

const initialEdges = [];

function DocumentParser() {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "你好！我是你的文档助手，请上传文件或直接开始对话。",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  useEffect(() => {
    const newNodes = chatHistory.map((message, index) => ({
      id: index.toString(),
      type: "default",
      data: { label: message.content },
      position: { x: 0, y: index * 100 },
      style: {
        width: "auto",
        maxHeight: "300px",
        overflow: "hidden",
        backgroundColor: message.role === "assistant" ? "#f0f0f0" : "#e6f7ff",
      },
    }));

    const newEdges = chatHistory.slice(1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: index.toString(),
      target: (index + 1).toString(),
      type: "smoothstep",
      style: {
        width: "auto",
        maxHeight: "300px",
      },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [chatHistory]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      // 使用 api/upload 接口上传并解析文件
      fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // 将文件解析结果添加到对话历史
          const userMessage = {
            role: "user",
            content: `上传文件：${file.name}`,
          };
          const assistantMessage = {
            role: "assistant",
            content: data.parsedContent,
          };
          setChatHistory((prev) => [...prev, userMessage, assistantMessage]);
          setIsUploading(false);
          setUploadedFileName(""); // 清除文件状态，准备开始聊天
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsUploading(false);
          alert("上传失败，请重试");
        });
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
    };
    setChatHistory((prev) => [...prev, userMessage]);

    // 发送消息和完整的对话历史到后端
    fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
        messages: chatHistory, // 发送完整的对话历史
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const assistantMessage = {
          role: "assistant",
          content: data.response,
        };
        setChatHistory((prev) => [...prev, assistantMessage]);
        setInputValue("");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("发送失败，请重试");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "95vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          flex: isFullScreen ? 1 : 2,
          borderRight: "1px solid #ddd",
          padding: "10px",
          transition: "flex 0.3s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: isFullScreen ? "20px" : "52%",
            zIndex: 999,
            transition: "right 0.3s ease",
          }}
        >
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "background-color 0.2s ease",
            }}
          >
            {isFullScreen ? (
              <>
                <span>退出全屏</span>
                <span style={{ fontSize: "16px" }}>⇲</span>
              </>
            ) : (
              <>
                <span>全屏</span>
                <span style={{ fontSize: "16px" }}>⇱</span>
              </>
            )}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ background: "#f0f0f0", borderRadius: "8px" }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {!isFullScreen && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            margin: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "auto",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                  flexDirection:
                    message.role === "user" ? "row-reverse" : "row",
                }}
              >
                <img
                  src={
                    message.role === "assistant" ? "/logo.png" : "/avatar.png"
                  }
                  alt="avatar"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    margin:
                      message.role === "user" ? "0 0 0 12px" : "0 12px 0 0",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <div
                  style={{
                    backgroundColor:
                      message.role === "assistant"
                        ? "rgba(247, 247, 248, 0.9)"
                        : "rgba(25, 195, 125, 0.1)",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    height: "auto",
                    maxWidth: "80%",
                    maxHeight: "300px",
                    overflow: "auto",
                    position: "relative",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={{
                              ...vscDarkPlus,
                              'pre[class*="language-"]': {
                                ...vscDarkPlus['pre[class*="language-"]'],
                                borderRadius: "8px",
                                margin: "10px 0",
                              },
                            }}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className={className}
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "rgba(247, 247, 248, 0.9)",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            {!isUploading && !uploadedFileName && (
              <label
                htmlFor="file-upload"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  padding: "8px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <img
                  src="/icons/file.png"
                  alt="Upload"
                  style={{
                    width: "24px",
                    height: "24px",
                    opacity: 0.6,
                    transition: "opacity 0.2s ease",
                  }}
                />
              </label>
            )}
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            {isUploading && (
              <div style={{ marginRight: "12px" }}>
                <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                  上传中: {isUploading ? "100%" : "0%"}
                </div>
                <div
                  style={{
                    width: "100px",
                    height: "4px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${isUploading ? "100%" : "0%"}`,
                      height: "100%",
                      backgroundColor: "#19c37d",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}
            {uploadedFileName && !isUploading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  backgroundColor: "rgba(25, 195, 125, 0.1)",
                  borderRadius: "6px",
                  marginRight: "12px",
                  fontSize: "12px",
                }}
              >
                <img
                  src="/icons/file.png"
                  alt="File"
                  style={{ width: "16px", height: "16px", marginRight: "6px" }}
                />
                <span style={{ marginRight: "6px" }}>{uploadedFileName}</span>
                <button
                  onClick={() => {
                    setUploadedFileName("");
                    setIsUploading(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0 4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      color: "#ff4d4f",
                    },
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的消息..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                marginRight: "12px",
                fontSize: "14px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                outline: "none",
                backgroundColor: "#fff",
                "&:focus": {
                  borderColor: "#19c37d",
                  boxShadow: "0 0 0 2px rgba(25, 195, 125, 0.2)",
                },
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#19c37d",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#15a367",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              ⮞
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentParser;
