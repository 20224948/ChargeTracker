import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexRedirect() {
  useEffect(() => {
    // Slight delay ensures the navigation stack is ready
    const timer = setTimeout(() => {
      router.replace('/login'); // or any other screen
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
