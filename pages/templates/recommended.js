import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function RecommendedTemplates() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>推荐模板</h1>
      <p>这里是推荐模板列表。</p>
    </div>
  );
}
