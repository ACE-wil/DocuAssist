import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function BasicFeatures() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>基本功能</h1>
      <p>了解我们平台的基本功能和使用方法。</p>
      {/* 在这里添加基本功能的具体介绍 */}
    </div>
  );
}
