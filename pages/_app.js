import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../contexts/ThemeContext";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
