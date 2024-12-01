import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function BrowseAllTemplates() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>浏览全部模板</h1>
      <p>这里是所有可用模板的列表。</p>
    </div>
  );
}
