import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function StoreIndex() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 组件挂载后关闭 loading
    dispatch(setLoading(false));
  }, [dispatch]);
  const router = useRouter();

  useEffect(() => {
    router.replace("/store/popular");
  }, []);

  return (
    <div>
      <p>正在重定向到热门应用页面...</p>
    </div>
  );
}
