import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/ui/LoadingSpinner';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete and avoid double redirects
    if (!loading) {
      const targetRoute = isAuthenticated ? '/admin/dashboard' : '/admin/access';
      
      // Only redirect if we're not already on the target route
      if (router.pathname !== targetRoute) {
        console.log(`🔄 Index: Redirecting to ${targetRoute}`);
        router.replace(targetRoute); // Use replace instead of push to avoid back button issues
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while determining where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}