import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import "@/styles/word-entry.less";
import "swiper/less";
import "swiper/less/navigation";
import "swiper/less/pagination";
import "swiper/less/scrollbar";
import Head from "next/head";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ReactFlowProvider } from "reactflow";
import LoginModal from "../components/LoginModal";

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem("token");
    if (!token && router.pathname !== "/login") {
      setShowLoginModal(true);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>DocuAssist - 智能文档助手</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Provider store={store}>
        <ThemeProvider>
          <ReactFlowProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ReactFlowProvider>
        </ThemeProvider>
      </Provider>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            // 登录成功后关闭
            setShowLoginModal(false);
            setIsLoggedIn(true);
          }}
        />
      )}
    </>
  );
}

export default MyApp;
