import React, { useRef, useState } from "react";

export default function WordSpellEntry() {
  const carouselRef = useRef(null);

  // showHover 用于记录每个图片是否需要显示 hover-text
  // timers 用于记录 setTimeout 的引用，方便在 onMouseLeave 时清除
  const [showHover, setShowHover] = useState({});
  const [timers, setTimers] = useState({});

  const images = [
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
  ];

  const scrollAmount = 200; // 每次滚动的距离

  // 鼠标进入时：开启 0.5 秒的定时器，到点后把 hover-text 的状态设置为 true
  const handleMouseEnter = (index) => {
    const timer = setTimeout(() => {
      setShowHover((prev) => ({
        ...prev,
        [index]: true,
      }));
    }, 500);

    setTimers((prev) => ({ ...prev, [index]: timer }));
  };

  // 鼠标离开时：清除定时器，并把对应 hover-text 状态重置回 false
  const handleMouseLeave = (index) => {
    if (timers[index]) {
      clearTimeout(timers[index]);
    }
    setShowHover((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ccc",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="carousel">
        <button className="arrow left" onClick={handlePrev}>
          &lt;
        </button>
        <div className="carousel-container" ref={carouselRef}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {images.map((src, index) => (
              <div
                key={index}
                className="carousel-item"
                style={{ position: "relative" }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <img src={src} alt="carousel" className="carousel-image" />
                <div
                  className="image-caption-container"
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                >
                  <div className="image-caption">图片描述 {index + 1}</div>
                  <div className="image-caption">图片描述2 {index + 1}</div>
                  <div
                    className={`hover-text ${
                      showHover[index] ? "hover-text-active" : ""
                    }`}
                  >
                    这段内容在鼠标悬停 0.5 秒后才展开。
                    <br />
                    通过 max-height 实现展开/收缩动画。
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="arrow right" onClick={handleNext}>
          &gt;
        </button>
      </div>

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${
              ((carouselRef.current?.scrollLeft || 0) /
                (carouselRef.current?.scrollWidth -
                  carouselRef.current?.clientWidth)) *
              100
            }%`,
          }}
        ></div>
      </div>

      <style jsx>{`
        .carousel {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .carousel-container {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          margin: 0 25px;
          scrollbar-width: none;
        }
        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .carousel-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 0 0 calc(100% / 5);
          margin: 0 15px;
          overflow: visible;
          transition: flex 0.3s ease;
        }
        .carousel-item:hover {
          flex: 0 0 calc(100% / 4);
        }

        .carousel-image {
          width: 100%;
          height: auto;
          border-radius: 10px;
          scroll-snap-align: start;
          border: 1px solid #ccc;
        }

        .image-caption {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
        }

        /* 利用 max-height 来控制折叠展开 */
        .hover-text {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.5s ease-out;
          background-color: rgba(255, 255, 255, 0.9);
          color: #444;
          line-height: 1.4;
          padding: 0 15px; /* 先去掉上下内边距，避免默认就占位 */
          box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.2);
        }

        .hover-text-active {
          max-height: 200px; /* 取一个足以容纳文本的值 */
          padding: 10px 15px; /* 在此时才恢复上下内边距，以实现展开动画更平滑 */
        }

        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          font-size: 24px;
          border-radius: 50%;
          z-index: 5;
        }
        .left {
          left: 10px;
        }
        .right {
          right: 10px;
        }

        .progress-bar {
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.3);
        }
        .progress {
          height: 100%;
          background-color: white;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
