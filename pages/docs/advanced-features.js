import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function AdvancedFeatures() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>高级功能</h1>
      <p>探索我们平台的高级功能,提升您的使用体验。</p>
      {/* 在这里添加高级功能的具体介绍 */}
    </div>
  );
}
