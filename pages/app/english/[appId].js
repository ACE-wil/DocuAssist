import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

import { Howl, Howler } from "howler";

import { useDispatch } from "react-redux";

import { setNavigationVisibility } from "@/store/navigationSlice";

import { setLoading } from "@/store/loadingSlice";

import axios from "axios";

import { useRouter } from "next/router";

export default function EnglishApp() {
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

  const [appData, setAppData] = useState(null);

  const router = useRouter();

  const { appId } = router.query;

  const [scenes, setScenes] = useState(null);

  useEffect(() => {
    if (!router.isReady) return; // 确保 router 已准备好

    console.log("Received appId:", appId);

    const fetchScenes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-my-apps`
        );

        const scenesData = response.data.myApps.find(
          (app) => app.id === parseInt(appId)
        )?.scene;

        setScenes(JSON.parse(scenesData));
      } catch (error) {
        console.error("获取场景数据失败:", error);
      }
    };

    fetchScenes();
  }, [router.isReady, appId]);

  useEffect(() => {
    // 组件挂载后关闭 loading

    dispatch(setLoading(false));
  }, [dispatch]);

  if (!scenes || scenes.length === 0) {
    return <div>加载中...</div>;
  }

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

  // // 监听 F11 键

  // useEffect(() => {

  //   const handleKeyPress = (e) => {

  //     if (e.key === "F11") {

  //       e.preventDefault();

  //       toggleFullscreen();

  //     }

  //   };

  //   window.addEventListener("keydown", handleKeyPress);

  //   return () => window.removeEventListener("keydown", handleKeyPress);

  // }, []);

  // useEffect(() => {

  //   return () => {

  //     if (document.fullscreenElement) {

  //       document.exitFullscreen();

  //     }

  //     dispatch(setNavigationVisibility(true));

  //   };

  // }, [dispatch]);

  return (
    <div className="story-game">
      <label className="immersive-switch">
        <input
          type="checkbox"
          checked={isImmersive}
          onChange={toggleImmersiveMode}
        />

        <span className="slider"></span>

        {isImmersive ? "沉浸式" : "普通模式"}
      </label>

      {showError && <div className="error-message">{errorMessage}</div>}

      {showCorrect && <div className="correct-message">{correctMessage}</div>}

      <button className="fullscreen-btn" onClick={toggleFullscreen}>
        {isFullscreen ? "退出全屏" : "进入全屏"}
      </button>

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
