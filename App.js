import React, { useState, useEffect, useRef } from "react";
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
import { Audio } from "expo-av";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [position, setPosition] = useState({ x: 180, y: 580 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [moveInterval, setMoveInterval] = useState(null);
  const [pause, setpause] = useState(null);
  const [flag, setFlag] = useState(1);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [kills, setKills] = useState(0); // total enemies destroyed
  const [bulletsNeeded, setBulletsNeeded] = useState(1); // bullets needed to spawn enemies
  const SPAWN_INTERVAL = 1000; // 1.5 seconds per enemy
  const BASE_SPEED = 2;       // initial enemy speed
  const SPEED_INCREASE = 0.3; // increase per 10 kills
  const doubleSpawnChance = 0.1;

  //const spawnDelay    = Math.max(MIN_SPAWN, BASE_SPAWN / bulletsNeeded);
  const LANES = 5; // number of horizontal lanes
  const laneWidth = screenWidth / LANES;

  const getLaneX = (lane) => lane * laneWidth + laneWidth / 2 - 32; // 32 = half player width



  const shootSound = useRef();
  const hitSound = useRef();
  const gameOverSound = useRef();

  useEffect(() => {
    const loadSounds = async () => {
      const shoot = await Audio.Sound.createAsync(
        require("./assets/sounds/shoot-sound.wav")
      );
      shootSound.current = shoot.sound;

      const hit = await Audio.Sound.createAsync(
        require("./assets/sounds/hit-sound.wav")
      );
      hitSound.current = hit.sound;

      const gameOverS = await Audio.Sound.createAsync(
        require("./assets/sounds/game-over.wav")
      );
      gameOverSound.current = gameOverS.sound;
    };

    loadSounds();

    return () => {
      shootSound.current?.unloadAsync();
      hitSound.current?.unloadAsync();
      gameOverSound.current?.unloadAsync();
    };
  }, []);

  const playShootSound = async () => {
    try {
      await shootSound.current?.replayAsync();
    } catch (e) {
      console.warn("Shoot sound failed:", e);
    }
  };

  const playHitSound = async () => {
    await hitSound.current?.replayAsync();
  };

  const playGameOverSound = async () => {
    await gameOverSound.current?.replayAsync();
  };

  const restartGame = () => {
    setPosition({ x: 180, y: 550 });
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setGameOver(false);
    setShowStartScreen(true);
    setKills(0)
  };

  const movePlayer = (dx, dy) => {
    if (gameOver || pause || showStartScreen) return;
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, 0), screenWidth - 64),
      y: prev.y ,
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
    if (gameOver || pause || showStartScreen) return;

    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: position.x + 45, y: position.y },
    ]);
  };

  const isColliding = (a, b) => {
    return a.x < b.x + 50 && a.x + 6 > b.x && a.y < b.y + 50 && a.y + 12 > b.y;
  };
  const isCollidingPlayer = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};


  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver || pause) return;


      // Check if any enemy hits the player
      const playerBox = {
        x: position.x,
        y: position.y,
        width: 64,
        height: 64,
      };

      enemies.forEach((enemy) => {
        const enemyBox = {
          x: enemy.x,
          y: enemy.y,
          width: 50,
          height: 50,
        };

        if (isCollidingPlayer(playerBox, enemyBox)) {
          setGameOver(true);
          playGameOverSound();
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [bullets, enemies, gameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver || pause || showStartScreen) return;

      const movedBullets = bullets
        .map((b) => ({ ...b, y: b.y - 10 }))
        .filter((b) => b.y > -20);

      const movedEnemies = enemies.map((e) => {
      //const speed = BASE_SPEED + Math.floor(kills / 15) * SPEED_INCREASE;
      const newY = e.y + 4;

      if (newY > position.y) { // enemy passed player
        playGameOverSound();
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
          remainingEnemies[hitIndex].health -= Math.floor(100 / bulletsNeeded); // reduce health

          if (remainingEnemies[hitIndex].health <= 0) {
            remainingEnemies.splice(hitIndex, 1); // remove enemy if dead
            setKills((prev)=>prev+1); // track total kills
            playHitSound();
            hits++;
          }
        }
      });

      if (hits > 0) setScore(score + hits * 10 * bulletsNeeded); // increase score based on hits

      setBullets(remainingBullets);
      setEnemies(remainingEnemies);
    }, 30);

    return () => clearInterval(interval);
  }, [bullets, enemies, gameOver]);

useEffect(() => {
  if (gameOver || pause || showStartScreen) return;

  const spawnInterval = setInterval(() => {
    const lane = Math.floor(Math.random() * LANES);
    const x = getLaneX(lane);

    setBulletsNeeded(1 + Math.floor(kills / 10));

    // Always spawn one enemy
    setEnemies((prev) => [
      ...prev,
      { id: Date.now(), x, y: -50, health: 100, lane },
    ]);

    // Occasionally spawn a second enemy in the same lane
    if (Math.random() < doubleSpawnChance) {
      setEnemies((prev) => [
        ...prev,
        { id: Date.now() + 1, x, y: -100, health: 100, lane },
      ]);
    }
  }, SPAWN_INTERVAL);

  return () => clearInterval(spawnInterval);
}, [gameOver, pause, showStartScreen, kills]);





  return (
    <View style={styles.container}>
      {showStartScreen && (
        <View style={styles.startScreen}>
          <Text style={styles.startTitle}>Top Down Shooter</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowStartScreen(false)}
          >
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showStartScreen && (
        <>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={() => {
              setpause(!pause);
              setFlag(pause ? 1 : 0);
            }}
          >
            <Text style={styles.pauseText}>{pause ? "▶" : "II"}</Text>
          </TouchableOpacity>

          {enemies.map((enemy) => (
            <Enemy
              key={enemy.id}
              position={{ x: enemy.x, y: enemy.y }}
              flag={flag}
              health={enemy.health}
            />
          ))}
          <Player
            position={position}
            size={{ width: 64, height: 64 }}
            flag={flag}
          />
          {bullets.map((b) => (
            <Bullet key={b.id} position={{ x: b.x, y: b.y }} />
          ))}

          {gameOver && (
            <View style={styles.gameOverOverlay}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={restartGame}
              >
                <Text style={styles.restartText}>Restart</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.controls}>

            <View style={styles.row}>
              <TouchableOpacity
                onPressIn={() => startMoving(-9)}
                onPressOut={stopMoving}
                style={styles.button}
              >
                <Text style={styles.text}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPressIn={() => startMoving(9)}
                onPressOut={stopMoving}
                style={styles.button}
              >
                <Text style={styles.text}>→</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                fireBullet();
                playShootSound();
              }}
              style={styles.fireButton}
            >
              <Text style={styles.fireText}>FIRE</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", 
  },

  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20, 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: "#333",
    borderRadius: 40, 
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#555",
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  fireButton: {
    width: 220,
    height: 70,
    backgroundColor: "#e63946",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    borderBottomWidth: 6,
    borderBottomColor: "#b02a35",
  },
  fireText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },


  score: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    position: "absolute",
    top: 60,
    left: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  pauseButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: "#333",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  pauseText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

 startScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  startTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#4cc9f0",
    marginBottom: 50,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  startButton: {
    backgroundColor: "#4cc9f0",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#4cc9f0",
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  startButtonText: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
  },


  gameOverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(180, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backdropFilter: "blur(10px)",
  },
  gameOverText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "red",
    textShadowRadius: 10,
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  restartText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});