import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../contexts/ThemeContext";
import MainNavigation from "./MainNavigation";
import SecondaryNavigation from "./SecondaryNavigation";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import { setLoading } from "../store/loadingSlice";

export default function Layout({ children }) {
  const { theme, isDark } = useTheme();
  const [activeMainNav, setActiveMainNav] = useState("home");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const isNavigationVisible = useSelector(
    (state) => state.navigation.isVisible
  );
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;
    if (path === "/" || path === "/home") setActiveMainNav("home");
    else if (path.startsWith("/workspace")) setActiveMainNav("workspace");
    else if (path.startsWith("/store")) setActiveMainNav("store");
    else if (path.startsWith("/templates")) setActiveMainNav("templates");
    else if (path.startsWith("/docs")) setActiveMainNav("docs");
  }, [router.pathname]);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        dispatch(setLoading(true));
      }
    };
    const handleComplete = (url) => {
      if (url === router.asPath) {
        dispatch(setLoading(false));
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router, dispatch]);

  return (
    <div className="layout">
      {isNavigationVisible && (
        <div
          className={`navigation-container ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          <MainNavigation
            activeNav={activeMainNav}
            setActiveNav={setActiveMainNav}
            isMessageBoxOpen={isMessageBoxOpen}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
          />
          <SecondaryNavigation
            activeMainNav={activeMainNav}
            isExpanded={isExpanded}
          />
          <button
            className="toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              color: isDark ? theme.text.secondary : theme.text.primary,
            }}
          >
            {isExpanded ? "<<" : ">>"}
          </button>
        </div>
      )}
      <main
        className={`content-container ${
          !isNavigationVisible ? "fullscreen" : ""
        }`}
        style={{ position: "relative" }}
      >
        {loading && <LoadingSpinner />}
        {children}
      </main>
      <style jsx>{`
        .layout {
          display: flex;
          height: 100vh;
          background-color: ${theme.background};
        }
        .navigation-container {
          min-width: 280px;
          display: flex;
          background-color: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin: 15px;
          position: relative;
          transition: width 0.3s ease;
        }
        .navigation-container.expanded {
          width: 280px;
        }
        .navigation-container.collapsed {
          width: 80px;
          min-width: 80px;
        }
        .content-container {
          flex-grow: 1;
          padding: 20px;
          overflow-y: auto;
          position: relative;
        }
        .toggle-btn {
          position: absolute;
          bottom: 10px;
          right: ${isExpanded ? "20px" : "26px"};
          background: none;
          border: none;
          cursor: pointer;
          z-index: 10;
        }
        .content-container.fullscreen {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
