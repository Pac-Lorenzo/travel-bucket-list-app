import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login'); // or your landing screen
    }, 100); // delay to allow layout to mount

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
