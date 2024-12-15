import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";

export default function FAQ() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  const { theme } = useTheme();
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>常见问题</h1>
      <p style={{ color: theme.text.secondary }}>查找常见问题的解答。</p>
      {/* 在这里添加常见问题及其答案 */}
    </div>
  );
}
