import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";


const frameCount = 9; // change based on how many frames you have
const frameInterval = 100; // milliseconds
  
  export default function Player({ position }) {
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
  return (
    <Image
      source={frameImages[frameIndex]}
      style={[
        styles.enemy,
        { left: position.x, top: position.y },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  enemy: {
    position: "absolute",
    width: 50,
    height: 50,
  },
});
