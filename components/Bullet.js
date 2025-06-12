import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Bullet({ position }) {
  return (
    <View
      style={[
        styles.bullet,
        { left: position.x, top: position.y },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bullet: {
    position: 'absolute',
    width: 6,
    height: 12,
    backgroundColor: '#f00',
    borderRadius: 3,
  },
});
