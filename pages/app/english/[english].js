import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function EnglishApp() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div style={{ padding: "20px" }}>
      <h1>English App</h1>
      <p>欢迎来到英语应用页面！</p>
      {/* 你可以在这里添加更多的内容和组件 */}
    </div>
  );
}
