import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function SearchAgencies() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>搜索代理</h1>
      <p style={{ color: theme.text.secondary }}>
        使用此页面搜索特定的代理商。
      </p>
    </div>
  );
}
