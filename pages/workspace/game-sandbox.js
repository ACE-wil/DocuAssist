import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sandpack } from "@codesandbox/sandpack-react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { FiSend, FiRefreshCw } from "react-icons/fi";

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

export default function GameSandbox() {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(initialCode);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "您好！请告诉我您想要创建什么样的应用？" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  // 模拟AI生成代码的函数
  const generateCode = async (prompt) => {
    setIsGenerating(true);

    // 这里是示例代码生成逻辑，实际项目中应该调用API
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
          // backgroundColor: "#f5f5f5"
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <img
              src={"/logo.png"}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
              }}
            />
            <span style={{ fontSize: "18px", marginLeft: "10px" }}>
              AI编程助手
            </span>
          </div>
          <div
            style={{
              width: "90%",
              height: "1px",
              backgroundColor: "#E7E7E8",
              margin: "8px 0",
            }}
          ></div>
          {chatMessages.map((msg, index) => (
            <div style={{ width: "100%" }}>
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
                  />
                )}
                <div
                  key={index}
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
                {msg.role == "user" && (
                  <img
                    src={"/avatar.png"}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
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
                gap: "8px",
              }}
            >
              <FiRefreshCw style={{ animation: "spin 1s linear infinite" }} />
              正在生成代码...
            </div>
          )}
        </div>

        <div
          style={{
            padding: "15px",
            borderTop: "1px solid #ddd",
            display: "flex",
            backgroundColor: "#fff",
          }}
        >
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的需求，例如：创建一个计算器应用"
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              resize: "none",
              height: "60px",
              fontFamily: "inherit",  
              outline: "none",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isGenerating || !userInput.trim()}
            style={{
              marginLeft: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0 15px",
              width: "40px",
              height: "40px",
              marginTop: "10px",
              cursor:
                isGenerating || !userInput.trim() ? "not-allowed" : "pointer",
              opacity: isGenerating || !userInput.trim() ? 0.7 : 1,
            }}
          >
            <FiSend />
          </button>
        </div>
      </div>

      {/* 右侧代码编辑和预览区域 */}
      <div style={{ flex: 1 }}>
        <DynamicSandpack
          template="react"
          files={files}
          options={{
            showNavigator: true,
            showTabs: true,
            editorHeight: "100vh",
            visibleFiles: ["/App.js", "/styles.css"],
            activeFile: "/App.js",
          }}
          theme="light"
        />
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
