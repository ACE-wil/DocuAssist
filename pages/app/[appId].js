import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loadingSlice";

export default function AppDetail() {
  const router = useRouter();
  const { appId } = router.query; // 获取动态路由参数
  const [appData, setAppData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (appId) {
      // 根据 appId 获取应用详情
      const fetchAppData = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/apps/${appId}`
          );
          setAppData(response.data);
        } catch (error) {
          console.error("获取应用详情失败:", error);
        }
      };

      fetchAppData();
    }
  }, [appId]);

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
