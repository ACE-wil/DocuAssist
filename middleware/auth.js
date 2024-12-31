import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated && router.pathname !== "/login") {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    return <WrappedComponent {...props} />;
  };
}
