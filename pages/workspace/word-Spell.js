import React, { useState } from 'react';
import styles from './style/index.module.css';

export default function WordSpell() {
  const wordList = [
    { word: 'strap', phonetic: '/stræp/', meaning: '带子' },
    { word: 'hello', phonetic: '/həˈloʊ/', meaning: '你好' },
    { word: 'world', phonetic: '/wɜːrld/', meaning: '世界' },
    { word: 'react', phonetic: '/riˈækt/', meaning: '反应' },
    { word: 'learn', phonetic: '/lɜːrn/', meaning: '学习' },
    { word: 'coding', phonetic: '/ˈkoʊdɪŋ/', meaning: '编码' },
    { word: 'spell', phonetic: '/spɛl/', meaning: '拼写' },
    { word: 'study', phonetic: '/ˈstʌdi/', meaning: '学习' },
    { word: 'focus', phonetic: '/ˈfoʊkəs/', meaning: '专注' },
    { word: 'smart', phonetic: '/smɑːrt/', meaning: '聪明的' }
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(wordList[0].word);
  const [userInput, setUserInput] = useState('');
  const [progress, setProgress] = useState(0);

  const handleKeyPress = (event) => {
    const { key } = event;
    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      const newInput = userInput + key;
      setUserInput(newInput);

      if (newInput === currentWord.slice(0, newInput.length)) {
        if (newInput.length === currentWord.length) {
          if (progress >= 10) {
            setProgress(10);
          } else {
            setProgress(progress + 1);
          }
          setUserInput('');
          let nextIndex = (currentWordIndex + 1) % wordList.length;
          if (currentWordIndex + 1 >= 10) {
            setCurrentWordIndex(9);
            setCurrentWord(wordList[9].word);
          } else {
            setCurrentWordIndex(nextIndex);
            setCurrentWord(wordList[nextIndex].word);
          }
        }
      } else {
        setUserInput(newInput.slice(0, -1));
      }
    }
  };

  return (
    <div 
      className={styles.wordSpell} 
      tabIndex={0} 
      onKeyDown={handleKeyPress}
    >
      <div className={styles.word}>
        {currentWord.split('').map((letter, index) => {
          const isTyped = index < userInput.length;
          const isCorrect = isTyped && letter === userInput[index];
          const isWrong = isTyped && letter !== userInput[index];
          
          return (
            <div key={index} className={styles.letter}>
              <span className={`
                ${isCorrect ? styles.correct : ''}
                ${isWrong ? styles.incorrect : ''}
              `}>
                {letter}
              </span>
              <div className={styles.underline}></div>
            </div>
          );
        })}
      </div>

      <div className={styles.phonetic}>
        {wordList[currentWordIndex].phonetic}
      </div>
      <div className={styles.meaning}>
        {wordList[currentWordIndex].meaning}
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${(progress / wordList.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}