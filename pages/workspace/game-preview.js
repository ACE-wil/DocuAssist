import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Howl, Howler } from "howler";
import { useDispatch } from "react-redux";
import { setNavigationVisibility } from "../../store/navigationSlice";

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
        "在《绿皮书》中，托尼站在那辆老旧的轿车旁，心中充满了对未知的忐忑与期待。他知道，找到进入黑人音乐家唐·雪利南方巡演的世界的access，不仅是开启一段工作的钥匙，更是踏入一个全新人生篇章的门槛。",
      options: [
        { text: "接近", isCorrect: "false", nextScene: -1 },
        { text: "入口", isCorrect: "true", nextScene: 1 },
        { text: "通道", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/lvpishu_1.mp4",
    },
    {
      word: "accessory",
      dialog:
        "托尼的车，那辆泛着金属光泽的绿皮书座驾，不仅仅是他们旅途中的accessory，更是风雨同舟的伙伴。在每一个黎明与黄昏，它载着两人穿越偏见与隔阂，见证了一段超越种族与阶层的深厚友谊。",
      options: [
        { text: "从犯", isCorrect: "false", nextScene: -1 },
        { text: "附件", isCorrect: "true", nextScene: 2 },
        { text: "同谋", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accident",
      dialog:
        "一场突如其来的accident让托尼和唐·雪利被迫停留在荒凉的公路边。在等待救援的漫长时间里，他们从最初的尴尬沉默到后来的坦诚交谈，这次意外，像命运的安排，悄然拉近了两颗原本疏离的心。",
      options: [
        { text: "意外", isCorrect: "false", nextScene: -1 },
        { text: "事故", isCorrect: "true", nextScene: 3 },
        { text: "偶发事件", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accidental",
      dialog:
        "他们的相遇，初看是那样accidental，仿佛只是人生旅途中的一次偶然交汇。然而，随着故事的展开，他们发现这段旅程早已在命运的蓝图上绘就，每一次微笑、每一次争执，都是不可或缺的篇章。",
      options: [
        { text: "意外的", isCorrect: "false", nextScene: -1 },
        { text: "非本质的", isCorrect: "false", nextScene: -1 },
        { text: "偶然的", isCorrect: "true", nextScene: 4 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accommodate",
      dialog:
        "面对南方根深蒂固的种族歧视，唐·雪利以优雅而坚韧的姿态努力accommodate。他既要在音乐会上展现无与伦比的才华，又要在现实中委曲求全，这份坚持与妥协，是对尊严与梦想的双重捍卫。",
      options: [
        { text: "供应", isCorrect: "false", nextScene: -1 },
        { text: "适应", isCorrect: "true", nextScene: 5 },
        { text: "容纳", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accommodation",
      dialog:
        "夜幕降临，托尼和唐·雪利却因肤色问题屡屡被拒之门外，找不到一处愿意接纳他们的accommodation。在那些寒冷的夜晚，他们蜷缩在车内，彼此的陪伴成了对抗世间冷漠的唯一温暖。",
      options: [
        { text: "预定铺位", isCorrect: "false", nextScene: -1 },
        { text: "住所", isCorrect: "true", nextScene: 6 },
        { text: "招待设备", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accompany",
      dialog:
        "托尼不仅仅是唐·雪利的司机和保镖，更是他在这段艰难旅程中的忠实伙伴。他们一起面对风雨，一起笑对困厄，accompany的意义，早已超越了职责，升华成了无言的默契与深情。",
      options: [
        { text: "陪伴", isCorrect: "true", nextScene: 7 },
        { text: "陪同", isCorrect: "false", nextScene: -1 },
        { text: "伴随", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accomplish",
      dialog:
        "随着巡演的圆满结束，唐·雪利不仅accomplish了音乐上的辉煌成就，更在心灵深处完成了自我救赎与成长。他的每一次演奏，都在用音符打破偏见，用旋律呼唤平等。",
      options: [
        { text: "达到", isCorrect: "false", nextScene: -1 },
        { text: "实现", isCorrect: "false", nextScene: -1 },
        { text: "完成", isCorrect: "true", nextScene: 8 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accord",
      dialog:
        "当冬日的阳光洒在纽约的街道上，托尼和唐·雪利在彼此的目光中找到了深深的accord。他们以平等的尊重和理解，超越了曾经的隔阂，成为了彼此生命中不可或缺的朋友。",
      options: [
        { text: "和谐", isCorrect: "true", nextScene: 9 },
        { text: "给予", isCorrect: "false", nextScene: -1 },
        { text: "一致", isCorrect: "false", nextScene: -1 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "accordance",
      dialog:
        "他们的友谊，如同精心谱写的乐章，在相互理解和accordance的和弦中奏响。这份情谊，超越了肤色与阶层的界限，成为了人性光辉中最动人的篇章。",
      options: [
        { text: "授予", isCorrect: "false", nextScene: -1 },
        { text: "和谐", isCorrect: "false", nextScene: -1 },
        { text: "一致", isCorrect: "true", nextScene: 10 },
      ],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
    },
    {
      word: "none",
      dialog: "恭喜你完成了游戏的所有关卡，点击重玩游戏，重新开始游戏",
      options: [{ text: "重玩游戏", isCorrect: "true", nextScene: 0 }],
      npcName: "宫崎骏",
      npcAvatar: "/avatars/gongqijun.jpg",
      backgroundVideo: "/videos/qianyuqianxun.mp4",
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
    // const music = new Howl({
    //   src: ["/music/lvpishu.FLAC"], // 需要添加背景音乐文件
    //   loop: true,
    //   volume: 0.2,
    // });
    // setBgMusic(music);
    // music.play();
    return () => {
      // music.stop();
    };
  }, []);

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

  return (
    <div className="story-game">
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

      <div className="content-overlay">
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(currentScene / (scenes.length - 1)) * 100}%`,
              backgroundColor: theme.button.primary,
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
