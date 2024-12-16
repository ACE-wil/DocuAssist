import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/wordSpell.module.css";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { setNavigationVisibility } from "@/store/navigationSlice";
export default function WordSpell() {
  const wordRef = useRef(null);

  useEffect(() => {
    if (wordRef.current) {
      wordRef.current.focus();
    }
  }, []);

  const wordList = [
    { word: "strap", phonetic: "/stræp/", meaning: "带子" },
    { word: "hello", phonetic: "/həˈloʊ/", meaning: "你好" },
    { word: "world", phonetic: "/wɜːrld/", meaning: "世界" },
    { word: "react", phonetic: "/riˈækt/", meaning: "反应" },
    { word: "learn", phonetic: "/lɜːrn/", meaning: "学习" },
    { word: "coding", phonetic: "/ˈkoʊdɪŋ/", meaning: "编码" },
    { word: "spell", phonetic: "/spɛl/", meaning: "拼写" },
    { word: "study", phonetic: "/ˈstʌdi/", meaning: "学习" },
    { word: "focus", phonetic: "/ˈfoʊkəs/", meaning: "专注" },
    { word: "smart", phonetic: "/smɑːrt/", meaning: "聪明的" },
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(wordList[0].word);
  const [userInput, setUserInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);

  const handleKeyPress = (event) => {
    if (showModal) return;

    const { key } = event;
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (key === "Backspace") {
      setUserInput(userInput.slice(0, -1));
    } else if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      const newInput = userInput + key;
      setUserInput(newInput);

      if (newInput.length === currentWord.length) {
        const isCorrect = newInput === currentWord;
        if (isCorrect) {
          setCorrectWords(correctWords + 1);
        }

        setProgress(progress + 1);
        calculateTypingSpeed(progress + 1);

        if (currentWordIndex === wordList.length - 1) {
          setProgress(wordList.length);
          setShowModal(true);
        } else {
          let nextIndex = (currentWordIndex + 1) % wordList.length;
          setCurrentWordIndex(nextIndex);
          setCurrentWord(wordList[nextIndex].word);
        }

        setUserInput("");
      }
    }
  };

  const calculateTypingSpeed = (completedWords) => {
    const endTime = Date.now();
    const timeDiff = (endTime - startTime) / 1000 / 60; // 转换为分钟
    const speed = completedWords / timeDiff;
    setTypingSpeed(Math.round(speed));
  };

  const handleConfirm = () => {
    setShowModal(false);
    setProgress(0);
    setCorrectWords(0);
    setCurrentWordIndex(0);
    setCurrentWord(wordList[0].word);
    setStartTime(null);
    setTypingSpeed(0);
  };

  const handleCancel = () => {
    setShowModal(false);
    setProgress(0);
    setCorrectWords(0);
    setCurrentWordIndex(0);
    setCurrentWord(wordList[0].word);
    setUserInput("");
    setStartTime(null);
    setTypingSpeed(0);
  };

  const handleFullScreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
        
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
        
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
        
      }
      dispatch(setNavigationVisibility(false));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      dispatch(setNavigationVisibility(true));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      dispatch(setNavigationVisibility(!isFull));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [dispatch]);

  const accuracy = ((correctWords / wordList.length) * 100).toFixed(1);
  const progressPercentage = ((progress / wordList.length) * 100).toFixed(1);

  return (
    <div
      className={styles.wordSpell}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onClick={() => wordRef.current && wordRef.current.focus()}
      ref={wordRef}
    >
      <div className={styles.word}>
        {currentWord.split("").map((letter, index) => {
          const isTyped = index < userInput.length;
          const isCorrect = isTyped && letter === userInput[index];
          const isWrong = isTyped && letter !== userInput[index];

          return (
            <div key={index} className={styles.letter}>
              <span
                className={`
                ${isCorrect ? styles.correct : ""}
                ${isWrong ? styles.incorrect : ""}
              `}
              >
                {letter}
              </span>
              {!isTyped && <div className={styles.underline}></div>}
            </div>
          );
        })}
      </div>

      <div className={styles.phonetic} style={{ userSelect: 'none' }}>
        {wordList[currentWordIndex].phonetic}
      </div>
      <div className={styles.meaning} style={{ userSelect: 'none' }}>
        {wordList[currentWordIndex].meaning}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${(progress / wordList.length) * 100}%` }}
        ></div>
      </div>

      <button onClick={handleFullScreen} className={styles.fullScreenButton}>
        {isFullscreen ? "退出全屏" : "全屏"}
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div>
            <img className={styles.img1} src="/word-img/1.png"></img>
          </div>
          <div className={styles.modalContent}>
            <h1 style={{ fontSize: "38px", marginTop: "10px" }}>完成</h1>
            <p>恭喜你完成了本次单词拼写测试~</p>
            <p>是否进入下一组单词拼写练习？</p>
            <img src="https://www.type.fun/assets/img-complete-learn.620fc579.png"></img>
            <div className={styles.tips}>
              <span>Tips:</span>
              <p>偷偷告诉你，在我的-设置里可以开关打字声音哦～</p>
            </div>
            <hr></hr>
            <div className={styles.results}>
              <p>最终准确率: {accuracy}%</p>
              <p>最终进度: {progressPercentage}%</p>
              <p>最终打字速度: {typingSpeed} 词/分钟</p>
            </div>
            <div className={styles.btn}>
              <button
                onClick={handleCancel}
                style={{ backgroundColor: "#3d4149", color: "white" }}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                style={{ backgroundColor: "#9965db", color: "white" }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal ? <div className={styles.myBlack}></div> : ""}

      <div className={styles.accuracy}>
        准确率: {accuracy}%
      </div>
      <div className={styles.typingSpeed}>
        打字速度: {typingSpeed} 词/分钟
      </div>
      <div className={styles.progressPercentage}>
        进度: {progressPercentage}%
      </div>
    </div>
  );
}
