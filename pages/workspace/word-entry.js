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
        <div className="carousel-container" ref={carouselRef}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {images.map((src, index) => (
              <div
                key={index}
                className="carousel-item"
                style={{ margin: "0px 20px" }}
              >
                <img src={src} alt="carousel" className="carousel-image" />
                <div className="image-caption">图片描述 {index + 1}</div>
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
        .carousel-container {
          display: flex;
          overflow-x: auto; /* 确保可以水平滚动 */
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          transition: scroll-left 0.5s ease;
          margin: 0 25px;
          scrollbar-width: none; /* Firefox */
        }
        .carousel-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .carousel-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* 垂直居中 */
          transition: flex 0.3s ease, transform 0.3s ease; /* 添加过渡效果 */
          flex: 1; /* 默认每个项目占据相同的空间 */
        }
        .carousel-item:hover {
          flex: 1.5; /* 鼠标悬停时增加空间 */
        }
        .carousel-image {
          width: 100%; /* 让图片占满父容器的宽度 */
          height: auto;
          border-radius: 10px;
          margin: 0 25px;
          scroll-snap-align: start;
          border: 1px solid #ccc;
        }
        .image-caption {
          margin-top: 10px;
          font-size: 14px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
