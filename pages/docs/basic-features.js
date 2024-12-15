import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function BasicFeatures() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>基本功能</h1>
      <p style={{ color: theme.text.secondary }}>
        了解我们平台的基本功能和使用方法。
      </p>
      {/* 在这里添加基本功能的具体介绍 */}
    </div>
  );
}
