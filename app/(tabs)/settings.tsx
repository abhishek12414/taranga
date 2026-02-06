import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const USERNAME_KEY = 'username';

export default function SettingsScreen() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem(USERNAME_KEY).then((value) => {
      if (value) setUsername(value);
    });
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem(USERNAME_KEY);
    Alert.alert('Logged out', 'Username cleared.');
    router.replace('/');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.crop.circle"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.profile}>
        <ThemedText type="subtitle">Profile</ThemedText>
        <ThemedText>Username: {username || 'Not set'}</ThemedText>
        <ThemedText>Device ID: {username ? `${username}-device` : 'Unknown'}</ThemedText>
      </ThemedView>
      <Pressable style={styles.logoutButton} onPress={logout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </Pressable>
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
    marginBottom: 20,
  },
  profile: {
    padding: 20,
    gap: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
