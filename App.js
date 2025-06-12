import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Player from './components/Player';

export default function App() {
  const [position, setPosition] = useState({ x: 150, y: 300 });

  const movePlayer = (dx, dy) => {
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  return (
    <View style={styles.container}>
      <Player position={position} size={{ width: 64, height: 64 }} />

      {/* Movement Controls */}
      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => movePlayer(0, -10)} style={styles.button}>
            <Text style={styles.text}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => movePlayer(-10, 0)} style={styles.button}>
            <Text style={styles.text}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => movePlayer(10, 0)} style={styles.button}>
            <Text style={styles.text}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => movePlayer(0, 10)} style={styles.button}>
            <Text style={styles.text}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
