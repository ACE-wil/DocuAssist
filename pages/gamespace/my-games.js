import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function MyGames() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>我的游戏</h1>
      <p>欢迎使用我们的平台!这里是快速入门指南,帮助您快速上手。</p>
      {/* 在这里添加快速入门的具体内容 */}
    </div>
  );
}
