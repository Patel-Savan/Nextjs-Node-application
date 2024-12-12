import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/History.module.css'; // Import the History page CSS module
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate'; // Assuming this function checks if the user is authenticated
import RouteGuard from '@/components/RouteGuard'; // Import RouteGuard to protect specific routes

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const protectedRoutes = ['/favourites', '/history']; // List of protected routes

  // Render the route guard only for protected routes
  const isRouteProtected = protectedRoutes.includes(router.pathname);

  return (
    <Layout>
      {isRouteProtected ? (
        // Apply RouteGuard to protected routes
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      ) : (
        // For non-protected routes, just render the component
        <Component {...pageProps} />
      )}
    </Layout>
  );
}

export default MyApp;
