import React, { useEffect, useState } from "react";
import { Image } from "react-native";

const frameCount = 19; //  frames you have
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
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_0.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_1.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_2.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_3.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_4.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_5.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_6.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_7.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_8.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_9.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_10.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_11.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_12.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_13.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_14.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_15.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_16.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_17.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_18.png"),
    require("../assets/images/Top_Down_Survivor/shotgun/idle/survivor-idle_shotgun_19.png"),
  ];

  return (
    <Image
      source={frameImages[frameIndex]}
      style={{
        position: "absolute",
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
      }}
    />
  );
}
