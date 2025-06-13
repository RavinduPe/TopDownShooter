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
  const [position, setPosition] = useState({ x: 180, y: 550 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [moveInterval, setMoveInterval] = useState(null);
  const [pause, setpause] = useState(null);
  const [flag, setFlag] = useState(1);

  const restartGame = () => {
    setPosition({ x: 180, y: 550 });
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setGameOver(false);
  };

  const movePlayer = (dx, dy) => {
    if (gameOver || pause) return;
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, 0), screenWidth - 64),
      y: Math.min(Math.max(prev.y + dy, 0), 700),
    }));
  };

  const startMoving = (dx, dy) => {
    if (moveInterval) return;
    const interval = setInterval(() => {
      movePlayer(dx, dy);
    }, 50);
    setMoveInterval(interval);
  };

  const stopMoving = () => {
    if (moveInterval) {
      clearInterval(moveInterval);
      setMoveInterval(null);
    }
  };

  const fireBullet = () => {
    if (gameOver || pause) return;
    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: position.x + 45, y: position.y },
    ]);
  };

  const isColliding = (a, b) => {
    return a.x < b.x + 50 && a.x + 6 > b.x && a.y < b.y + 50 && a.y + 12 > b.y;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver|| pause) return;

      const movedBullets = bullets
        .map((b) => ({ ...b, y: b.y - 10 }))
        .filter((b) => b.y > -20);

      const movedEnemies = enemies.map((e) => {
        const newY = e.y + 5;
        if (newY >= 700) {
          setGameOver(true);
        }
        return { ...e, y: newY };
      });

      const visibleEnemies = movedEnemies.filter((e) => e.y < 700);

      let remainingBullets = [];
      let remainingEnemies = [...visibleEnemies];
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
          remainingEnemies.splice(hitIndex, 1);
          hits++;
        }
      });

      if (hits > 0) setScore((prev) => prev + hits * 10);

      setBullets(remainingBullets);
      setEnemies(remainingEnemies);
    }, 30);

    return () => clearInterval(interval);
  }, [bullets, enemies, gameOver]);

  useEffect(() => {
    if (gameOver || pause) return;

    const spawnInterval = setInterval(() => {
      const x = Math.floor(Math.random() * (screenWidth - 50));
      setEnemies((prev) => [...prev, { id: Date.now(), x, y: -50 }]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameOver,pause]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity style={styles.pauseButton } onPress={()=>{setpause(!pause);setFlag(pause ? 1 : 0)}}>
        <Text style={styles.pauseText}>{pause ? "▶" : "II"}</Text>
      </TouchableOpacity>

      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={{ x: enemy.x, y: enemy.y }} flag={flag}/>
      ))}
      <Player position={position} size={{ width: 64, height: 64 }} flag={flag}/>
      {bullets.map((b) => (
        <Bullet key={b.id} position={{ x: b.x, y: b.y }} />
      ))}

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={() => startMoving(0, -10)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text style={styles.text}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={() => startMoving(-10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text style={styles.text}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMoving(10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text style={styles.text}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={() => startMoving(0, 10)}
            onPressOut={stopMoving}
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
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  row: { flexDirection:"row", marginVertical: 2 },
  button: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 50,
  },
  text: { color: "#fff", fontSize: 24 },
  fireButton: {
    position: "absolute",
    bottom: 78,
    left: "60.5%",
    transform: [{ translateX: -75 }],
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
  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  gameOverText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: "#06d6a0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  restartText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },

  pauseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 8,
  },
  pauseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
