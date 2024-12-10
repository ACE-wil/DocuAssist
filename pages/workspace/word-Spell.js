import React, { useState } from "react";
import { useEffect } from "react";
import styles from "@/styles/wordSpell.module.css";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function WordSpell() {
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
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);

  const handleKeyPress = (event) => {
    const { key } = event;
    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      const newInput = userInput + key;
      setUserInput(newInput);

      if (newInput.length === currentWord.length) {
        setProgress(progress + 1);

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

  const handleConfirm = () => {
    setShowModal(false);
    setProgress(0);
    setCurrentWordIndex(0);
    setCurrentWord(wordList[0].word);
  };

  const handleCancel = () => {
    setShowModal(false);
    setProgress(0);
    setCurrentWordIndex(0);
    setCurrentWord(wordList[0].word);
    setUserInput("");
  };

  return (
    <div className={styles.wordSpell} tabIndex={0} onKeyDown={handleKeyPress}>
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

      <div className={styles.phonetic}>
        {wordList[currentWordIndex].phonetic}
      </div>
      <div className={styles.meaning}>{wordList[currentWordIndex].meaning}</div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${(progress / wordList.length) * 100}%` }}
        ></div>
      </div>

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
    </div>
  );
}
