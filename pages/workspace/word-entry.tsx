import { useState, useEffect, useCallback, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import btnSvg from "./assets/img/btn.svg";
import { useRouter } from "next/router";

const Souye = () => {
  const [time, setTime] = useState(4735); // 初始时间为 01:19:15 的秒数
  const router = useRouter();
  const [swiperRef, setSwiperRef] = useState(null);

  const handlePrev = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      // Instead of reloading, you might want to fetch or reset data here
      // fetchData();
      window.location.reload();
      console.log(1);
    }

    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      // Consider not removing the hasRefreshed flag here
    };
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, []);

  const itemBox = [
    {
      id: 1,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 2,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 3,
      img: "/assets/img/wordtree.jpg",
      current: 0,
      total: 1100,
      title: "世界树",
      content:
        "世界树为你解决各种疑问难题，一个问题提供三种方案,让你不再迷茫。世界树的音译名为尤克特拉希尔（古诺尔斯语：Askr Yggdrasills，英语：Yggdrasill）。",
    },
    {
      id: 4,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 5,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 6,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 7,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 8,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
    {
      id: 9,
      img: "/assets/img/1.png",
      current: 0,
      total: "965",
      title: "诗词歌赋",
      content:
        "精选《唐诗三百首》，《宋词三百首》，《诗经》作品共九百余篇，是中小学必学的古文内容，一边学拼音，一边背诵诗词，同时练习打字速度，一举多得。",
    },
  ];
  const GotoNav = useCallback(
    (item) => {
      if (item === 2) {
        router.push("/tshisanbai");
      } else if (item === 3) {
        router.push("/wordtree");
      }
    },
    [router]
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="souye">
        <div
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: "15px",
            top: "43%",
            zIndex: 10,
            cursor: "pointer",
            width: "170px",
            height: "170px",
          }}
        >
          <img
            src="/assets/img/btn.svg"
            alt="Previous"
            style={{
              transform: "scaleX(-1)",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "15px",
            top: "43%",
            zIndex: 10,
            cursor: "pointer",
            width: "170px",
            height: "170px",
          }}
        >
          <img
            src="/assets/img/btn.svg"
            alt="Next"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        {/* 导航 */}
        <div className="navigat">
          <div className="left">
            <img src="/assets/logo.png" alt="" />
          </div>
          <ul className="right">
            <li className="top1">
              <div className="fj"></div>
              <div>
                <img src="/assets/img/2.png" alt="" />
              </div>
            </li>
            <li>
              <svg
                data-t="1734070669291"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6454"
                data-spm-anchor-id="a313x.search_index.0.i22.4a4c3a81jwdopG"
                width="30"
                height="30"
              >
                <path
                  d="M512 76.8C271.6416 76.8 76.8 271.6416 76.8 512s194.8416 435.2 435.2 435.2 435.2-194.8416 435.2-435.2S752.3584 76.8 512 76.8zM25.6 512C25.6 243.3664 243.3664 25.6 512 25.6s486.4 217.7664 486.4 486.4-217.7664 486.4-486.4 486.4S25.6 780.6336 25.6 512z"
                  fill="#3A4453"
                  p-id="6455"
                ></path>
                <path
                  d="M544 544m-390.4 0a390.4 390.4 0 1 0 780.8 0 390.4 390.4 0 1 0-780.8 0Z"
                  fill="#b24e80"
                  p-id="6456"
                  data-spm-anchor-id="a313x.search_index.0.i23.4a4c3a81jwdopG"
                  className=""
                ></path>
                <path
                  d="M332.8 358.4a51.2 51.2 0 0 1 51.2 51.2v128a51.2 51.2 0 0 1-102.4 0V409.6a51.2 51.2 0 0 1 51.2-51.2zM753.2544 383.5648a44.8 44.8 0 0 1-10.4192 62.4896L704.2816 473.6l38.5536 27.5456a44.8 44.8 0 1 1-52.0704 72.9088l-89.6-64a44.8 44.8 0 0 1 0-72.9088l89.6-64a44.8 44.8 0 0 1 62.4896 10.4192z"
                  fill="#1e1e1e"
                  p-id="6457"
                  data-spm-anchor-id="a313x.search_index.0.i20.4a4c3a81jwdopG"
                  className=""
                ></path>
              </svg>
              我的
            </li>
            <li>
              <svg
                data-t="1734070760582"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="9255"
                data-spm-anchor-id="a313x.search_index.0.i27.4a4c3a81jwdopG"
                width="30"
                height="30"
              >
                <path
                  d="M658.9952 649.216m-212.7872 0a212.7872 212.7872 0 1 0 425.5744 0 212.7872 212.7872 0 1 0-425.5744 0Z"
                  fill="#b24e80"
                  p-id="9256"
                  data-spm-anchor-id="a313x.search_index.0.i29.4a4c3a81jwdopG"
                  className="selected"
                ></path>
                <path
                  d="M728.064 121.5488H306.176c-87.5008 0-158.72 71.2192-158.72 158.72v457.1136c0 87.5008 71.2192 158.72 158.72 158.72h421.888c87.5008 0 158.72-71.2192 158.72-158.72V280.2688c0-87.5008-71.2192-158.72-158.72-158.72z m-149.0432 51.2v265.6768L494.848 372.0192a50.66752 50.66752 0 0 0-31.488-10.9568c-11.1104 0-22.2208 3.6352-31.488 10.9568L347.648 438.4256V172.7488h231.3728z m256.5632 564.6336c0 59.2896-48.2304 107.52-107.52 107.52H306.176c-59.2896 0-107.52-48.2304-107.52-107.52V280.2688c0-56.0128 43.0592-102.0928 97.792-107.008v299.4176a34.3552 34.3552 0 0 0 19.5072 31.1296c12.032 5.8368 26.0096 4.3008 36.5056-3.9424l110.6432-87.6032 111.0528 87.6032c6.2464 4.9152 13.7728 7.4752 21.3504 7.4752 5.12 0 10.2912-1.1776 15.1552-3.5328a34.3552 34.3552 0 0 0 19.5072-31.1296V172.7488h97.8432c59.2896 0 107.52 48.2304 107.52 107.52v457.1136z"
                  fill="#b24e80"
                  p-id="9257"
                  data-spm-anchor-id="a313x.search_index.0.i28.4a4c3a81jwdopG"
                  className=""
                ></path>
              </svg>
              帮助
            </li>
            <li className="top2">
              <img src="/assets/img/bj.png" alt="" />
              <div className="item1">
                <img src="/assets/img/4.png" alt="" />
                尊享会员权益,解锁新课程
              </div>
              <div className="item2">
                立即解锁
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="11489"
                  width="20"
                  height="20"
                >
                  <path
                    d="M482.016617 797.809421l259.8287-259.827677c15.98302-15.985066 15.98302-35.979446 0-51.963489l-259.8287-259.827677c-5.996574-5.996574-13.988596-9.987468-23.976064-9.987468-9.997702 0-19.995403 3.990894-25.981744 9.987468l-57.970296 59.965743c-7.992021 5.996574-11.982916 13.988596-11.982916 23.976064 0 11.993149 3.990894 19.995403 11.982916 25.981744l173.890422 175.885869-173.890422 175.87666c-7.992021 5.995551-11.982916 13.998829-11.982916 25.989931 0 9.989515 3.990894 17.97949 11.982916 23.978111l57.970296 59.965743c5.986341 5.995551 15.984043 9.987468 25.981744 9.987468C468.026998 807.79689 476.019019 803.804972 482.016617 797.809421L482.016617 797.809421zM891.737162 731.84608c-39.969317 65.963341-93.928253 119.922277-159.891593 159.891593-63.956637 37.975916-137.900743 57.961086-219.847104 57.961086-81.94636 0-155.889443-19.984147-219.84608-57.961086-65.962318-39.969317-119.921253-93.928253-159.891593-159.891593-37.974893-63.956637-57.960063-137.900743-57.960063-219.84608 0-81.94636 19.98517-155.890466 57.960063-219.847104 39.97034-65.962318 93.929276-119.921253 159.891593-159.891593 63.956637-37.974893 137.900743-57.960063 219.84608-57.960063 81.94636 0 155.890466 19.98517 219.847104 57.960063 65.963341 39.97034 119.922277 93.929276 159.891593 159.891593 37.975916 63.956637 57.961086 137.900743 57.961086 219.847104C949.697225 593.945337 929.713079 667.889443 891.737162 731.84608z"
                    fill="#b24e80"
                    p-id="11490"
                  ></path>
                </svg>
              </div>
            </li>
            <li>
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="17461"
                data-spm-anchor-id="a313x.search_index.0.i39.4a4c3a81jwdopG"
                width="30"
                height="30"
              >
                <path
                  d="M938.496 469.504l-303.104-302.08a36.864 36.864 0 0 0-64 26.112V358.4H358.4a36.352 36.352 0 0 0-38.912 38.912V599.04a51.2 51.2 0 0 0 0 9.216 36.864 36.864 0 0 0 38.912 29.696h214.528v161.28a36.352 36.352 0 0 0 23.552 36.352 36.352 36.352 0 0 0 40.448-9.728l303.104-302.08a36.352 36.352 0 0 0 0-54.784z"
                  p-id="17462"
                  fill="#b24e80"
                  data-spm-anchor-id="a313x.search_index.0.i38.4a4c3a81jwdopG"
                  className=""
                ></path>
                <path
                  d="M440.32 812.544H228.864A88.064 88.064 0 0 1 140.8 724.48V269.824a88.064 88.064 0 0 1 88.064-87.552H440.32a25.6 25.6 0 0 0 0-51.2H228.864A139.264 139.264 0 0 0 89.6 269.824v454.144a139.264 139.264 0 0 0 139.264 139.264H440.32a25.6 25.6 0 1 0 0-51.2z"
                  p-id="17463"
                  fill="#b24e80"
                ></path>
              </svg>
              返回
            </li>
          </ul>
        </div>
        {/* 轮播图 */}
        <div className="mylunbo">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={30}
            slidesPerView="auto"
            onSwiper={(swiper) => setSwiperRef(swiper)}
            className="mySwiper"
          >
            {itemBox.map((item) => (
              <SwiperSlide key={item.id} style={{ width: "270px" }}>
                <div className="myItem" onClick={() => GotoNav(item.id)}>
                  <div
                    className="tp"
                    style={{ backgroundImage: `url(${item.img})` }}
                  ></div>
                  <div className="xtq">
                    <div className="tip">
                      已探索{item.current}/{item.total}
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.content}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* 底部优惠倒计时 */}
        <div className="footer">
          <div className="item1">
            <span>仅剩1天</span>
            <span>{formatTime(time)}</span>
            <span style={{ marginLeft: "20px", color: "#b14a80" }}>
              查看详情&gt;&gt;
            </span>
          </div>
          <div className="item2">
            <img src="/assets/img/5.png" alt="" />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Souye;
