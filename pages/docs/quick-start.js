import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function QuickStart() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>快速入门</h1>
      <p style={{ color: theme.text.secondary }}>
        欢迎使用我们的平台!这里是快速入门指南,帮助您快速上手。
      </p>
      {/* 在这里添加快速入门的具体内容 */}
    </div>
  );
}
