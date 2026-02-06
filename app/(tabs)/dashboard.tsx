import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Pressable, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
// dynamic for zeroconf (Expo Go limited; use dev-client for native discovery on WiFi)
let Zeroconf: any = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Zeroconf = require('react-native-zeroconf').default;
}

const USERNAME_KEY = 'username';

type Device = {
  id: string;
  name: string;
  status: 'online' | 'offline';
};

export default function DashboardScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [username, setUsername] = useState('');
  const zeroconfRef = useRef<any>(null);
  const router = useRouter();

  // load username + scan/publish for real nearby (mDNS over WiFi; demo fallback)
  useEffect(() => {
    AsyncStorage.getItem(USERNAME_KEY).then((value) => {
      if (value) setUsername(value);
    });

    if (!Zeroconf) {
      console.log('Zeroconf unavailable (use dev-client)');
      // demo fallback
      setDevices([
        { id: 'demo1', name: 'Nearby Device 1', status: 'online' },
        { id: 'demo2', name: 'Nearby Device 2', status: 'offline' },
      ]);
      return;
    }

    const zc = new Zeroconf();
    zeroconfRef.current = zc;

    // advertise self with username for discovery
    if (username && typeof zc.publish === 'function') {
      zc.publish('taranga', 'http', 'tcp', 3000, { name: username });
    }

    zc.on('start', () => console.log('Zeroconf scanning for nearby on WiFi'));
    zc.on('found', (service: any) => {
      setDevices((prev) => {
        const exists = prev.some((d) => d.id === service.name);
        if (!exists && service.name !== username) {
          return [...prev, { id: service.name, name: service.name || 'Unknown', status: 'online' }];
        }
        return prev;
      });
    });
    // safe call (scan may be missing if native not linked, e.g. Expo Go)
    if (typeof zc.scan === 'function') {
      zc.scan('http', 'tcp', 'local.');
    } else {
      console.warn('Zeroconf.scan unavailable - falling to demo');
    }

    return () => {
      if (typeof zc.stop === 'function') zc.stop();
      if (typeof zc.unpublish === 'function') zc.unpublish();
    };
  }, [username]);

  const openChat = (device: Device) => {
    router.push(`/chat/${device.id}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="antenna.radiowaves.left.and.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText>Device: {username || 'Unknown'}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Nearby devices (offline P2P)</ThemedText>
      <View>
        {devices.length === 0 ? (
          <ThemedText>No nearby devices found</ThemedText>
        ) : (
          devices.map((item) => (
            <Pressable key={item.id} onPress={() => openChat(item)} style={styles.deviceItem}>
              <ThemedView style={styles.deviceRow}>
                <IconSymbol size={24} name="person.fill" color="#007AFF" />
                <ThemedText style={styles.deviceName}>{item.name}</ThemedText>
                <ThemedText style={[styles.status, item.status === 'online' ? styles.online : styles.offline]}>
                  {item.status}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceName: {
    flex: 1,
  },
  status: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  online: {
    backgroundColor: '#34C759',
    color: '#fff',
  },
  offline: {
    backgroundColor: '#FF3B30',
    color: '#fff',
  },
});
