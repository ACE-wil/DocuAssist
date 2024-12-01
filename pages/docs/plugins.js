import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function Plugins() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>插件使用</h1>
      <p>学习如何使用和管理插件,扩展平台功能。</p>
      {/* 在这里添加插件使用的具体说明 */}
    </div>
  );
}
