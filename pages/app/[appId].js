import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function AppDetail() {
  const router = useRouter();
  const [appData, setAppData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return; // 确保 router 已准备好

    const { appId, type } = router.query; // 获取 id 和 type
    console.log("appId", appId, "type", type);
    if (appId) {
      // 根据传递的 type 进行重定向
      switch (type) {
        case "english":
          router.push(`/app/english/${appId}`);
          break;
        default:
          router.push("/app/index");
          break;
      }
    }
  }, [router.isReady, router.query, router]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  if (!appData) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1>{appData.name}</h1>
      <p>{appData.description}</p>
      {/* 在这里添加更多应用详情的内容 */}
    </div>
  );
}
