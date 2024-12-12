import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate'; // Assuming this function checks if the user is authenticated

export default function RouteGuard({ children }) {
  const router = useRouter();
  const protectedRoutes = ['/favourites', '/history']; // List of protected routes

  useEffect(() => {
    // Only redirect to login if the user is unauthenticated and trying to access a protected route
    if (!isAuthenticated() && protectedRoutes.includes(router.pathname)) {
      router.push('/login'); // Redirect to login if unauthenticated
    }
  }, [router]);

  return children;
}
