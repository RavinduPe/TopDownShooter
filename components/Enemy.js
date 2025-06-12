// Enemy.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Enemy = ({ position }) => {
  return (
    <View
      style={[
        styles.enemy,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  enemy: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'red', // make sure visible on your background!
    borderRadius: 8,
  },
});

export default Enemy;
