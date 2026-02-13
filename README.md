# 👶 Little Moments

A beautiful app for parents to capture monthly milestones of their little ones growing up. Choose from 6 whimsical illustrated frames, add your child's photo, and save or share the composed memory with family.

## ✨ Features

- **Onboarding** — Enter your child's name and birthday
- **Smart Age Tracking** — Automatically calculates and displays your child's age
- **6 Beautiful Frames** — Mountain Adventure, Stork Delivery, Dreamy Clouds, Garden Party, Balloon Celebration, Goodnight Moon
- **Photo Composition** — Upload a photo that gets placed inside a circular cutout with name and age overlay
- **One-Tap Save & Share** — Download high-res 1080×1350 PNG or share directly with family via Web Share API
- **Quick Frame Switcher** — Try all 6 frames instantly on the compose screen
- **Memory Gallery** — View, tap, and manage all your saved memories
- **Monthly Reminders** — Milestone banner reminds you to capture this month's moment
- **Mobile Responsive** — Looks great on phones, tablets, and desktops
- **Keyboard Accessible** — Full keyboard navigation, screen reader support

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start --web

# Run tests
npm test

# Build for production
npx expo export --platform web
```

The production build exports to `dist/` with 8 static routes ready to deploy.

## 🧪 Testing

```bash
npm test
```

30 unit tests covering:
- **Age calculation** — `calculateAge`, `formatAge`, `formatAgeShort` with edge cases (newborns, mid-month boundaries, singular/plural formatting)
- **Storage** — Child info CRUD, memory CRUD with ordering, clear all data

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
- **TypeScript** — Full type safety (0 errors)
- **react-native-svg** — Cross-platform SVG frame rendering
- **expo-image-picker** — Photo upload from device
- **html-to-image** — High-quality 1080×1350 image capture
- **AsyncStorage** — Local persistence (no server needed)
- **Nunito** — Friendly rounded font from Google Fonts
- **Jest** — 30 unit tests

## 📱 Target Users

1. **Parents** — Monthly milestone tracking with cute, shareable photo frames
2. **Grandparents** — Receiving and viewing these special moments

## 📁 Project Structure

```
app/                    # Expo Router screens (8 routes)
  _layout.tsx           # Root layout (fonts, splash, navigation)
  +html.tsx             # Custom HTML template (PWA meta, a11y)
  +not-found.tsx        # Custom 404 page
  index.tsx             # Entry redirect (onboarding or home)
  onboarding.tsx        # Child name + birthday setup
  home.tsx              # Dashboard with age + gallery
  settings.tsx          # Edit child info
  create/
    index.tsx           # Frame selection grid
    compose.tsx         # Photo composition + save/share

components/
  frames/               # 6 SVG frame components + renderer + preview
  ui/                   # Button, Card, StyledInput
  MilestoneReminder.tsx # Monthly reminder banner
  MemoryViewer.tsx      # Fullscreen memory modal

constants/              # Design tokens (colors, typography, layout, frames)
hooks/                  # useChildInfo, useMemories
utils/                  # Age calculation, storage, image capture/export
__tests__/              # Unit tests (age, storage)
```

## 🌐 Deployment

The app builds as a static site deployable anywhere:

```bash
# Build
npx expo export --platform web

# The dist/ folder is ready to deploy to:
# - Vercel: vercel deploy dist
# - Netlify: drag & drop dist/ folder
# - Any static host: serve the dist/ directory
```
