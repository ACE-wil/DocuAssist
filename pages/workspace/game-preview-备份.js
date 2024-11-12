import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Howl } from 'howler';
import NPC from '../../components/NPC';
import SoundController from '../../components/SoundController';

export default function GamePreview() {
  const [scene, setScene] = useState(0);
  const { theme } = useTheme();
  const [bgMusic, setBgMusic] = useState(null);

  // 初始化背景音乐
  useEffect(() => {
    const music = new Howl({
      src: ['/sounds/background-music.mp3'], // 需要添加背景音乐文件
      loop: true,
      volume: 0.5
    });
    setBgMusic(music);
    music.play();

    return () => {
      music.stop();
    };
  }, []);

  // 朗读文本
  const speak = (text) => {
    // 停止之前的朗读
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  // 定义所有音效
  const sounds = {
    background: new Howl({
      src: ['/sounds/background-music.mp3'],
      loop: true,
      volume: 0.3
    }),
    hover: new Howl({
      src: ['/sounds/hover.mp3'],
      volume: 0.4
    }),
    click: new Howl({
      src: ['/sounds/click.mp3'],
      volume: 0.6
    }),
    success: new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.7
    }),
    ambient: new Howl({
      src: ['/sounds/ambient.mp3'],
      loop: true,
      volume: 0.2
    })
  };

  const handleChoice = (nextScene) => {
    // 播放点击音效
    sounds.click.play();
    
    // 如果是最后一个场景，播放成功音效
    if (nextScene === scenes.length - 1) {
      sounds.success.play();
    }

    setScene(nextScene);
    speak(scenes[nextScene].text);
  };

  // 鼠标悬停效果
  const handleHover = () => {
    sounds.hover.play();
  };

  // 当场景首次加载时朗读文本
  useEffect(() => {
    speak(scenes[scene].text);
  }, []);

  useEffect(() => {
    // 加载保存的音量设置
    const savedBgVolume = localStorage.getItem('volume_background');
    const savedEffectsVolume = localStorage.getItem('volume_effects');
    
    if (savedBgVolume) {
      sounds.background.volume(parseFloat(savedBgVolume));
    }
    
    if (savedEffectsVolume) {
      sounds.click.volume(parseFloat(savedEffectsVolume));
      sounds.hover.volume(parseFloat(savedEffectsVolume));
      sounds.success.volume(parseFloat(savedEffectsVolume));
    }
  }, []);

  const scenes = [
    {
      background: 'url(/path/to/scene1.jpg)',
      character: '/luffy.gif',
      text: '欢迎来到我们的冒险游戏！你会选择哪条路？',
      choices: [
        { text: '左边的路', nextScene: 1 },
        { text: '右边的路', nextScene: 2 }
      ]
    },
    {
      background: 'url(/path/to/scene2.jpg)',
      character: '/luffy.gif',
      text: '你选择了左边的路，遇到了一个友好的村民。',
      choices: [
        { text: '继续前进', nextScene: 3 },
        { text: '返回', nextScene: 0 }
      ]
    },
    {
      background: 'url(/path/to/scene3.jpg)',
      character: '/luffy.gif',
      text: '你选择了右边的路，发现了一座神秘的城堡。',
      choices: [
        { text: '进入城堡', nextScene: 3 },
        { text: '返回', nextScene: 0 }
      ]
    },
    {
      background: 'url(/path/to/scene4.jpg)',
      character: '/luffy.gif',
      text: '你继续前进，发现了一个宝藏！',
      choices: [
        { text: '重新开始', nextScene: 0 }
      ]
    }
  ];

  return (
    <div className="story-game" style={{ 
      backgroundImage: scenes[scene].background,
      backgroundColor: theme.background
    }}>
      <SoundController 
        sounds={sounds} 
        onVolumeChange={(type, volume) => {
          // 可以在这里保存音量设置到 localStorage
          localStorage.setItem(`volume_${type}`, volume);
        }} 
      />
      <NPC />
      <div className="text-box">
        <p>{scenes[scene].text}</p>
        <div className="choices">
          {scenes[scene].choices.map((choice, index) => (
            <button 
              key={index} 
              onClick={() => handleChoice(choice.nextScene)}
              onMouseEnter={handleHover}
            >
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
          max-height: 300px;
          width: auto;
          object-fit: contain;
          margin-bottom: 20px;
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