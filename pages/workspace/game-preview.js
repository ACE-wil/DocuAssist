import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function GamePreview() {
  const [scene, setScene] = useState(0);
  const { theme } = useTheme();

  const scenes = [
    {
      background: 'url(/path/to/scene1.jpg)',
      character: '/path/to/character1.png',
      text: '欢迎来到我们的冒险游戏！你会选择哪条路？',
      choices: [
        { text: '左边的路', nextScene: 1 },
        { text: '右边的路', nextScene: 2 }
      ]
    },
    {
      background: 'url(/path/to/scene2.jpg)',
      character: '/path/to/character2.png',
      text: '你选择了左边的路，遇到了一个友好的村民。',
      choices: [
        { text: '继续前进', nextScene: 3 },
        { text: '返回', nextScene: 0 }
      ]
    },
    {
      background: 'url(/path/to/scene3.jpg)',
      character: '/path/to/character3.png',
      text: '你选择了右边的路，发现了一座神秘的城堡。',
      choices: [
        { text: '进入城堡', nextScene: 3 },
        { text: '返回', nextScene: 0 }
      ]
    },
    {
      background: 'url(/path/to/scene4.jpg)',
      character: '/path/to/character4.png',
      text: '你继续前进，发现了一个宝藏！',
      choices: [
        { text: '重新开始', nextScene: 0 }
      ]
    }
  ];

  const handleChoice = (nextScene) => {
    setScene(nextScene);
  };

  return (
    <div className="story-game" style={{ 
      backgroundImage: scenes[scene].background,
      backgroundColor: theme.background
    }}>
      <div className="character">
        <img src={scenes[scene].character} alt="Character" />
      </div>
      <div className="text-box">
        <p>{scenes[scene].text}</p>
        <div className="choices">
          {scenes[scene].choices.map((choice, index) => (
            <button key={index} onClick={() => handleChoice(choice.nextScene)}>
              {choice.text}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .story-game {
          position: relative;
          width: 100%;
          height: 100%;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          color: #fff;
          overflow: hidden;
          padding: 20px;
        }

        .character {
          position: relative;
          width: 100%;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .character img {
          max-height: 40vh;
          max-width: 100%;
          object-fit: contain;
        }

        .text-box {
          background: rgba(44, 0, 62, 0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
          width: 80%;
          max-width: 600px;
        }

        .choices button {
          margin: 10px;
          padding: 10px 20px;
          background: #6a0dad;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s;
          color: white;
        }

        .choices button:hover {
          background: #8a2be2;
        }
      `}</style>
    </div>
  );
}