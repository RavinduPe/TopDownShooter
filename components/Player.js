import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

const frameCount = 4; // change based on how many frames you have
const frameInterval = 100; // milliseconds

export default function Player({ position, size }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameCount);
    }, frameInterval);
    return () => clearInterval(interval);
  }, []);

  const frameImages = [
    require('../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_0.png'),
    require('../assets/images/player/frame_2.png'),
    require('../assets/images/player/frame_3.png'),
    require('../assets/images/player/frame_4.png'),
  ];

  return (
    <Image
      source={frameImages[frameIndex]}
      style={{
        position: 'absolute',
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
      }}
    />
  );
}
