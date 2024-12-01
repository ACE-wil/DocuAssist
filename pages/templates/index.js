import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function TemplatesIndex() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  useEffect(() => {
    router.replace("/templates/recommended");
  }, []);

  return (
    <div>
      <p>正在重定向到推荐模板页面...</p>
    </div>
  );
}
