import React, { useRef } from "react";

export default function WordSpellEntry() {
  const carouselRef = useRef(null);
  const images = [
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    "/word-img/chinese-poems.png",
    // 添加更多图片路径
  ];

  const scrollAmount = 200; // 每次滚动的距离

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
        <div className="carousel-container">
          <div className="carousel-images" ref={carouselRef}>
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="carousel"
                className="carousel-image"
              />
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
          align-items: center; /* 垂直居中 */
          justify-content: center;
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .carousel-images {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          transition: scroll-left 0.5s ease;
          overflow: hidden;
          margin: 0 25px;
        }
        .carousel-image {
          flex: 0 0 auto;
          width: calc(100% / 4.5);
          height: auto;
          border-radius: 10px;
          margin: 0 25px;
          scroll-snap-align: start;
          border: 1px solid #ccc;
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
          z-index: 1;
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
