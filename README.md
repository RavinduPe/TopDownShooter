# 🔫 Top-Down Shooter Game (React Native)

A simple 2D top-down shooter game built using **React Native** and **Expo**. The player controls a spaceship, shoots bullets at enemies, and avoids being hit.

## 🚀 Features

- Player movement (up, down, left, right)
- Enemy spawning and movement
- Shooting bullets
- Collision detection
- Score tracking
- Game over screen
- Pause/resume gameplay
- Sound effects (shoot, hit, game over)

## 📦 Dependencies

- [React Native](https://reactnative.dev/) (`0.79.3`)
- [Expo](https://expo.dev/) (`~53.0.11`)
- `expo-av` for audio playback
- `react-native-game-engine` for basic game logic
- `matter-js` (optional physics engine, not used heavily)

## 🎮 Controls

| Action        | Control                         |
|---------------|----------------------------------|
| Move Player   | Arrow buttons (↑ ↓ ← →)         |
| Fire Bullet   | `FIRE` button                   |
| Pause/Resume  | Top-right pause/play button     |

## 🔊 Audio

Ensure you have these files in the `assets/sounds` folder:

- `shoot-sound.wav`
- `hit-sound.wav`
- `game-over.wav`

## 🛠️ Setup Instructions

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/TopDownShooter.git
cd TopDownShooter

yarn install

expo start --clear




