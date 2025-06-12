import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Player from "./components/Player";
import Bullet from "./components/Bullet";
import Enemy from "./components/Enemy";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [position, setPosition] = useState({ x: 150, y: 300 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);


  // Movement logic
  const movePlayer = (dx, dy) => {
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, 0), screenWidth - 64),
      y: Math.min(Math.max(prev.y + dy, 0), 700),
    }));
  };

  // Fire bullet
  const fireBullet = () => {
    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: position.x + 29, y: position.y },
    ]);
  };

  // Helper function to check rectangle collision
  const isColliding = (a, b) => {
    return (
      a.x < b.x + 50 &&
      a.x + 6 > b.x &&
      a.y < b.y + 50 &&
      a.y + 12 > b.y
    );
  };

  // Main game loop: move bullets, enemies, and check collision
  useEffect(() => {
    const interval = setInterval(() => {
      // Move bullets
      const movedBullets = bullets
        .map((b) => ({ ...b, y: b.y - 10 }))
        .filter((b) => b.y > -20);

      // Move enemies
      const movedEnemies = enemies
        .map((e) => ({ ...e, y: e.y + 5 }))
        .filter((e) => e.y < 700);

      // Collision Detection
      let remainingBullets = [];
      let remainingEnemies = [...movedEnemies];

      let hits = 0;

movedBullets.forEach((bullet) => {
  const hitIndex = remainingEnemies.findIndex((enemy) =>
    isColliding(
      { x: bullet.x, y: bullet.y, width: 6, height: 12 },
      { x: enemy.x, y: enemy.y, width: 50, height: 50 }
    )
  );
  if (hitIndex === -1) {
    remainingBullets.push(bullet);
  } else {
    remainingEnemies.splice(hitIndex, 1); // Remove enemy
    hits++;
  }
});

if (hits > 0) setScore((prev) => prev + hits * 10);


      setBullets(remainingBullets);
      setEnemies(remainingEnemies);
    }, 50);

    return () => clearInterval(interval);
  }, [bullets, enemies]);

  // Spawn enemies every 2 seconds
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const x = Math.floor(Math.random() * (screenWidth - 50));
      setEnemies((prev) => [
        ...prev,
        { id: Date.now(), x, y: -50 },
      ]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>

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
          <TouchableOpacity
            onPress={() => movePlayer(0, -10)}
            style={styles.button}
          >
            <Text style={styles.text}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => movePlayer(-10, 0)}
            style={styles.button}
          >
            <Text style={styles.text}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => movePlayer(10, 0)}
            style={styles.button}
          >
            <Text style={styles.text}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => movePlayer(0, 10)}
            style={styles.button}
          >
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
  score: {
  color: "#fff",
  fontSize: 24,
  fontWeight: "bold",
  position: "absolute",
  top: 50,
  left: 20,
},

});
