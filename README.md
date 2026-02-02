# Taranga - Offline Network Communication 🌐

Taranga is a mobile application designed for **offline network connectivity** that enables users to communicate without internet access. Connect with others via WiFi or Bluetooth networks and engage through multiple communication channels.

## Features

- 🔌 **Offline Communication**: Works entirely offline using local WiFi or Bluetooth networks
- 👥 **User Discovery**: See who is online in your local network
- 💬 **Text Messaging**: Send and receive text-based messages
- 🎤 **Voice Communication**: Make voice calls within the network
- 📹 **Video Calls**: Connect face-to-face via video calling
- 🔒 **No Internet Required**: Perfect for remote areas, emergency situations, or privacy-focused communication

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd taranga
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Run on your device
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## How It Works

Taranga uses local network protocols to establish peer-to-peer connections:

- **WiFi Direct**: Creates ad-hoc networks for device-to-device communication
- **Bluetooth**: Enables discovery and connection in close proximity
- **WebRTC**: Facilitates real-time audio and video streaming

## Use Cases

- Emergency communication when cellular networks are down
- Remote areas without internet connectivity
- Private communication without cloud services
- Events and gatherings requiring local networking
- Educational environments with restricted internet access

## Technology Stack

- React Native (via Expo)
- TypeScript
- Expo Router (file-based routing)

## Development

This project uses [file-based routing](https://docs.expo.dev/router/introduction) with Expo Router. The main application code is in the **app** directory.

## License

[Add your license information here]
