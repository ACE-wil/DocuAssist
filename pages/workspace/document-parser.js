import React, { useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

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
  const [lastNodeId, setLastNodeId] = useState("1"); // 记录上一个节点的 ID

  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = { id: Date.now(), text: inputValue, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");

      // 使用 POST 方法发送请求
      axios
        .post("http://localhost:5000/api/chat", {
          message: inputValue, // 发送用户输入作为请求体
        })
        .then((response) => {
          const fullText = response.data.response; // 确保访问正确的响应字段
          const botMessage = {
            id: Date.now() + 1,
            text: "",
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);

          // 获取上一个节点的位置
          const lastNode = nodes.find((node) => node.id === lastNodeId);
          const newNodeId = `${Date.now()}`;
          const newNode = {
            id: newNodeId,
            data: { label: "" },
            position: {
              x: lastNode.position.x,
              y: lastNode.position.y + 100, // 在上一个节点的正下方
            },
            style: {
              width: "auto",
              maxWidth: "240px",
              height: "auto",
            }, // 设置宽度和高度
          };
          setNodes((prevNodes) => [...prevNodes, newNode]);

          // 创建边连接到上一个节点
          const newEdge = {
            id: `e${lastNodeId}-${newNodeId}`,
            source: lastNodeId,
            target: newNodeId,
          };
          setEdges((prevEdges) => [...prevEdges, newEdge]);

          // 更新上一个节点的 ID
          setLastNodeId(newNodeId);

          // 逐字显示文本
          let index = 0;
          const interval = setInterval(() => {
            if (index < fullText.length) {
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === botMessage.id
                    ? { ...msg, text: msg.text + fullText[index] }
                    : msg
                )
              );
              setNodes((prevNodes) =>
                prevNodes.map((node) =>
                  node.id === newNodeId
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          label: node.data.label + fullText[index],
                        },
                      }
                    : node
                )
              );
              index++;
            } else {
              clearInterval(interval);
            }
          }, 100); // 每100毫秒显示一个字
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
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
                    fontSize: "14px", // 字体大小
                    whiteSpace: "pre-wrap", // 自动换行
                  }}
                >
                  {node.data.label}
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
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <img
                src={
                  message.sender === "bot"
                    ? "/path/to/bot-avatar.png"
                    : "/path/to/user-avatar.png"
                }
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div
                style={{
                  backgroundColor:
                    message.sender === "bot" ? "#e0e0e0" : "#cfe9ff",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                  position: "relative",
                }}
              >
                {message.text}
                {message.sender === "bot" && (
                  <span
                    className="cursor"
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      backgroundColor: "#000",
                      marginLeft: "2px",
                      animation: "blink 1s step-end infinite",
                    }}
                  ></span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的消息..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentParser;
