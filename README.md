# 👶 Little Moments

A beautiful app for parents to capture monthly milestones of their little ones growing up. Choose from 6 whimsical illustrated frames, add your child's photo, and save or share the composed memory with family.

## ✨ Features

- **Onboarding** — Enter your child's name and birthday
- **Smart Age Tracking** — Automatically calculates and displays your child's age
- **6 Beautiful Frames** — Mountain Adventure, Stork Delivery, Dreamy Clouds, Garden Party, Balloon Celebration, Goodnight Moon
- **Photo Composition** — Upload a photo that gets placed inside a circular cutout with name and age overlay
- **One-Tap Save & Share** — Download as PNG or share directly with family via Web Share API
- **Memory Gallery** — View all your saved memories on the home dashboard
- **Mobile Responsive** — Looks great on phones, tablets, and desktops

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start --web

# Build for production
npx expo export --platform web
```

## 🎨 Frame Themes

| Theme | Description |
|-------|-------------|
| 🏔️ Mountain Adventure | Cute mountains, sun, fluffy clouds, pine trees |
| 🦩 Stork Delivery | Flying storks, baby bundles, stars, ribbons |
| ☁️ Dreamy Clouds | Purple-pink gradient, layered clouds, rainbow |
| 🌸 Garden Party | Flowers, butterflies, bees, green grass |
| 🎈 Balloon Celebration | Colorful balloons, confetti, streamers |
| 🌙 Goodnight Moon | Navy sky, crescent moon, stars, sleeping owl |

## 🛠 Tech Stack

- **Expo** (SDK 54) with Expo Router
- **React Native Web** — Single codebase for web + future mobile
- **TypeScript** — Full type safety
- **react-native-svg** — Cross-platform SVG frame rendering
- **expo-image-picker** — Photo upload from device
- **html-to-image** — High-quality image capture for saving/sharing
- **AsyncStorage** — Local persistence (no server needed)
- **Nunito** — Friendly rounded font from Google Fonts

## 📱 Target Users

1. **Parents** — Monthly milestone tracking with cute, shareable photo frames
2. **Grandparents** — Receiving and viewing these special moments

## 📁 Project Structure

```
app/                    # Expo Router screens
  _layout.tsx           # Root layout (fonts, navigation)
  index.tsx             # Entry redirect (onboarding or home)
  onboarding.tsx        # Child name + birthday setup
  home.tsx              # Dashboard with age + gallery
  settings.tsx          # Edit child info
  create/
    index.tsx           # Frame selection grid
    compose.tsx         # Photo composition + save/share

components/
  frames/               # 6 SVG frame components + renderer
  ui/                   # Reusable UI components

constants/              # Design tokens (colors, typography, layout)
hooks/                  # Custom React hooks
utils/                  # Utilities (age calc, storage, image capture)
```
