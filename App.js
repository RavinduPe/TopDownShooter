import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Player from "./components/Player";
import Bullet from "./components/Bullet";
import Enemy from "./components/Enemy";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [position, setPosition] = useState({ x: 150, y: 300 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);

  // Movement logic
  const movePlayer = (dx, dy) => {
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, 0), screenWidth - 64), // keep inside screen
      y: Math.min(Math.max(prev.y + dy, 0), 700), // assuming 700 is bottom limit
    }));
  };

  // Fire bullet
  const fireBullet = () => {
    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: position.x + 29, y: position.y }, // center of sprite
    ]);
  };

  // Move bullets upward every 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets
          .map((bullet) => ({ ...bullet, y: bullet.y - 10 })) // move bullet up
          .filter((bullet) => bullet.y > -20) // remove off screen bullets
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Move enemies down every 50ms
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies
          .map((enemy) => ({ ...enemy, y: enemy.y + 5 })) // move down
          .filter((enemy) => enemy.y < 700) // remove off screen enemies
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Spawn enemies every 2 seconds at random x
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const x = Math.floor(Math.random() * (screenWidth - 50)); // assuming enemy width 50
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { id: Date.now(), x, y: -50 }, // start above screen
      ]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, []);

  // helper function to check for rectangle overlap
  const isColliding = (a, b) => {
    return (
      a.x < b.x + 50 &&
      a.x + 6 > b.x && // bullet width is 6
      a.y < b.y + 50 &&
      a.y + 12 > b.y // bullet height is 12
    );
  };

  return (
    <View style={styles.container}>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={{ x: enemy.x, y: enemy.y }} />
      ))}

      <Player position={position} size={{ width: 64, height: 64 }} />
      {bullets.map((b) => (
        <Bullet key={b.id} position={{ x: b.x, y: b.y }} />
      ))}

      {/* Controls */}
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
        <TouchableOpacity onPress={fireBullet} style={styles.fireButton}>
          <Text style={styles.fireText}>FIRE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  controls: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  row: { flexDirection: "row", marginVertical: 5 },
  button: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
  },
  text: { color: "#fff", fontSize: 24 },
  fireButton: {
    marginTop: 15,
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  fireText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
