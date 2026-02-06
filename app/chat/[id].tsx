import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat, IMessage, Bubble } from 'react-native-gifted-chat';
import { createAudioPlayer } from 'expo-audio';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Message = IMessage;

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [username] = useState('You'); // from storage in prod
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [localStream, setLocalStream] = useState<any>(null);

  // load username and init chat
  useEffect(() => {
    AsyncStorage.getItem('username').then((value) => {
      // username used for chat ID
    });
    setMessages([
      {
        _id: 1,
        text: `Connected to device ${id} (offline P2P)`,
        createdAt: new Date(),
        user: { _id: 2, name: 'Peer' },
      },
    ]);
  }, [id]);

  const onSend = useCallback((newMessages: Message[] = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    // simulate P2P send via udp/zeroconf in real
  }, []);

  const startVoiceCall = async () => {
    try {
      // new expo-audio API (replaces deprecated expo-av)
      const player = createAudioPlayer({
        uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      });
      await player.play();
      Alert.alert('Voice call started (demo)');
      // real: use webrtc or audio for mic
    } catch {
      Alert.alert('Call error');
    }
  };

  const startVideoCall = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Video calls not supported on web');
      return;
    }
    try {
      // dynamic load to avoid native module error in non-dev-client
      const webrtc = await import('react-native-webrtc');
      const stream = await webrtc.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);
      setIsVideoCall(true);
      Alert.alert('Video call started (demo P2P)');
      // real: webrtc peer connection for offline (use dev-client)
    } catch {
      Alert.alert('Camera/mic access denied (install dev-client?)');
    }
  };

  const endCall = () => {
    if (localStream) localStream.release();
    setIsVideoCall(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Chat with {id}</ThemedText>
      {!isVideoCall ? (
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1, name: username }}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: { backgroundColor: '#E5E5EA' },
                right: { backgroundColor: '#007AFF' },
              }}
            />
          )}
        />
      ) : (
        <View style={styles.videoContainer}>
          {/* placeholder for webrtc video (dynamic load) */}
          <View style={styles.localVideo}>
            <ThemedText style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
              Local video stream (demo)
            </ThemedText>
          </View>
          <ThemedText>Remote video (simulated)</ThemedText>
          <ThemedText onPress={endCall} style={styles.endCall}>End Call</ThemedText>
        </View>
      )}
      {!isVideoCall && (
        <View style={styles.callButtons}>
          <ThemedText style={styles.callButton} onPress={startVoiceCall}>
            📞 Voice Call
          </ThemedText>
          <ThemedText style={styles.callButton} onPress={startVideoCall}>
            📹 Video Call
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    textAlign: 'center',
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  callButton: {
    fontSize: 18,
    padding: 12,
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 8,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
  },
  endCall: {
    marginTop: 20,
    color: '#FF3B30',
    fontSize: 18,
  },
});
