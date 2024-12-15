import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function AdvancedFeatures() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>高级功能</h1>
      <p style={{ color: theme.text.secondary }}>
        探索我们平台的高级功能,提升您的使用体验。
      </p>
      {/* 在这里添加高级功能的具体介绍 */}
    </div>
  );
}
