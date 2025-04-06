import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { FiSend, FiRefreshCw, FiDownload, FiCopy } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";

// 动态导入Sandpack组件以避免SSR问题
const DynamicSandpack = dynamic(
  () => import("@codesandbox/sandpack-react").then((mod) => mod.Sandpack),
  { ssr: false, loading: () => <div>加载编辑器中...</div> }
);

const initialCode = {
  "/App.js": `export default function App() {
  return (
    <div className="app-container">
      <h1>游戏沙盒</h1>
      <p>在左侧聊天框中输入您的需求，AI将为您生成代码</p>
    </div>
  );
}`,
  "/styles.css": `body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}`,
};

// 在组件内添加模型选择状态
export default function GameSandbox() {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(initialCode);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "您好！请告诉我您想要创建什么样的应用？" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [codeHistory, setCodeHistory] = useState([initialCode]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const chatContainerRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("qwen"); // 添加模型选择状态

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    // 聊天自动滚动到底部
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 智能代码生成函数
  const generateCode = async (prompt) => {
    setIsGenerating(true);

    try {
      // 步骤1: 分析用户需求
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "正在分析您的需求...",
        },
      ]);

      // 启动API请求，但不等待它完成
      const apiPromise = fetchCodeFromAPI(prompt, chatMessages, selectedModel);

      // 异步显示各个步骤的消息
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 步骤2: 生成代码框架
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "正在设计应用结构...",
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 步骤3: 生成应用逻辑
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "正在生成应用逻辑...",
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 步骤4: 设计界面样式
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "正在设计界面样式...",
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 步骤5: 优化代码
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "正在优化代码...",
        },
      ]);

      // 等待API响应完成
      const data = await apiPromise;

      // 处理API返回的代码
      let appJsCode = "";
      const appJsMatch =
        data.response.match(/```jsx\s*([\s\S]*?)\s*```/) ||
        data.response.match(/```javascript\s*([\s\S]*?)\s*```/) ||
        data.response.match(/```js\s*([\s\S]*?)\s*```/);

      let cssCode = "";
      const cssMatch = data.response.match(/```css\s*([\s\S]*?)\s*```/);

      if (appJsMatch && appJsMatch[1] && cssMatch && cssMatch[1]) {
        appJsCode = appJsMatch[1];
        cssCode = cssMatch[1];

        // 设置完整代码
        const newCode = {
          "/App.js": appJsCode,
          "/styles.css": cssCode,
        };

        setFiles(newCode);

        // 添加到历史记录
        setCodeHistory((prev) => [...prev.slice(0, historyIndex + 1), newCode]);
        setHistoryIndex(historyIndex + 1);

        // 完成并通知用户
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "已为您生成代码，请查看右侧预览。您可以继续提问或要求修改。",
          },
        ]);
      } else {
        throw new Error("无法解析代码");
      }
    } catch (error) {
      console.error("代码生成出错:", error);

      // 添加错误消息并说明正在尝试备用方案
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，代码生成过程中遇到了问题。正在尝试备用方案...",
        },
      ]);

      // 使用备用方案
      await fallbackCodeGeneration(prompt);
    } finally {
      setIsGenerating(false);
    }
  };

  // 新增：从API获取代码的函数
  const fetchCodeFromAPI = async (prompt, chatMessages, selectedModel) => {
    const apiEndpoint =
      selectedModel === "qwen"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat-qwen`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/chat`;

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 修改请求参数格式，适配千问API
        messages: [
          ...chatMessages.filter(
            (msg) =>
              !msg.content.includes("正在") &&
              !msg.content.includes("已为您生成代码")
          ),
          {
            role: "user",
            content: `请根据以下需求生成React代码：${prompt}。
        请按照以下格式返回React代码，返回App.js和styles.css：
        1. App.js代码：\`\`\`jsx\n代码内容\n\`\`\`
        2. styles.css代码：\`\`\`css\n代码内容\n\`\`\``,
          },
        ],
      }),
    });

    return await response.json();
  };

  // 本地代码生成备用方案
  const fallbackCodeGeneration = async (prompt) => {
    // 现有代码保持不变
    let newCode = {};

    if (prompt.includes("计算器")) {
      newCode = {
        "/App.js": `import { useState } from "react";
import "./styles.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  
  const handleNumber = (number) => {
    if (display === "0") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };
  
  const handleOperator = (operator) => {
    setEquation(display + " " + operator + " ");
    setDisplay("0");
  };
  
  const calculate = () => {
    const result = eval(equation + display);
    setDisplay(result.toString());
    setEquation("");
  };
  
  const clear = () => {
    setDisplay("0");
    setEquation("");
  };
  
  return (
    <div className="calculator">
      <div className="equation">{equation}</div>
      <div className="display">{display}</div>
      <div className="buttons">
        <button onClick={clear}>C</button>
        <button onClick={() => handleNumber("7")}>7</button>
        <button onClick={() => handleNumber("8")}>8</button>
        <button onClick={() => handleNumber("9")}>9</button>
        <button onClick={() => handleOperator("/")}>/</button>
        <button onClick={() => handleNumber("4")}>4</button>
        <button onClick={() => handleNumber("5")}>5</button>
        <button onClick={() => handleNumber("6")}>6</button>
        <button onClick={() => handleOperator("*")}>×</button>
        <button onClick={() => handleNumber("1")}>1</button>
        <button onClick={() => handleNumber("2")}>2</button>
        <button onClick={() => handleNumber("3")}>3</button>
        <button onClick={() => handleOperator("-")}>-</button>
        <button onClick={() => handleNumber("0")}>0</button>
        <button onClick={() => handleNumber(".")}>.</button>
        <button onClick={calculate}>=</button>
        <button onClick={() => handleOperator("+")}>+</button>
      </div>
    </div>
  );
}`,
        "/styles.css": `.calculator {
  width: 300px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.display {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 24px;
  height: 40px;
}

.equation {
  color: #666;
  text-align: right;
  padding: 5px;
  height: 20px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

button {
  padding: 15px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background-color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
}`,
      };
    } else if (prompt.includes("时钟")) {
      newCode = {
        "/App.js": `import { useState, useEffect } from "react";
import "./styles.css";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const secondDegrees = seconds * 6;
  
  return (
    <div className="clock-container">
      <div className="clock">
        <div className="hour-hand" style={{ transform: \`rotate(\${hourDegrees}deg)\` }}></div>
        <div className="minute-hand" style={{ transform: \`rotate(\${minuteDegrees}deg)\` }}></div>
        <div className="second-hand" style={{ transform: \`rotate(\${secondDegrees}deg)\` }}></div>
        <div className="center-point"></div>
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="hour-marker"
            style={{ transform: \`rotate(\${i * 30}deg)\` }}
          ></div>
        ))}
      </div>
      <div className="digital-time">
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
}`,
        "/styles.css": `.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.clock {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.hour-hand, .minute-hand, .second-hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
}

.hour-hand {
  width: 8px;
  height: 80px;
  background-color: black;
  border-radius: 4px;
  margin-left: -4px;
}

.minute-hand {
  width: 6px;
  height: 110px;
  background-color: #333;
  border-radius: 3px;
  margin-left: -3px;
}

.second-hand {
  width: 2px;
  height: 130px;
  background-color: red;
  margin-left: -1px;
}

.center-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #333;
  transform: translate(-50%, -50%);
}

.hour-marker {
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: #333;
  left: 50%;
  top: 10px;
  transform-origin: bottom center;
  margin-left: -1px;
}

.digital-time {
  margin-top: 20px;
  font-size: 24px;
  font-family: monospace;
}`,
      };
    } else {
      // 默认返回一个简单的应用
      newCode = {
        "/App.js": `import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <h1>您的应用</h1>
      <p>基于您的需求: "${prompt}"</p>
      <p>请提供更多细节，例如"创建一个计算器"或"创建一个时钟"</p>
    </div>
  );
}`,
        "/styles.css": `.app {
  font-family: sans-serif;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
}`,
      };
    }

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFiles(newCode);

    // 添加到历史记录
    setCodeHistory((prev) => [...prev.slice(0, historyIndex + 1), newCode]);
    setHistoryIndex(historyIndex + 1);

    setIsGenerating(false);

    // 添加AI回复
    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `已为您生成${
          prompt.includes("计算器")
            ? "计算器"
            : prompt.includes("时钟")
            ? "时钟"
            : ""
        }应用代码，请查看右侧预览。`,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;

    // 添加用户消息
    const newMessage = { role: "user", content: userInput };
    setChatMessages((prev) => [...prev, newMessage]);

    // 清空输入框
    setUserInput("");

    // 生成代码
    await generateCode(userInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 撤销操作
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFiles(codeHistory[historyIndex - 1]);
    }
  };

  // 重做操作
  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setFiles(codeHistory[historyIndex + 1]);
    }
  };

  // 复制代码
  const handleCopyCode = () => {
    const code = files[activeFile];
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("代码已复制到剪贴板");
      })
      .catch((err) => {
        console.error("复制失败:", err);
        toast.error("复制失败");
      });
  };

  // 导出代码
  const handleExportCode = () => {
    // 创建一个Blob对象
    const fileContent = files[activeFile];
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // 创建一个下载链接
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.substring(1); // 移除开头的斜杠
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`已导出 ${activeFile.substring(1)}`);
  };

  // 应用代码到项目
  const handleApplyCode = async () => {
    try {
      // 这里应该调用后端API将代码应用到项目中
      // 实际项目中需要实现这个API
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/apply-code`, {
        filename: activeFile.substring(1),
        content: files[activeFile],
      });

      toast.success(`代码已应用到项目中: ${activeFile.substring(1)}`);
    } catch (error) {
      console.error("应用代码失败:", error);
      toast.error("应用代码失败，请检查控制台获取详细信息");
    }
  };

  return (
    <div style={{ display: "flex", height: "95vh", overflow: "hidden" }}>
      {/* 左侧聊天区域 */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          backgroundColor: "#fff",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          marginRight: "10px",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={"/logo.png"}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "10px",
              }}
              alt="Logo"
            />
            <span style={{ fontSize: "16px", marginLeft: "10px" }}>
              AI编程助手
            </span>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="qwen">千问接口</option>
            {/* <option value="default">智谱接口</option> */}
          </select>
        </div>

        {/* 其余聊天区域代码保持不变 */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* 移除原来的标题部分，因为已经移到上面的选择器旁边 */}
          {chatMessages.map((msg, index) => (
            <div key={index} style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.role !== "user" && (
                  <img
                    src={"/logo.png"}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                    alt="AI"
                  />
                )}
                <div
                  style={{
                    backgroundColor: msg.role === "user" ? "#007bff" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#333",
                    padding: "10px 15px",
                    marginLeft: msg.role === "user" ? "" : "5px",
                    marginRight: msg.role === "user" ? "5px" : "",
                    borderRadius: "18px",
                    maxWidth: "80%",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <img
                    src={"/avatar.png"}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                    alt="User"
                  />
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div
              style={{
                alignSelf: "flex-start",
                backgroundColor: "#fff",
                color: "#333",
                padding: "10px 15px",
                borderRadius: "18px",
                maxWidth: "80%",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "15px",
            borderTop: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
          }}
        >
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入您的需求..."
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "20px",
              padding: "10px 15px",
              resize: "none",
              height: "40px",
              lineHeight: "20px",
              outline: "none",
            }}
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={isGenerating || !userInput.trim()}
            style={{
              marginLeft: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor:
                isGenerating || !userInput.trim() ? "not-allowed" : "pointer",
              opacity: isGenerating || !userInput.trim() ? 0.7 : 1,
            }}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>

      {/* 右侧代码编辑和预览区域 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* 工具栏 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                marginRight: "5px",
                cursor: historyIndex <= 0 ? "not-allowed" : "pointer",
                opacity: historyIndex <= 0 ? 0.7 : 1,
              }}
            >
              撤销
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= codeHistory.length - 1}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor:
                  historyIndex >= codeHistory.length - 1
                    ? "not-allowed"
                    : "pointer",
                opacity: historyIndex >= codeHistory.length - 1 ? 0.7 : 1,
              }}
            >
              重做
            </button>
          </div>
          <div>
            <button
              onClick={() => setActiveFile("/App.js")}
              style={{
                backgroundColor: activeFile === "/App.js" ? "#007bff" : "#fff",
                color: activeFile === "/App.js" ? "#fff" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                marginRight: "5px",
                cursor: "pointer",
              }}
            >
              App.js
            </button>
            <button
              onClick={() => setActiveFile("/styles.css")}
              style={{
                backgroundColor:
                  activeFile === "/styles.css" ? "#007bff" : "#fff",
                color: activeFile === "/styles.css" ? "#fff" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              styles.css
            </button>
          </div>
          <div>
            <button
              onClick={handleCopyCode}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                marginRight: "5px",
                cursor: "pointer",
              }}
            >
              <FiCopy size={16} style={{ marginRight: "5px" }} />
              复制
            </button>
            <button
              onClick={handleExportCode}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "5px 10px",
                marginRight: "5px",
                cursor: "pointer",
              }}
            >
              <FiDownload size={16} style={{ marginRight: "5px" }} />
              导出
            </button>
            <button
              onClick={handleApplyCode}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              应用到项目
            </button>
          </div>
        </div>

        {/* Sandpack编辑器和预览 */}
        <div style={{ flex: 1 }}>
          <DynamicSandpack
            template="react"
            files={files}
            options={{
              showNavigator: false,
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true,
              editorHeight: "90vh",
              editorWidthPercentage: 50,
              activeFile: activeFile,
            }}
            customSetup={{
              dependencies: {
                react: "^18.0.0",
                "react-dom": "^18.0.0",
              },
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #007bff;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          opacity: 0.6;
          animation: typing 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
