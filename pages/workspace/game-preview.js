import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Howl, Howler } from "howler";
import { useDispatch } from "react-redux";
import { setNavigationVisibility } from "@/store/navigationSlice";
import { setLoading } from "@/store/loadingSlice";

export default function GamePreview() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctMessage, setCorrectMessage] = useState("恭喜你，你答对了🎉🎉");
  const [errorMessage, setErrorMessage] = useState("没关系，再试一次！😊");
  const [isMuted, setIsMuted] = useState(false);
  const [videoVolume, setVideoVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scenes = [
    {
      word: "access",
      dialog:
        "在《绿皮书》中，托尼站在黑人酒吧的门外，心中忐忑不安。他知道，只有找到进入这个世界的access，才能真正理解唐雪利的音乐和生活。那一刻，他深吸一口气，推开了那扇通往新世界的门。",
      options: [
        { text: "通道", isCorrect: "false", nextScene: -1 },
        { text: "入口", isCorrect: "true", nextScene: 1 },
        { text: "接近", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accessory",
      dialog:
        "电影中的绿皮书不仅是托尼的行车指南，更是他旅途中的忠实accessory。每当夜深人静，托尼总会翻阅它，仿佛在这本小册子里，能找到前行的勇气和智慧。",
      options: [
        { text: "辅助工具", isCorrect: "true", nextScene: 2 },
        { text: "附件", isCorrect: "false", nextScene: -1 },
        { text: "配件", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accident",
      dialog:
        "一次意外的accident让托尼和唐雪利在乡间小路上被迫停下。在等待救援的漫长时间里，两人从最初的尴尬沉默，到后来的坦诚相谈，这段意外的旅程，竟成为了他们友谊的开端。",
      options: [
        { text: "事件", isCorrect: "false", nextScene: -1 },
        { text: "意外", isCorrect: "false", nextScene: -1 },
        { text: "事故", isCorrect: "true", nextScene: 3 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accidental",
      dialog:
        "托尼在加油站的一次accidental发现，让唐雪利得以在南方小镇上享用了一顿久违的家乡美食。那一刻，两人眼中都闪烁着惊喜的光芒，仿佛这场意外的邂逅，是命运最美的安排。",
      options: [
        { text: "无意的", isCorrect: "false", nextScene: -1 },
        { text: "偶然的", isCorrect: "true", nextScene: 4 },
        { text: "意外的", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accompany",
      dialog:
        "在唐雪利的钢琴独奏会上，托尼静静地坐在台下，用目光accompany着每一个音符的起伏。他从未想过，自己会如此投入地聆听一场古典音乐会，更未想过，这段旅程会让他对音乐有了全新的理解。",
      options: [
        { text: "跟随", isCorrect: "false", nextScene: -1 },
        { text: "陪同", isCorrect: "false", nextScene: -1 },
        { text: "陪伴", isCorrect: "true", nextScene: 5 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accomplish",
      dialog:
        "当唐雪利在南方庄园的舞台上，优雅地弹奏完最后一曲，全场爆发出雷鸣般的掌声。那一刻，托尼心中涌起一股强烈的自豪感，他们一起accomplish了一场看似不可能的演出。",
      options: [
        { text: "实现", isCorrect: "false", nextScene: -1 },
        { text: "达成", isCorrect: "false", nextScene: -1 },
        { text: "完成", isCorrect: "true", nextScene: 6 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accord",
      dialog:
        "在旅途中，托尼和唐雪利逐渐学会了在彼此的生活习惯和价值观中找到accord。尽管他们的世界看似截然不同，但在这段共同的旅程中，他们发现，理解和尊重才是最宝贵的和谐。",
      options: [
        { text: "协议", isCorrect: "false", nextScene: -1 },
        { text: "和谐", isCorrect: "true", nextScene: 7 },
        { text: "一致", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "accordance",
      dialog:
        "每当遇到种族歧视的困境，托尼总是严格按照绿皮书中的指示行事，以确保唐雪利的安全。这种对规则的严格遵守，不仅是对法律的尊重，更是对朋友深深的关爱和accordance。",
      options: [
        { text: "根据", isCorrect: "false", nextScene: -1 },
        { text: "遵守", isCorrect: "true", nextScene: 8 },
        { text: "依照", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "afraid",
      dialog:
        "在南方小镇的夜晚，托尼独自走在回旅馆的路上，心中不禁有些afraid。他知道，这里的种族偏见如同一只无形的猛兽，随时可能对他们发起攻击。但想到唐雪利还在等他，他咬紧牙关，加快了脚步。",
      options: [
        { text: "担忧", isCorrect: "false", nextScene: -1 },
        { text: "害怕", isCorrect: "true", nextScene: 9 },
        { text: "恐惧", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "punish",
      dialog:
        "当托尼因为维护唐雪利的尊严而与当地警察发生冲突时，他毫不畏惧地面对可能的punish。那一刻，他不再是那个粗鲁的夜总会保安，而是一个勇敢捍卫正义的战士。",
      options: [
        { text: "惩罚", isCorrect: "true", nextScene: 10 },
        { text: "处罚", isCorrect: "false", nextScene: -1 },
        { text: "制裁", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
    {
      word: "none",
      dialog: "恭喜你完成了游戏的所有关卡，点击重玩游戏，重新开始游戏",
      options: [{ text: "重玩游戏", isCorrect: "true", nextScene: 0 }],
      npcName: "绿皮书",
      npcAvatar: "http://cdn.docuparser.top/avatar/lvpishu.jpeg",
      backgroundVideo: "http://cdn.docuparser.top/video/lvpishu.mp4",
    },
  ];

  const congratulatoryMessages = [
    "太棒了！你真是个天才！🎉",
    "恭喜你，答对了！继续保持！💪",
    "你做得非常好！继续加油！🌟",
    "完美！你的努力没有白费！👏",
    "你简直是个小天才！再来一题？😉",
    "哇哦，你的智商爆表了！😎",
    "你的智慧和勇气让我感动！❤️",
    "你真是太厉害了，继续前进吧！🌈",
  ];

  const comfortMessages = [
    "没关系，再试一次！😊",
    "错误是成功之母，加油！💪",
    "别灰心，你已经很棒了！🌟",
    "继续努力，你会成功的！👏",
    "每一次错误都是进步的机会！😉",
    "相信自己，你能做到的！😎",
    "失败乃成功之母，继续加油！❤️",
    "再接再厉，你会更好！🌈",
  ];

  // 定义所音效
  const sounds = {
    hover: new Howl({
      src: ["/sounds/悬停.FLAC"],
      volume: 0.4,
    }),
    click: new Howl({
      src: ["/sounds/点击.mp3"],
      volume: 0.6,
    }),
    success: new Howl({
      src: ["/sounds/正确.FLAC"],
      volume: 0.6,
    }),
    error: new Howl({
      src: ["/sounds/错误.FLAC"],
      volume: 0.6,
    }),
  };

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);

  const handleChoice = (nextScene) => {
    if (nextScene > 0) {
      setShowCorrect(true);
      setTimeout(() => setShowCorrect(false), 2000);
      setCurrentScene(nextScene);
      setGameHistory([...gameHistory, currentScene]);
    } else if (nextScene === 0) {
      setCurrentScene(nextScene);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  // 鼠标悬停效果
  const handleHover = () => {
    sounds.hover.play();
  };

  // 选择选项效果
  const handleClick = (selectedOption) => {
    sounds.click.play();

    if (selectedOption.isCorrect === "true") {
      sounds.success.play();
      const randomMessage =
        congratulatoryMessages[
          Math.floor(Math.random() * congratulatoryMessages.length)
        ];
      setCorrectMessage(randomMessage);
      console.log("right");
    } else {
      console.log("error");
      sounds.error.play();
      const randomMessage =
        comfortMessages[Math.floor(Math.random() * comfortMessages.length)];
      setErrorMessage(randomMessage);
    }
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

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setVideoVolume(volume);
    const videoElement = document.querySelector(".background-video");
    if (videoElement) {
      videoElement.volume = volume;
    }
  };

  const handleMouseEnter = () => {
    setShowVolumeControl(true);
    setTimeout(() => setShowVolumeControl(false), 4000); // 显示3秒
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    Howler.mute(newMuteState); // 静音或取消静音所有音频
  };

  // 自定义节流函数
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  const toggleImmersiveMode = () => {
    setIsImmersive(!isImmersive);
  };

  return (
    <div className="story-game">
      <label className="immersive-switch" style={{ color: "white" }}>
        <input
          type="checkbox"
          checked={isImmersive}
          onChange={toggleImmersiveMode}
        />
        <span className="slider"></span>
        {isImmersive ? "沉浸式" : "普通模式"}
      </label>
      <button className="fullscreen-btn purple-btn" onClick={toggleFullscreen}>
        {isFullscreen ? "退出全屏" : "进入全屏"}
      </button>
      {showError && <div className="error-message">{errorMessage}</div>}
      {showCorrect && <div className="correct-message">{correctMessage}</div>}
      <button
        className="mute-btn"
        onClick={toggleMute}
        title={isMuted ? "恢复音效声音" : "音效静音"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      <div
        className="video-volume-control"
        onMouseEnter={throttle(handleMouseEnter, 3000)}
      >
        🎵
        {showVolumeControl && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={videoVolume}
            onChange={handleVolumeChange}
          />
        )}
      </div>
      <video
        className="background-video"
        src={scenes[currentScene].backgroundVideo}
        autoPlay
        // muted={isMuted}
        loop
        playsInline
        volume={videoVolume}
      />

      <div className={`content-overlay ${isImmersive ? "immersive" : ""}`}>
        {!isImmersive && (
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${(currentScene / (scenes.length - 1)) * 100}%`,
                backgroundColor: theme.button.primary,
              }}
            />
          </div>
        )}
        <div className="dialog-box">
          <div className="npc-avatar">
            <img src={scenes[currentScene].npcAvatar} alt="NPC" />
          </div>
          <div className="dialog-content">
            <div className="npc-name">{scenes[currentScene].npcName}</div>
            <p>{scenes[currentScene].dialog}</p>
          </div>
        </div>
        <div className={`options-container ${isImmersive ? "immersive" : ""}`}>
          {scenes[currentScene].options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                handleChoice(option.nextScene), handleClick(option);
              }}
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
          padding-bottom: 120px;
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
          background: ${theme.dark ? "rgba(255, 255, 255, 0.1)" : "#edf2f7"};
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
          opacity: 0.8;
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
        .correct-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: green;
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

        .mute-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 100;
          padding: 8px;
          background: ${theme.dark
            ? "rgba(88, 28, 135, 0.8)"
            : "rgba(255, 255, 255, 0.8)"};
          border: none;
          border-radius: 50%;
          color: black;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .mute-btn:hover {
          transform: scale(1.1);
          background: ${theme.dark
            ? "rgba(139, 92, 246, 0.8)"
            : "rgba(255, 255, 255, 0.9)"};
        }

        .video-volume-control {
          position: absolute;
          bottom: 100px;
          right: 20px;
          z-index: 100;
          cursor: pointer;
          background: ${theme.dark
            ? "rgba(88, 28, 135, 0.8)"
            : "rgba(255, 255, 255, 0.8)"};
          border-radius: 50%;
          padding: 8px;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        input[type="range"] {
          position: absolute;
          top: 10px;
          left: -160px; /* 确保进度条在音乐图标左边 */
          width: 150px;
          display: block;
        }

        .immersive-switch {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 100;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .immersive-switch input {
          display: none;
        }

        .slider {
          width: 40px;
          height: 20px;
          background-color: ${theme.dark ? "#ccc" : "#ddd"};
          border-radius: 20px;
          position: relative;
          transition: background-color 0.2s;
          margin-right: 10px;
        }

        .slider::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          background-color: white;
          border-radius: 50%;
          top: 1px;
          left: 1px;
          transition: transform 0.2s;
        }

        input:checked + .slider {
          background-color: ${theme.button.primary};
        }

        input:checked + .slider::before {
          transform: translateX(20px);
        }

        .content-overlay.immersive {
          justify-content: flex-end;
          align-items: flex-start;
          padding-bottom: 20px;
          padding-left: 20px;
        }

        .dialog-box {
          width: ${isImmersive ? "60%" : "80%"};
          max-width: ${isImmersive ? "400px" : "600px"};
          margin-bottom: ${isImmersive ? "40px" : "20px"};
        }

        .options-container.immersive {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: flex-start;
          margin-bottom: 20px;
        }

        .options-container.immersive button {
          flex: 1 1 20%;
          max-width: 22%;
          padding: 0.5rem 1rem;
          font-size: 1rem;
        }

        .subtle-btn {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.3); /* 半透明背景 */
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          backdrop-filter: blur(5px); /* 背景模糊效果 */
        }

        .subtle-btn:hover {
          background: rgba(0, 0, 0, 0.5); /* 悬停时稍微增加透明度 */
          transform: scale(1.05); /* 悬停时轻微放大 */
        }

        .subtle-btn:active {
          transform: scale(0.95); /* 点击时轻微缩小 */
        }

        .immersive-switch {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 100;
        }

        .fullscreen-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
        }

        .immersive-switch input {
          margin-right: 10px;
        }

        .slider {
          width: 40px;
          height: 20px;
          background-color: #ddd;
          border-radius: 20px;
          position: relative;
          transition: background-color 0.2s;
        }

        .slider::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          background-color: white;
          border-radius: 50%;
          top: 1px;
          left: 1px;
          transition: transform 0.2s;
        }

        input:checked + .slider {
          background-color: ${theme.button.primary};
        }

        input:checked + .slider::before {
          transform: translateX(20px);
        }

        .bright-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 16px;
          background: linear-gradient(
            45deg,
            #ffeb3b,
            #ff9800
          ); /* 明亮的渐变背景 */
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          box-shadow: 0 0 10px rgba(255, 235, 59, 0.5),
            0 0 20px rgba(255, 152, 0, 0.5);
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }

        .bright-btn:hover {
          background: linear-gradient(
            45deg,
            #ff9800,
            #ffeb3b
          ); /* 悬停时反转渐变 */
          box-shadow: 0 0 20px rgba(255, 235, 59, 0.7),
            0 0 30px rgba(255, 152, 0, 0.7);
          transform: translateY(-2px);
        }

        .bright-btn:active {
          transform: translateY(0);
          box-shadow: 0 0 5px rgba(255, 235, 59, 0.3),
            0 0 10px rgba(255, 152, 0, 0.3);
        }

        .purple-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 16px;
          background: rgba(128, 0, 128, 0.3); /* 半透明紫色背景 */
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          box-shadow: 0 0 10px rgba(128, 0, 128, 0.5),
            0 0 20px rgba(75, 0, 130, 0.5);
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }

        .purple-btn:hover {
          background: linear-gradient(
            45deg,
            rgba(128, 0, 128, 0.5),
            rgba(75, 0, 130, 0.5)
          ); /* 渐变紫色 */
          box-shadow: 0 0 20px rgba(128, 0, 128, 0.7),
            0 0 30px rgba(75, 0, 130, 0.7);
          transform: translateY(-2px);
        }

        .purple-btn:active {
          transform: translateY(0);
          box-shadow: 0 0 5px rgba(128, 0, 128, 0.3),
            0 0 10px rgba(75, 0, 130, 0.3);
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
