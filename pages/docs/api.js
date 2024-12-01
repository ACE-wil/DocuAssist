import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function ApiDocumentation() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  return (
    <div>
      <h1>API文档</h1>
      <p>查看我们的API文档,了解如何与我们的平台进行集成。</p>
      {/* 在这里添加API文档的具体内容 */}
    </div>
  );
}
