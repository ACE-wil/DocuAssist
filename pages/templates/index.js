import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TemplatesIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/templates/recommended');
  }, []);

  return (
    <div>
      <p>正在重定向到推荐模板页面...</p>
    </div>
  );
}
