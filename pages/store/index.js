import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function StoreIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/store/popular');
  }, []);

  return (
    <div>
      <p>正在重定向到热门应用页面...</p>
    </div>
  );
}
