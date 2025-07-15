import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const frameCount = 9; //  how many frames you have
const frameInterval = 100; // milliseconds

export default function Enemy({ position, flag,health }) {
  const [frameIndex, setFrameIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, frameInterval);
    return () => clearInterval(interval);
  }, []);

  const frameImages = [
    require("../assets/images/tds_zombie/skeleton-move_0.png"),
    require("../assets/images/tds_zombie/skeleton-move_1.png"),
    require("../assets/images/tds_zombie/skeleton-move_2.png"),
    require("../assets/images/tds_zombie/skeleton-move_3.png"),
    require("../assets/images/tds_zombie/skeleton-move_4.png"),
    require("../assets/images/tds_zombie/skeleton-move_5.png"),
    require("../assets/images/tds_zombie/skeleton-move_6.png"),
    require("../assets/images/tds_zombie/skeleton-move_7.png"),
    require("../assets/images/tds_zombie/skeleton-move_8.png"),
    require("../assets/images/tds_zombie/skeleton-move_9.png"),
    require("../assets/images/tds_zombie/skeleton-move_10.png"),
    require("../assets/images/tds_zombie/skeleton-move_11.png"),
    require("../assets/images/tds_zombie/skeleton-move_12.png"),
    require("../assets/images/tds_zombie/skeleton-move_13.png"),
    require("../assets/images/tds_zombie/skeleton-move_14.png"),
    require("../assets/images/tds_zombie/skeleton-move_15.png"),
    require("../assets/images/tds_zombie/skeleton-move_16.png"),
  ];

  if (flag === 0) {
    return (
      <View
        source={frameImages[0]}
        style={[styles.enemy, { left: position.x, top: position.y }]}
      >
        {/* Health Bar */}
        <View style={styles.healthBarContainer}></View>
      </View>
    );
  } else if (flag === 1) {
    return (
      <>
        <View
          style={[
            styles.healthBarContainer,
            { left: position.x, top: position.y },
          ]}
        >
          {/* Health Bar Background */}
          <View style={styles.healthBarBackground}>
            {/* Health Bar Fill */}
            <View style={[styles.healthBarFill, { width: `${health}%` }]} />
          </View>

          {/* Enemy Sprite */}
          <Image source={frameImages[frameIndex]} style={styles.enemy} />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  healthBarContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  healthBarBackground: {
    width: 50,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginBottom: 2,
  },
  healthBarFill: {
    height: 6,
    backgroundColor: 'red',
    borderRadius: 3,
  },
  enemy: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

