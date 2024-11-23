import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Howl } from "howler";
import { useDispatch } from "react-redux";
import { setNavigationVisibility } from "../../store/navigationSlice";

export default function GamePreview() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showError, setShowError] = useState(false);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scenes = [
    {
      word: "access",
      dialog:
        "在《千与千寻》中，千寻意外地踏入了一个充满魔法和神秘的世界，她的心中充满了迷茫和恐惧。她必须找到那个隐秘的access，那是她重返温暖现实世界的唯一希望。",
      options: [
        { text: "接近", isCorrect: "false" },
        { text: "通道", isCorrect: "false" },
        { text: "入口", isCorrect: "true", nextScene: 1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accessory",
      dialog:
        "电影中的无脸男，沉默而神秘，成为了千寻冒险途中的一个意外accessory。他在关键时刻伸出援手，虽然无声，却让千寻感受到了一丝温暖和依靠。",
      options: [
        { text: "装饰品", isCorrect: "false" },
        { text: "配件", isCorrect: "false" },
        { text: "助手", isCorrect: "true", nextScene: 2 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accident",
      dialog:
        "千寻的父母因贪食变成了猪，这一突如其来的accident彻底颠覆了她的生活。在惊恐和无助中，她被迫踏上了寻找解救之法的旅程。",
      options: [
        { text: "灾难", isCorrect: "false" },
        { text: "意外", isCorrect: "true", nextScene: 3 },
        { text: "事故", isCorrect: "false" },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accidental",
      dialog:
        "在那个迷离的夜晚，千寻与白龙的相遇纯属accidental。然而，正是这次偶然的邂逅，点燃了他们之间深厚友谊的火花，照亮了彼此的心灵。",
      options: [
        { text: "意外的", isCorrect: "false" },
        { text: "无意的", isCorrect: "false" },
        { text: "偶然的", isCorrect: "true", nextScene: 4 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accommodate",
      dialog:
        "油屋的汤婆婆拥有神奇的力量，她能够accommodate形形色色的神灵和妖怪。她的慷慨与威严并存，让每一个踏入油屋的生灵都感到敬畏。",
      options: [
        { text: "容纳", isCorrect: "true", nextScene: 5 },
        { text: "适应", isCorrect: "false" },
        { text: "供应", isCorrect: "false" },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accommodation",
      dialog:
        "在油屋的角落里，千寻找到了一个简陋却温馨的accommodation。这里虽小，却承载了她在这个陌生世界中的所有希望和梦想。",
      options: [
        { text: "设备", isCorrect: "false" },
        { text: "安排", isCorrect: "false" },
        { text: "住处", isCorrect: "true", nextScene: 6 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accompany",
      dialog:
        "每当千寻面临困境时，白龙总是默默地accompany在她身边。他的守护如同温暖的阳光，驱散了她心中的阴霾，让她勇敢前行。",
      options: [
        { text: "陪伴", isCorrect: "true", nextScene: 7 },
        { text: "陪同", isCorrect: "false" },
        { text: "跟随", isCorrect: "false" },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accomplish",
      dialog:
        "经历了无数次的挑战和磨难，千寻终于accomplish了她看似不可能的任务。她的坚持和勇气不仅解救了父母，也让她成长为一个更加坚强的人。",
      options: [
        { text: "实现", isCorrect: "false" },
        { text: "达到", isCorrect: "false" },
        { text: "完成", isCorrect: "true", nextScene: 8 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accord",
      dialog:
        "千寻的纯真与勇敢，与白龙的忠诚与智慧形成了完美的accord。他们心心相印，共同面对困难，谱写了一曲动人的友谊乐章。",
      options: [
        { text: "一致", isCorrect: "false" },
        { text: "协议", isCorrect: "false" },
        { text: "和谐", isCorrect: "true", nextScene: 9 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "accordance",
      dialog:
        "在油屋这个充满规则和秩序的世界里，千寻必须小心翼翼地保持与汤婆婆意愿的accordance。每一次的服从与抗争，都是她对自我价值的坚持与探索。",
      options: [
        { text: "协调", isCorrect: "false" },
        { text: "符合", isCorrect: "true", nextScene: 10 },
        { text: "一致", isCorrect: "false" },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
    {
      word: "none",
      dialog: "恭喜你完成了游戏的所有关卡，点击重玩游戏，重新开始游戏",
      options: [{ text: "重玩游戏", isCorrect: "true", nextScene: 0 }],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/2077.mp4",
    },
  ];

  // 定义所有音效
  const sounds = {
    hover: new Howl({
      src: ["/sounds/悬停.mp3"],
      volume: 1,
    }),
    click: new Howl({
      src: ["/sounds/点击.mp3"],
      volume: 0.6,
    }),
  };

  const handleChoice = (nextScene) => {
    if (nextScene !== undefined) {
      setCurrentScene(nextScene);
      setGameHistory([...gameHistory, currentScene]);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // 鼠标悬停效果
  const handleHover = () => {
    sounds.hover.play();
  };

  // 处理全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      dispatch(setNavigationVisibility(false));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
        dispatch(setNavigationVisibility(true));
      }
    }
  };

  // 监听 F11 键
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      dispatch(setNavigationVisibility(true));
    };
  }, [dispatch]);

  return (
    <div className="story-game">
      {showError && <div className="error-message">很抱歉，你答错了</div>}
      <button className="fullscreen-btn" onClick={toggleFullscreen}>
        {isFullscreen ? "退出全屏" : "进入全屏"}
      </button>
      <video
        className="background-video"
        src={scenes[currentScene].backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="content-overlay">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(currentScene / (scenes.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="dialog-box">
          <div className="npc-avatar">
            <img src={scenes[currentScene].npcAvatar} alt="NPC" />
          </div>
          <div className="dialog-content">
            <div className="npc-name">{scenes[currentScene].npcName}</div>
            <p>{scenes[currentScene].dialog}</p>
          </div>
        </div>

        <div className="options-container">
          {scenes[currentScene].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleChoice(option.nextScene)}
              onMouseEnter={handleHover}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .story-game {
          position: relative;
          width: 100%;
          height: ${isFullscreen ? "100vh" : "94vh"};
          overflow: hidden;
          margin: ${isFullscreen ? "0" : "inherit"};
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .content-overlay {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 60px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: ${theme.dark ? "rgba(255, 255, 255, 0.1)" : "#edf2f7"};
          border-radius: 2px;
          margin-bottom: 2rem;
        }

        .progress {
          height: 100%;
          background: ${theme.button.primary};
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .dialog-box {
          background: ${theme.dark
            ? "linear-gradient(135deg, rgba(18, 6, 38, 0.9), rgba(44, 10, 74, 0.9))"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(230, 230, 250, 0.9))"};
          border: 2px solid ${theme.dark ? "#8a2be2" : "#4b0082"};
          box-shadow: 0 0 10px ${theme.dark ? "#8a2be2" : "#4b0082"},
            0 0 20px ${theme.dark ? "#8a2be2" : "#4b0082"},
            inset 0 0 15px
              ${theme.dark
                ? "rgba(138, 43, 226, 0.5)"
                : "rgba(75, 0, 130, 0.5)"};
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          width: 80%;
          max-width: 600px;
          backdrop-filter: blur(5px);
          position: relative;
          overflow: hidden;
        }

        .dialog-box::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            ${theme.dark ? "rgba(138, 43, 226, 0.1)" : "rgba(75, 0, 130, 0.1)"}
              0%,
            transparent 80%
          );
          animation: rotateGradient 10s linear infinite;
        }

        @keyframes rotateGradient {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .npc-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid ${theme.dark ? "#8a2be2" : "#4b0082"};
          box-shadow: 0 0 10px ${theme.dark ? "#8a2be2" : "#4b0082"},
            0 0 20px ${theme.dark ? "#8a2be2" : "#4b0082"};
        }

        .npc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: ${theme.dark ? "brightness(1.2) contrast(1.1)" : "none"};
        }

        .dialog-content {
          flex: 1;
          z-index: 1;
        }

        .npc-name {
          font-family: "Orbitron", sans-serif;
          font-weight: bold;
          font-size: 1.2em;
          margin-bottom: 8px;
          color: ${theme.dark ? "#ff00ff" : "#8a2be2"};
          text-shadow: 0 0 5px ${theme.dark ? "#ff00ff" : "#8a2be2"},
            0 0 10px ${theme.dark ? "#ff00ff" : "#8a2be2"};
        }

        .dialog-content p {
          font-family: "Rajdhani", sans-serif;
          line-height: 1.6;
          color: ${theme.dark ? "#e0e0e0" : "#2d0a4e"};
          text-shadow: 0 0 2px
            ${theme.dark ? "rgba(224, 224, 224, 0.5)" : "rgba(45, 10, 78, 0.5)"};
          font-size: 1.1em;
          letter-spacing: 0.5px;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 80%;
          max-width: 600px;
        }

        button {
          padding: 1rem 1.5rem;
          background: ${theme.dark
            ? "rgba(88, 28, 135, 0.2)"
            : "rgba(255, 255, 255, 0.8)"};
          border: ${theme.dark
            ? "2px solid rgba(139, 92, 246, 0.3)"
            : `2px solid rgba(255, 255, 255, 0.3)`};
          border-radius: 8px;
          color: ${theme.dark ? "#fff" : "#000"};
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        }

        button:hover {
          background: ${theme.dark
            ? "linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(0, 255, 255, 0.3))"
            : "linear-gradient(45deg, rgba(255, 0, 128, 0.2), rgba(0, 255, 255, 0.2))"};
          border-color: ${theme.dark
            ? "rgba(0, 255, 255, 0.6)"
            : "rgba(255, 0, 128, 0.6)"};
          color: ${theme.dark ? "#fff" : "#000"};
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
            0 0 30px rgba(255, 0, 128, 0.3);
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8),
            0 0 12px rgba(0, 255, 255, 0.5);
        }

        button:hover::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          animation: glowingEffect 2s infinite;
        }

        @keyframes glowingEffect {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .fullscreen-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
          padding: 8px 16px;
          background: ${theme.dark
            ? "rgba(88, 28, 135, 0.8)"
            : "rgba(255, 255, 255, 0.8)"};
          border: none;
          border-radius: 4px;
          color: black;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .fullscreen-btn:hover {
          transform: scale(1.05);
          color: black;
          background: ${theme.dark
            ? "rgba(139, 92, 246, 0.8)"
            : "rgba(255, 255, 255, 0.9)"};
        }

        /* 全屏时的样式调整 */
        :global(html:fullscreen) .story-game {
          height: 100vh;
          width: 100vw;
        }

        .error-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 0, 0, 0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          font-size: 1.5em;
          animation: fadeInOut 2s;
          z-index: 1000;
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <style jsx global>{`
        body:fullscreen {
          overflow: hidden;
        }

        body:fullscreen nav,
        body:fullscreen aside {
          display: none !important;
        }

        body:fullscreen .story-game {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
