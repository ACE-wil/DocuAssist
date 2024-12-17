import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import ReactMarkdown from "react-markdown";
import "reactflow/dist/style.css";
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
  collapseAllNested,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import axios from "axios";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from "reactflow";
import CustomNode from "./CustomNode"; // 引入自定义节点组件
import CustomEdge from "./CustomEdge"; // 引入自定义连接线组件
// import { style } from "@mui/system";
const { Prism: SyntaxHighlighter } = require("react-syntax-highlighter");
const {
  vscDarkPlus,
} = require("react-syntax-highlighter/dist/cjs/styles/prism");
import Modal from "react-modal"; // 确保安装了 react-modal
import dynamic from "next/dynamic";
import { setNavExpand } from "@/store/navigationSlice";
import { Input } from "antd";

const { TextArea } = Input;

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
  const [inputHasChanged, setInputHasChanged] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sortedNodes, setSortedNodes] = useState([]);
  const [edgesChange, setEdgesChange] = useState(false);
  const [edgesInfo, setEdgesInfo] = useState([]); // 初始化 edgesInfo 状态
  const [showEmptyNode, setShowEmptyNode] = useState(true);
  const [nodeCounter, setNodeCounter] = useState(0); // 用于生成唯一节点ID的计数器
  const [isLoading, setIsLoading] = useState(false); // 确保 isLoading 状态存在
  const [streamingContent, setStreamingContent] = useState(""); // 新增状态用于流式输出
  const [isStreaming, setIsStreaming] = useState(false); // 新增状态用于控制流式输出
  const navExpand = useSelector((state) => state.navigation.navExpand);
  const dispatch = useDispatch();
  const [nodeHistory, setNodeHistory] = useState([]); // 新增状态用于存储节点历史
  const [nodeLightColor, setNodeLightColor] = useState({});
  const [currentRunNodeId, setCurrentRunNodeId] = useState(null); // 当前运行的节点
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
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
    const newNodes = []; // 使用其他数据源来生成节点
    setNodes(newNodes);
  }, []); // 确保依赖项中没有 chatHistory

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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
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

  const handleNodeAction = (nodeData) => {
    console.log("Node action triggered:", nodeData);
    setInputValue(
      `节点名称：${nodeData.name}，执行操作：${nodeData.action}，输出格式：${nodeData.output}`
    );
    setCurrentRunNodeId(nodeData.nodeId);
    setInputHasChanged(!inputHasChanged);
  };

  useEffect(() => {
    handleSendMessage();
  }, [inputHasChanged]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: "user",
      content: inputValue,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true); // 开始加载动画

    // 发消息和完整的对话历史到后端
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
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
        setIsStreaming(true); // 开始流式输出
        streamAssistantMessage(assistantMessage.content);
        setChatHistory((prev) => [...prev, assistantMessage]);
        setInputValue("");
        setIsLoading(false);
        setNodeLightColor((colors) => ({
          ...colors,
          [currentRunNodeId]: "#5EC29D", // 成功为绿色，失败为红色
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("发送失败，请重试");
        setNodeLightColor((colors) => ({
          ...colors,
          [currentRunNodeId]: "#D96A79", // 成功为绿色，失败为红色
        }));
        setIsLoading(false);
      });
  };

  const streamAssistantMessage = (content) => {
    let index = 0;
    setStreamingContent(""); // 清空流式内容
    const interval = setInterval(() => {
      if (index < content.length) {
        setStreamingContent((prev) => prev + content[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false); // 结束流式输出
      }
    }, 50); // 每50毫秒输出一个字符
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undoLastNode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nodes]);

  const undoLastNode = () => {
    setNodes((prevNodes) => {
      if (prevNodes.length === 0) return prevNodes;
      const newNodes = [...prevNodes];
      newNodes.pop(); // 移除最后一个节点
      return newNodes;
    });
  };

  const addNode = useCallback(
    (event) => {
      event.preventDefault();
      const newNodeId = `chat-${nodeCounter}`;
      const newNode = {
        id: newNodeId,
        type: "custom",
        data: {
          label: (
            <div
              // contentEditable
              suppressContentEditableWarning
              style={{
                padding: "2px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                width: "330px",
                height: "200px",
                // maxHeight: "300px",
                // maxWidth: "300px",
                overflow: "hidden",
                fontSize: "14px",
                // border: "1px solid #ccc",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "30px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "330px",
                    lineHeight: "30px",
                    marginTop: "2px",
                  }}
                >
                  <label
                    style={{
                      width: "60px",
                      margin: "0 8px 0 7px",
                      color: "#3B3B3B",
                    }}
                  >
                    节点名称
                  </label>
                  <input
                    type="text"
                    placeholder="节点名称"
                    style={{
                      width: "240px",
                      padding: "6px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
                    onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                    onChange={(e) => handleInputChange(e, newNodeId, "name")}
                  />
                </div>
              </div>
              <div style={{ borderTop: "1px solid #ddd" }}></div>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                {/* <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    margin: "0 5px",
                    width: "85px",
                    color: "#3B3B3B",
                  }}
                >
                  执行操作
                </label> */}
                <TextArea
                  placeholder="执行操作"
                  autoSize={{ minRows: 4, maxRows: 4 }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4a90e2";
                    e.target.style.boxShadow =
                      "0 0 5px rgba(74, 144, 226, 0.5)"; // 添加聚焦时的阴影
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ddd";
                    e.target.style.boxShadow = "none"; // 移除失焦时的阴影
                  }}
                  onChange={(e) => handleInputChange(e, newNodeId, "action")}
                />
              </div>
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    width: "60px",
                    margin: "0 8px 0 7px",
                    color: "#3B3B3B",
                  }}
                >
                  输出格式
                </label>
                <select
                  style={{
                    width: "260px",
                    padding: "6px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginBottom: "8px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    color: "#3B3B3B",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  onChange={(e) => handleInputChange(e, newNodeId, "output")}
                  defaultValue="json"
                >
                  <option value="">选择输出格式</option>
                  <option value="json">JSON</option>
                  {/* <option value="xml">XML</option> */}
                  <option value="csv">CSV</option>
                  <option value="text">文本</option>
                </select>
              </div>
            </div>
          ),
          name: "",
          action: "",
          output: "",
          nodeId: newNodeId,
        },
        position: { x: event.clientX, y: event.clientY },
        style: {
          width: "auto",
          minWidth: "200px",
          maxWidth: "400px",
          backgroundColor: "#e6f7ff",
          borderRadius: "12px",
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeLightColor((colors) => ({
        ...colors,
        [newNodeId]: "#4a90e2", // 默认颜色为蓝色
      }));
      setNodeHistory((history) => [...history, newNode]); // 将新节点添加到历史记录
      setShowEmptyNode(false);
      setNodeCounter((count) => count + 1);
    },
    [nodeCounter]
  );

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
    console.log("Nodes before preview:", nodes);
    console.log("Cleaned Nodes before preview:", cleanedNodes);
    setIsPreviewOpen(true);
  };

  // 在组件挂载时设置应用程序元素
  useEffect(() => {
    Modal.setAppElement("#__next"); // 假设你使用的是 Next.js，根元素是 #__next
  }, []);

  // 定义一个空节点
  const emptyNode = {
    id: "empty-node",
    type: "custom",
    data: {
      label: (
        <div style={{ marginBottom: "10px" }}>
          你还没有创建过节点喔，快来创建你的节点吧！
        </div>
      ),
    },
    position: { x: 490, y: 410 },
  };

  const renderMarkdown = (content) => (
    <ReactMarkdown
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={{
                ...vscDarkPlus,
                'pre[class*="language-"]': {
                  ...vscDarkPlus['pre[class*="language-"]'],
                  borderRadius: "8px", // 设置圆角
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
    />
  );

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
            nodes={
              !showEmptyNode
                ? nodes.map((node) => ({
                    ...node,
                    data: {
                      ...node.data,
                      onNodeAction: handleNodeAction, // 传递回调函数
                      color: nodeLightColor[node.id] || "blue",
                    },
                  }))
                : [emptyNode]
            } // 条件渲染节点
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
            className="dialog-container"
            style={{
              flex: 1,
              minWidth: "25vw",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              margin: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              maxWidth: isUploading ? "35vw" : "30vw",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "auto",
                marginBottom: "10px",
                padding: "10px",
                position: "relative", // 确保加载动画在对话框内
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
                      maxWidth: "85%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                      maxHeight: "300px",
                      overflow: "overlay",
                    }}
                  >
                    {message.role === "assistant" ? (
                      isStreaming && index === chatHistory.length - 1 ? (
                        renderMarkdown(streamingContent)
                      ) : (
                        renderMarkdown(message.content)
                      )
                    ) : (
                      <p>{message.content}</p>
                    )}
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
                            if (
                              navigator.clipboard &&
                              navigator.clipboard.writeText
                            ) {
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
                            } else {
                              // 使用 document.execCommand 作为降级方案
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = message.content;
                              document.body.appendChild(textArea);
                              textArea.select();
                              try {
                                document.execCommand("copy");
                                setCopySuccess(index);
                                setTimeout(() => {
                                  setCopySuccess(null);
                                }, 1500);
                              } catch (err) {
                                console.error("复制失败:", err);
                                alert("复制失败，请重试");
                              }
                              document.body.removeChild(textArea);
                            }
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
                            setIsLoading(true);
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
                              fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    message: chatHistory[index - 1].content,
                                    messages: previousMessages,
                                  }),
                                }
                              )
                                .then((response) => response.json())
                                .then((data) => {
                                  setIsLoading(false);
                                  const assistantMessage = {
                                    role: "assistant",
                                    content: data.response,
                                  };
                                  setIsStreaming(true); // 开始流式输出
                                  streamAssistantMessage(
                                    assistantMessage.content
                                  );
                                  setChatHistory((prev) => [
                                    ...prev,
                                    assistantMessage,
                                  ]);
                                })
                                .catch((error) => {
                                  setIsLoading(false);
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
              {isLoading && (
                <div
                  className="loader"
                  style={{
                    width: "35px",
                    height: "35px",
                    left: "45%",
                    margin: "40px 0px",
                  }}
                ></div>
              )}
            </div>

            <div
              className="dialog-input-container"
              style={{
                display: "flex",
                width: "100%",
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
                  width: "calc(100%)",
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
                  backgroundColor: "#4a90e2",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "35px",
                  fontSize: "20px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#357ABD";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#4a90e2";
                  e.target.style.transform = "scale(1)";
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = "scale(1.05)";
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
            left: `calc(${
              navExpand ? contextMenu.x - 305 : contextMenu.x - 105
            }px)`,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            padding: "8px",
          }}
        >
          <button
            onClick={(e) => addNode(e)}
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
        <>
          <h3>原始 JSON:</h3>
          <JsonView
            data={{ nodes, edges }}
            shouldExpandNode={collapseAllNested}
            style={defaultStyles}
          />
          <h3>节点清理后的 JSON:</h3>
          <JsonView
            data={{ nodes: cleanedNodes, edges }}
            shouldExpandNode={collapseAllNested}
            style={darkStyles}
          />
        </>

        <h3>连接线信息:</h3>
        <ul>
          {edgesInfo &&
            edgesInfo.map((edge, index) => (
              <li key={index}>
                Source: {edge.source}, Target: {edge.target}
              </li>
            ))}
        </ul>
        <h3>排序后的节点顺序:</h3>
        <ul>
          {edgesInfo.map((edge, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {`Source: ${edge.source}, Target: ${edge.target}`}
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
