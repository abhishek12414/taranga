import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const USERNAME_KEY = 'username';

export default function OnboardingScreen() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // load existing username (manifest perms handle Bluetooth/mic/camera/location for Expo Go compat)
  useEffect(() => {
    AsyncStorage.getItem(USERNAME_KEY).then((value) => {
      if (value) {
        router.replace('/(tabs)');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  const saveUsername = async () => {
    if (username.trim()) {
      await AsyncStorage.setItem(USERNAME_KEY, username.trim());
      router.replace('/(tabs)');
    }
  };

  if (isLoading) {
    return <ThemedView style={styles.container}><ThemedText>Loading...</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter a name to identify your device in nearby list
      </ThemedText>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Your name"
        placeholderTextColor="#888"
      />
      <Pressable style={styles.button} onPress={saveUsername}>
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
