import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from "reactflow";
import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "reactflow/dist/style.css";
import axios from "axios";
import CustomNode from "./CustomNode"; // 引入自定义节点组件
import CustomEdge from "./CustomEdge"; // 引入自定义连接线组件
import { style } from "@mui/system";
const { Prism: SyntaxHighlighter } = require("react-syntax-highlighter");
const {
  vscDarkPlus,
} = require("react-syntax-highlighter/dist/cjs/styles/prism");
import Modal from "react-modal"; // 确保安装了 react-modal
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });
const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "你好！有什么我可以帮助你的吗？" },
    position: { x: 0, y: 50 },
  },
  // 添加更多节点
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "custom" },
  // 添加更多连接线
];

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

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
  const [isListening, setIsListening] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [copySuccess, setCopySuccess] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sortedNodes, setSortedNodes] = useState([]);
  const [ReactJson, setReactJson] = useState(null);

  useEffect(() => {
    // 动态导入 react-json-view
    import("react-json-view").then((module) =>
      setReactJson(() => module.default)
    );
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "custom" }, eds)),
    [setEdges]
  );

  // 提取节点文本内容的辅助函数
  const extractTextFromNode = (node) => {
    if (typeof node === "string") {
      return node;
    } else if (node.props?.children) {
      if (Array.isArray(node.props.children)) {
        return node.props.children.map(extractTextFromNode).join(" ");
      } else {
        return extractTextFromNode(node.props.children);
      }
    }
    return "";
  };

  useEffect(() => {
    const nodeHeight = 150; // 假设每个节点的高度为150px
    const nodeWidth = 300; // 假设每个节点的宽度为300px
    const padding = 20; // 节点之间的间距

    const newNodes = chatHistory.map((message, index) => ({
      id: index.toString(),
      type: "custom", // 确保使用自定义节点类型
      data: {
        label: (
          <div
            style={{
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              width: "auto",
              height: "auto",
              maxHeight: "300px",
              maxWidth: "300px",
              overflow: "overlay",
              fontSize: "16px",
            }}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
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
              {message.content}
            </ReactMarkdown>
          </div>
        ),
      },
      position: {
        x: (index % 2) * (nodeWidth + padding), // 交替放置在两列
        y: Math.floor(index / 2) * (nodeHeight + padding), // 计算 y 坐标
      },
      style: {
        width: "auto",
        minWidth: "200px",
        maxWidth: "400px",
        backgroundColor: message.role === "assistant" ? "#f0f0f0" : "#e6f7ff",
        borderRadius: "12px",
      },
    }));

    const newEdges = chatHistory.slice(1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: index.toString(),
      target: (index + 1).toString(),
      type: "custom", // 使用自定义连接线类型
      style: {
        stroke: "#4a90e2",
        strokeWidth: 2,
      },
    }));

    setNodes(newNodes);
    setEdges(newEdges);

    // 深度优先遍历以排序节点
    const depthFirstTraversal = (nodes, edges, startNodeId) => {
      const sorted = [];
      const visited = new Set();
      const nodeMap = new Map(nodes.map((node) => [node.id, node]));

      const dfs = (nodeId) => {
        if (!visited.has(nodeId)) {
          visited.add(nodeId);
          sorted.push(nodeMap.get(nodeId));

          // 找到当前节点的所有目标节点并继续遍历
          const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
          outgoingEdges.forEach((edge) => dfs(edge.target));
        }
      };

      // 从指定的起始节点开始遍历
      dfs(startNodeId);

      return sorted;
    };

    const sorted = depthFirstTraversal(
      [...initialNodes, ...newNodes],
      [...initialEdges, ...newEdges],
      "0"
    );
    setSortedNodes(sorted);
    console.log(sorted);
  }, [chatHistory]);

  // 创建节点清理后的 JSON
  const cleanedNodes = nodes.map((node) => {
    if (node.data.name || node.data.action || node.data.output) {
      // 新增节点
      return {
        id: node.id,
        content: `节点标题：${node.data.name || "未命名"}，执行操作：${
          node.data.action || "无操作"
        }，输出格式：${node.data.output || "无输出"}`,
      };
    } else {
      // 原有节点
      return {
        id: node.id,
        content: node.data.label.props.children.props?.children || "内容不可用",
      };
    }
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      // 使 api/upload 接口上传并解析文件
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

    // 发消息和完整的对话历史到后端
    fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
        messages: chatHistory, // 送完整的对话历史
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

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "zh-CN"; // 设置语为中文

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("您的浏览器不支持语音识别功能");
    }
  };

  const onContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
  }, []);

  const addNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: "custom",
      data: {
        label: (
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              width: "auto",
              height: "auto",
              maxHeight: "300px",
              maxWidth: "300px",
              overflow: "overlay",
              fontSize: "14px",
              border: "1px solid #ccc",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                节点名称
              </label>
              <input
                type="text"
                placeholder="节点名称"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                onChange={(e) => handleInputChange(e, newNode.id, "name")}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>
                执行操作
              </label>
              <input
                type="text"
                placeholder="执行操作"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                onChange={(e) => handleInputChange(e, newNode.id, "action")}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                输出格式
              </label>
              <input
                type="text"
                placeholder="输出格式"
                style={{
                  width: "100%",
                  padding: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                onChange={(e) => handleInputChange(e, newNode.id, "output")}
              />
            </div>
          </div>
        ),
        name: "",
        action: "",
        output: "",
      },
      position: { x: contextMenu.x - 450, y: contextMenu.y - 180 },
      style: {
        width: "auto",
        minWidth: "200px",
        maxWidth: "400px",
        backgroundColor: "#e6f7ff",
        borderRadius: "12px",
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setContextMenu({ visible: false, x: 0, y: 0 });
  }, [nodes, contextMenu]);

  const handleInputChange = (event, nodeId, field) => {
    const value = event.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  // 添加导出节点功能
  const handleExportNodes = useCallback(() => {
    const exportData = {
      nodes: nodes,
      edges: edges,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow-nodes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handlePreviewNodes = () => {
    setIsPreviewOpen(true);
  };

  return (
    <ReactFlowProvider>
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
            position: "relative", // 添加相对定位
          }}
        >
          {/* 添加预览按钮 */}
          {!isPreviewOpen && (
            <button
              onClick={handlePreviewNodes}
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 999,
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d3748")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4a5568")}
            >
              <span>预览节点</span>
              <span style={{ fontSize: "16px" }}>👁️</span>
            </button>
          )}

          {/* 添加导出按钮 */}
          {!isPreviewOpen && (
            <button
              onClick={handleExportNodes}
              style={{
                position: "absolute",
                top: "20px",
                left: "160px", // 调整位置以避免重叠
                zIndex: 999,
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d3748")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4a5568")}
            >
              <span>导出节点</span>
              <span style={{ fontSize: "16px" }}>📥</span>
            </button>
          )}

          {/* 确保全屏按钮仍然存在 */}
          {!isPreviewOpen && (
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 999,
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d3748")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4a5568")}
            >
              <span>{isFullScreen ? "退出全屏" : "全屏"}</span>
              <span style={{ fontSize: "16px" }}>🔍</span>
            </button>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            onContextMenu={onContextMenu}
            style={{
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
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
                      position: "relative",
                      backgroundColor:
                        message.role === "assistant"
                          ? "rgba(247, 247, 248, 0.9)"
                          : "rgba(25, 195, 125, 0.1)",
                      padding: "12px 16px 16px 16px",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      maxHeight: "300px",
                      overflow: "overlay",
                    }}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.role === "assistant" && (
                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard
                              .writeText(message.content)
                              .then(() => {
                                setCopySuccess(index);
                                setTimeout(() => {
                                  setCopySuccess(null);
                                }, 1500);
                              })
                              .catch((err) => {
                                console.error("复制失败:", err);
                                alert("复制失败，请重试");
                              });
                          }}
                          onMouseEnter={() => setHoveredButton(`copy-${index}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor:
                              hoveredButton === `copy-${index}` ||
                              copySuccess === index
                                ? "#e6f7ff"
                                : "#f0f0f0",
                            border: `1px solid ${
                              hoveredButton === `copy-${index}` ||
                              copySuccess === index
                                ? "#91d5ff"
                                : "#ddd"
                            }`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color:
                              hoveredButton === `copy-${index}`
                                ? "#1890ff"
                                : "#8a8a8a",
                            position: "relative",
                            transition: "all 0.2s ease",
                            transform:
                              copySuccess === index
                                ? "scale(1.05)"
                                : "scale(1)",
                          }}
                        >
                          <img
                            src={
                              hoveredButton === `copy-${index}` ||
                              copySuccess === index
                                ? "/icons/copy-o.png"
                                : "/icons/copy.png"
                            }
                            alt="copy"
                            style={{
                              width: "14px",
                              height: "14px",
                              opacity:
                                hoveredButton === `copy-${index}` ? 0.8 : 0.6,
                              transition: "all 0.2s ease",
                              transform:
                                copySuccess === index
                                  ? "rotate(360deg)"
                                  : "rotate(0)",
                            }}
                          />
                          {copySuccess === index ? "✨ 已复制 ✨" : "复制"}
                        </button>
                        <button
                          onClick={() => {
                            // 重试逻辑保持不变
                            const previousMessages = chatHistory.slice(
                              0,
                              index
                            );
                            setChatHistory(previousMessages);
                            if (
                              index > 0 &&
                              chatHistory[index - 1].role === "user"
                            ) {
                              fetch("http://localhost:5000/api/chat", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  message: chatHistory[index - 1].content,
                                  messages: previousMessages,
                                }),
                              })
                                .then((response) => response.json())
                                .then((data) => {
                                  const assistantMessage = {
                                    role: "assistant",
                                    content: data.response,
                                  };
                                  setChatHistory((prev) => [
                                    ...prev,
                                    assistantMessage,
                                  ]);
                                })
                                .catch((error) => {
                                  console.error("Error:", error);
                                  alert("重试失败，请重试");
                                });
                            }
                          }}
                          onMouseEnter={() =>
                            setHoveredButton(`retry-${index}`)
                          }
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor:
                              hoveredButton === `retry-${index}`
                                ? "#e6f7ff"
                                : "#f0f0f0",
                            border: `1px solid ${
                              hoveredButton === `retry-${index}`
                                ? "#91d5ff"
                                : "#ddd"
                            }`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color:
                              hoveredButton === `retry-${index}`
                                ? "#1890ff"
                                : "#8a8a8a",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <img
                            src={
                              hoveredButton === `retry-${index}`
                                ? "/icons/retry-o.png"
                                : "/icons/retry.png"
                            }
                            alt="retry"
                            style={{
                              width: "14px",
                              height: "14px",
                              opacity:
                                hoveredButton === `retry-${index}` ? 0.8 : 0.6,
                              transition: "all 0.2s ease",
                            }}
                          />
                          重试
                        </button>
                      </div>
                    )}
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
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "6px",
                    }}
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
              <button
                onClick={startListening}
                style={{
                  padding: "8px",
                  marginRight: "12px",
                  backgroundColor: isListening ? "#19c37d" : "transparent",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <img
                  src={
                    isListening
                      ? "/icons/microphone-listen.png"
                      : "/icons/microphone.png"
                  }
                  alt="Voice Input"
                  style={{
                    width: "24px",
                    height: "24px",
                    opacity: isListening ? 1 : 0.6,
                  }}
                />
              </button>
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
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            padding: "8px",
          }}
        >
          <button
            onClick={addNode}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.2s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#357ABD")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4a90e2")}
          >
            添加节点
          </button>
        </div>
      )}

      {/* 预览模态框 */}
      <Modal
        isOpen={isPreviewOpen}
        onRequestClose={() => setIsPreviewOpen(false)}
        contentLabel="节点预览"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "80%",
            overflow: "auto",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>节点预览</h2>
        {ReactJson && (
          <>
            <h3>原始 JSON:</h3>
            <ReactJson
              src={{ nodes, edges }}
              theme="monokai"
              collapsed={2}
              enableClipboard={false}
              displayDataTypes={false}
              style={{
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "#2d2d2d",
                color: "#f8f8f2",
                marginBottom: "20px",
              }}
            />
            <h3>节点清理后的 JSON:</h3>
            <ReactJson
              src={{ nodes: cleanedNodes, edges }}
              theme="monokai"
              collapsed={2}
              enableClipboard={false}
              displayDataTypes={false}
              style={{
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "#2d2d2d",
                color: "#f8f8f2",
              }}
            />
          </>
        )}
        <h3>排序后的节点顺序:</h3>
        <ul>
          {sortedNodes.map((node) => (
            <li key={node?.id} style={{ marginBottom: "10px" }}>
              {node?.data &&
              (node.data.name || node.data.action || node.data.output)
                ? `节点标题：${node.data.name || "未命名"}，执行操作：${
                    node.data.action || "无操作"
                  }，输出格式：${node.data.output || "无输出"}`
                : node?.data?.label?.props?.children?.props?.children ||
                  "内容不可用"}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsPreviewOpen(false)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#357ABD")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#4a90e2")}
        >
          关闭
        </button>
      </Modal>
    </ReactFlowProvider>
  );
}

export default DocumentParser;
