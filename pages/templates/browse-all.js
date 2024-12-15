import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";
import { useTheme } from "@/contexts/ThemeContext";
export default function BrowseAllTemplates() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1 style={{ color: theme.text.primary }}>浏览全部模板</h1>
      <p style={{ color: theme.text.secondary }}>这里是所有可用模板的列表。</p>
    </div>
  );
}
