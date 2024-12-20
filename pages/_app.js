import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Head from "next/head";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ReactFlowProvider } from "reactflow";

function MyApp({ Component, pageProps }) {
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
    </>
  );
}

export default MyApp;
