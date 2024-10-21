import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WorkspaceIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/workspace/my-bots');
  }, []);

  return null; // 这个页面会立即重定向,所以不需要渲染任何内容
}
