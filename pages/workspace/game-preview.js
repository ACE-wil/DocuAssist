import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Howl } from 'howler';

export default function GamePreview() {
  const [currentScene, setCurrentScene] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const { theme } = useTheme();

  const scenes = [
    {
      npcDialog: "你好，旅行者。我是这个神秘世界的向导萨满。我注意到你似乎对这里很感兴趣？",
      npcAvatar: "/avatars/shaman.png",
      backgroundVideo: "/videos/forest.mp4",
      options: [
        { text: "是的，我想了解这个世界", nextScene: 1 },
        { text: "我只是在随便看看", nextScene: 2 }
      ]
    },
    {
      npcDialog: "欢迎来到魔法城市，我是城市守护者艾莉。这里东边是魔法学院，西边是商业区，南边是居民区。你想先去哪里？",
      npcAvatar: "/avatars/guardian.png",
      options: [
        { text: "去魔法学院学习", nextScene: 3 },
        { text: "去商业区逛逛", nextScene: 4 },
        { text: "参观居民区", nextScene: 5 }
      ]
    },
    {
      npcDialog: "我是流浪商人马可。这片土地确实危险重重，但也蕴藏着无尽的宝藏。需要我为你指路吗？",
      npcAvatar: "/avatars/merchant.png",
      options: [
        { text: "好的，请告诉我安全路线", nextScene: 6 },
        { text: "不用了，我喜欢冒险", nextScene: 7 }
      ]
    },
    {
      npcDialog: "你好，我是魔法学院的首席法师奥德里奇。你对哪个魔法学科感兴趣？",
      npcAvatar: "/avatars/wizard.png",
      options: [
        { text: "元素魔法", nextScene: 8 },
        { text: "时空魔法", nextScene: 9 },
        { text: "治疗魔法", nextScene: 10 }
      ]
    },
    {
      npcDialog: "我是商业区的珠宝匠人露娜。这里有许多稀有的魔法宝石，你想看看哪种？",
      npcAvatar: "/avatars/jeweler.png",
      options: [
        { text: "力量宝石", nextScene: 11 },
        { text: "智慧宝石", nextScene: 12 },
        { text: "生命宝石", nextScene: 13 }
      ]
    },
    {
      npcDialog: "恭喜你完成了所有探索!",
      npcAvatar: "/avatars/guide.png",
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

  return (
    <div className="story-game">
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
          height: 94vh;
          overflow: hidden;
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
          background: ${theme.dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 20px;
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
          background: ${theme.dark ? 'rgba(88, 28, 135, 0.95)' : theme.surface};
          color: ${theme.text.primary};
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          width: 80%;
          max-width: 600px;
          box-shadow: ${theme.shadow};
          backdrop-filter: blur(8px);
        }

        .npc-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid ${theme.dark ? 'rgba(139, 92, 246, 0.5)' : theme.border};
        }

        .npc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dialog-content {
          flex: 1;
        }

        .npc-name {
          font-weight: bold;
          margin-bottom: 8px;
          color: ${theme.dark ? '#a78bfa' : theme.primary};
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
          background: ${theme.dark ? 'rgba(88, 28, 135, 0.2)' : 'white'};
          border: ${theme.dark ? '2px solid rgba(139, 92, 246, 0.3)' : `2px solid ${theme.border}`};
          border-radius: 8px;
          color: black;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        button:hover {
          background: ${theme.dark ? 'rgba(139, 92, 246, 0.3)' : theme.button.primary};
          border-color: ${theme.dark ? 'rgba(139, 92, 246, 0.6)' : theme.button.primary};
          color: white;
          transform: translateY(-2px);
          box-shadow: ${theme.dark ? '0 4px 12px rgba(139, 92, 246, 0.2)' : theme.shadow};
        }
      `}</style>
    </div>
  );
}
