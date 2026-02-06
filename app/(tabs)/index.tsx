import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // redirect to new dashboard (old home deprecated)
  const router = useRouter();
  useEffect(() => {
    router.replace('/(tabs)/dashboard');
  }, [router]);
  return null;
}
