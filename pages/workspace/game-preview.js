import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Howl } from 'howler';
import { useDispatch } from 'react-redux';
import { setNavigationVisibility } from '../../store/navigationSlice';

export default function GamePreview() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const scenes = [
    {
      npcName: "萨满",
      npcDialog: "你好，旅行者。我是这个神秘世界的向导萨满。我注意到你似乎对这里很感兴趣？",
      npcAvatar: "/avatars/shaman.png",
      backgroundVideo: "/videos/2077.mp4",
      options: [
        { text: "是的，我想了解这个世界", nextScene: 1 },
        { text: "我只是在随便看看", nextScene: 2 }
      ]
    },
    {
      npcName: "艾莉",
      npcDialog: "欢迎来到魔法城市，我是城市守护者艾莉。这里东边是魔法学院，西边是商业区，南边是居民区。你想先去哪里？",
      npcAvatar: "/avatars/guardian.png",
      backgroundVideo: "/videos/forest.mp4",
      options: [
        { text: "去魔法学院学习", nextScene: 3 },
        { text: "去商业区逛逛", nextScene: 4 },
        { text: "参观居民区", nextScene: 5 }
      ]
    },
    {
      npcName: "马可",
      npcDialog: "我是流浪商人马可。这片土地确实危险重重，但也蕴藏着无尽的宝藏。需要我为你指路吗？",
      npcAvatar: "/avatars/merchant.png",
      backgroundVideo: "/videos/market-street.mp4",
      options: [
        { text: "好的，请告诉我安全路线", nextScene: 6 },
        { text: "不用了，我喜欢冒险", nextScene: 7 }
      ]
    },
    {
      npcName: "奥德里奇",
      npcDialog: "你好，我是魔法学院的首席法师奥德里奇。你对哪个魔法学科感兴趣？",
      npcAvatar: "/avatars/wizard.png",
      backgroundVideo: "/videos/magic-academy.mp4",
      options: [
        { text: "元素魔法", nextScene: 8 },
        { text: "时空魔法", nextScene: 9 },
        { text: "治疗魔法", nextScene: 10 }
      ]
    },
    {
      npcName: "露娜",
      npcDialog: "我是商业区的珠宝匠人露娜。这里有许多稀有的魔法宝石，你想看看哪种？",
      npcAvatar: "/avatars/jeweler.png",
      backgroundVideo: "/videos/jewelry-shop.mp4",
      options: [
        { text: "力量宝石", nextScene: 11 },
        { text: "智慧宝石", nextScene: 12 },
        { text: "生命宝石", nextScene: 13 }
      ]
    },
    {
      npcName: "向导",
      npcDialog: "恭喜你完成了所有探索!",
      npcAvatar: "/avatars/guide.png",
      backgroundVideo: "/videos/ending-scene.mp4",
      options: [
        { text: "重新开始冒险", nextScene: 0 },
        { text: "结束游戏", nextScene: 0 }
      ]
    }
  ];

  // 定义所有音效
  const sounds = {
    hover: new Howl({
      src: ['/sounds/hover.mp3'],
      volume: 0.4
    }),
    click: new Howl({
      src: ['/sounds/click.mp3'],
      volume: 0.6
    })
  };

  const handleChoice = (nextScene) => {
    sounds.click.play();
    setGameHistory([...gameHistory, currentScene]);
    
    // 检查是否是最后一个场景
    if (nextScene >= scenes.length) {
      // 如果是最后一个场景,跳回开头
      setCurrentScene(0);
      // 清空历史记录
      setGameHistory([]);
    } else {
      // 否则正常切换到下一个场景
      setCurrentScene(nextScene);
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
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
      <button className="fullscreen-btn" onClick={toggleFullscreen}>
        {isFullscreen ? '退出全屏' : '进入全屏'}
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
          <div className="progress" style={{
            width: `${(currentScene / (scenes.length - 1)) * 100}%`
          }} />
        </div>

        <div className="dialog-box">
          <div className="npc-avatar">
            <img src={scenes[currentScene].npcAvatar} alt="NPC" />
          </div>
          <div className="dialog-content">
            <div className="npc-name">{scenes[currentScene].npcName}</div>
            <p>{scenes[currentScene].npcDialog}</p>
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
          height: ${isFullscreen ? '100vh' : '94vh'};
          overflow: hidden;
          margin: ${isFullscreen ? '0' : 'inherit'};
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
          background: ${theme.dark ? 'rgba(255, 255, 255, 0.1)' : '#edf2f7'};
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
          background: ${theme.dark ? 
            'linear-gradient(135deg, rgba(18, 6, 38, 0.9), rgba(44, 10, 74, 0.9))' : 
            'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(230, 230, 250, 0.9))'
          };
          border: 2px solid ${theme.dark ? '#8a2be2' : '#4b0082'};
          box-shadow: 
            0 0 10px ${theme.dark ? '#8a2be2' : '#4b0082'},
            0 0 20px ${theme.dark ? '#8a2be2' : '#4b0082'},
            inset 0 0 15px ${theme.dark ? 'rgba(138, 43, 226, 0.5)' : 'rgba(75, 0, 130, 0.5)'};
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
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            ${theme.dark ? 'rgba(138, 43, 226, 0.1)' : 'rgba(75, 0, 130, 0.1)'} 0%,
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
          border: 3px solid ${theme.dark ? '#8a2be2' : '#4b0082'};
          box-shadow: 
            0 0 10px ${theme.dark ? '#8a2be2' : '#4b0082'},
            0 0 20px ${theme.dark ? '#8a2be2' : '#4b0082'};
        }

        .npc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: ${theme.dark ? 'brightness(1.2) contrast(1.1)' : 'none'};
        }

        .dialog-content {
          flex: 1;
          z-index: 1;
        }

        .npc-name {
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          font-size: 1.2em;
          margin-bottom: 8px;
          color: ${theme.dark ? '#ff00ff' : '#8a2be2'};
          text-shadow: 
            0 0 5px ${theme.dark ? '#ff00ff' : '#8a2be2'},
            0 0 10px ${theme.dark ? '#ff00ff' : '#8a2be2'};
        }

        .dialog-content p {
          font-family: 'Rajdhani', sans-serif;
          line-height: 1.6;
          color: ${theme.dark ? '#e0e0e0' : '#2d0a4e'};
          text-shadow: 0 0 2px ${theme.dark ? 'rgba(224, 224, 224, 0.5)' : 'rgba(45, 10, 78, 0.5)'};
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
          background: ${theme.dark ? 'rgba(88, 28, 135, 0.2)' : 'rgba(255, 255, 255, 0.8)'};
          border: ${theme.dark ? '2px solid rgba(139, 92, 246, 0.3)' : `2px solid rgba(255, 255, 255, 0.3)`};
          border-radius: 8px;
          color: ${theme.dark ? '#fff' : '#000'};
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        }

        button:hover {
          background: ${theme.dark ? 
            'linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(0, 255, 255, 0.3))' : 
            'linear-gradient(45deg, rgba(255, 0, 128, 0.2), rgba(0, 255, 255, 0.2))'
          };
          border-color: ${theme.dark ? 
            'rgba(0, 255, 255, 0.6)' : 
            'rgba(255, 0, 128, 0.6)'
          };
          color: ${theme.dark ? '#fff' : '#000'};
          transform: translateY(-2px);
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.3),
            0 0 30px rgba(255, 0, 128, 0.3);
          text-shadow: 
            0 0 8px rgba(255, 255, 255, 0.8),
            0 0 12px rgba(0, 255, 255, 0.5);
        }

        button:hover::before {
          content: '';
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
          background: ${theme.dark ? 'rgba(88, 28, 135, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
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
          background: ${theme.dark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
        }

        /* 全屏时的样式调整 */
        :global(html:fullscreen) .story-game {
          height: 100vh;
          width: 100vw;
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
