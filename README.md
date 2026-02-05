# 🎮 Top-Down Shooter (React Native + Expo)

A fast-paced top-down arcade shooter built using React Native and Expo.
The game guarantees constant enemy pressure by always keeping a minimum number of enemies on screen, while difficulty scales smoothly through enemy health.

This project demonstrates game-loop logic, state management, and clean gameplay mechanics in React Native.

## ✨ Features

- Smooth left / right player movement
- Bullet shooting system
- Endless enemies with lane-based spawning
- Always at least 3 enemies visible
- Kill one enemy → a new enemy spawns instantly
- Progressive difficulty scaling (health-based)
- Collision detection (bullet ↔ enemy, enemy ↔ player)
- Sound effects (shoot, hit, game over)
- Pause / Resume gameplay
- Restart system
- Clean arcade-style UI

## 🛠 Tech Stack

- React Native
- Expo
- JavaScript (ES6+)
- expo-av

## 📂 Project Structure

.
├── App.js
├── components/
│   ├── Player.js
│   ├── Enemy.js
│   └── Bullet.js
├── assets/
│   └── sounds/
│       ├── shoot-sound.wav
│       ├── hit-sound.wav
│       └── game-over.wav
└── README.md

## ▶️ Getting Started

Install dependencies:

npm install  
or  
yarn install  

Run the app:

npx expo start

Scan the QR code using Expo Go on your mobile device.

## 🎮 Gameplay Rules

The game always maintains a minimum of 3 enemies on screen.
When an enemy is destroyed, a new one spawns immediately.
Enemies move downward continuously.
If an enemy collides with or passes the player, the game ends.

## 📈 Difficulty Scaling

Difficulty increases every 10 kills by increasing enemy health.

bulletsNeeded = 1 + floor(kills / 10)  
enemyHealth = 100 × bulletsNeeded

Enemy count stays constant while difficulty increases smoothly.

## 💥 Collision Detection

The game uses Axis-Aligned Bounding Box (AABB) collision detection.

a.x < b.x + b.width  
a.x + a.width > b.x  
a.y < b.y + b.height  
a.y + a.height > b.y

## 🎮 Controls

Move Left – ◀  
Move Right – ▶  
Shoot – FIRE  
Pause – II  
Resume – ▶  

## 🔊 Audio

Audio is handled using expo-av.

shoot-sound.wav – bullet fired  
hit-sound.wav – enemy destroyed  
game-over.wav – player defeated

## 🔁 Game States

Start Screen  
Playing  
Paused  
Game Over  

State management is handled using React Hooks.

## 🚧 Known Limitations

Enemies do not shoot back.
No power-ups or boss enemies.
No sprite animations.

## 🧩 Future Improvements

Boss enemies  
Power-ups  
Wave-based mode  
Smarter enemy AI  
Leaderboard  
Sprite animations

## 📜 License

This project is licensed under the MIT License.
See the LICENSE file for details.

## ❤️ Acknowledgements

Expo Team  
React Native Community  
Classic arcade shooters
