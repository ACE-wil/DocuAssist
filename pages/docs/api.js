import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function ApiDocumentation() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>API文档</h1>
      <p style={{ color: theme.text.secondary }}>
        查看我们的API文档,了解如何与我们的平台进行集成。
      </p>
      {/* 在这里添加API文档的具体内容 */}
    </div>
  );
}
