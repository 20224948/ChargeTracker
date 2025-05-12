import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexRedirect() {
  useEffect(() => {
    // Redirect immediately to login on initial load
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
