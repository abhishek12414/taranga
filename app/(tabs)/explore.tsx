import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  // redirect to new dashboard (old explore deprecated, comms moved)
  const router = useRouter();
  useEffect(() => {
    router.replace('/(tabs)/dashboard');
  }, [router]);
  return null;
}
