import React, { useState, useEffect } from "react";
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
    }, // 初始宽度和高度
  },
];

const initialEdges = [];

function DocumentParser() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [messages, setMessages] = useState([
    { id: 1, text: "你好！有什么我可以帮助你的吗？", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [lastNodeId, setLastNodeId] = useState("1");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // 添加用户消息到对话
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 准备发送的数据
    if (uploadedFileName) {
      // 如果有文件，使用 FormData
      const formData = new FormData();
      formData.append("file", document.getElementById("file-upload").files[0]);

      axios
        .post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        })
        .then((response) => {
          const botMessage = {
            id: Date.now() + 1,
            text: response.data.parsedContent,
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setInputValue("");
          setIsUploading(false);
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setIsUploading(false);
          setUploadProgress(0);
          alert("文件上传失败，请重试");
        });
    } else {
      // 如果没有文件，使用普通的聊天接口
      axios
        .post("http://localhost:5000/api/chat", { message: inputValue })
        .then((response) => {
          const botMessage = {
            id: Date.now() + 1,
            text: response.data.response,
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setInputValue("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          alert("发送消息失败，请重试");
        });
    }
  };

  const handleNodeLabelChange = (id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name); // 设置上传的文件名
      setIsUploading(true); // 开始上传
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        })
        .then((response) => {
          const parsedContent = response.data.parsedContent || "";
          const botMessage = {
            id: Date.now() + 1,
            text: parsedContent,
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);

          // Add a new node for the parsed content
          const lastNode = nodes.find((node) => node.id === lastNodeId);
          const newNodeId = `${Date.now()}`;
          const newNode = {
            id: newNodeId,
            data: { label: parsedContent },
            position: {
              x: lastNode.position.x,
              y: lastNode.position.y + 100,
            },
            style: {
              width: "auto",
              maxWidth: "320px",
              maxHeight: "300px",
              height: "auto",
              overflow: "scroll",
            },
          };
          setNodes((prevNodes) => [...prevNodes, newNode]);

          const newEdge = {
            id: `e${lastNodeId}-${newNodeId}`,
            source: lastNodeId,
            target: newNodeId,
          };
          setEdges((prevEdges) => [...prevEdges, newEdge]);

          setLastNodeId(newNodeId);
          setIsUploading(false); // 上传完成
          setUploadProgress(0); // 重置进度
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setIsUploading(false);
          setUploadProgress(0);
          // 可以添加错误提示
          alert("文件上传失败，请重试");
        });
    }
  };

  const handleClearFile = () => {
    setUploadedFileName("");
    setUploadProgress(0);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "95vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ flex: 2, borderRight: "1px solid #ddd", padding: "10px" }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              label: (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    fontSize: "14px",
                    whiteSpace: "normal",
                    textAlign: "left",
                    padding: "5px",
                    margin: "0",
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
                              },
                            }}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {node.data.label}
                  </ReactMarkdown>
                </div>
              ),
            },
          }))}
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
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "20px",
                flexDirection:
                  message.sender === "user" ? "row-reverse" : "row",
              }}
            >
              <img
                src={message.sender === "bot" ? "/logo.png" : "/avatar.png"}
                alt="avatar"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  margin:
                    message.sender === "user" ? "0 0 0 12px" : "0 12px 0 0",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <div
                style={{
                  backgroundColor:
                    message.sender === "bot"
                      ? "rgba(247, 247, 248, 0.9)"
                      : "rgba(25, 195, 125, 0.1)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  maxWidth: "80%",
                  maxHeight: "300px",
                  overflowY: "scroll",
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
                  {message.text}
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
                上传中: {uploadProgress}%
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
                    width: `${uploadProgress}%`,
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
                onClick={handleClearFile}
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
    </div>
  );
}

export default DocumentParser;
