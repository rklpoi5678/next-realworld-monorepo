"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "./auth-provider";

const protectedPaths = [
  '/articles',
  '/items',
]

const publicPaths = [
  '/',
  '/login',
  '/signup'
];

export default function RouteGuard({ children }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;
    const path = pathname.split("?")[0]

    const isProtectedRoute = protectedPaths.some(
      (route) => path === route || (path.startsWith(route + "/") && route !== "/")
    );

    const isPublicRoute = publicPaths.some(
      (route) => path === route || (path.startsWith(route + "/") && route !== "/")
    )

    if (isProtectedRoute && !user) {
      router.push("/login")
    }

    if (isPublicRoute && user) {
      router.push("/articles")
    }

  }, [user, pathname, router, isInitialized])

  if (!isInitialized) return null;

  return children;
}