export interface FrameInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const FRAMES = [
  {
    id: 'mountain',
    name: 'Mountain Adventure',
    emoji: '🏔️',
    description: 'Cute mountains, sun & fluffy clouds',
  },
  {
    id: 'stork',
    name: 'Stork Delivery',
    emoji: '🦩',
    description: 'Storks, stars & ribbons',
  },
  {
    id: 'cloud',
    name: 'Dreamy Clouds',
    emoji: '☁️',
    description: 'Fluffy clouds & rainbow',
  },
  {
    id: 'garden',
    name: 'Garden Party',
    emoji: '🌸',
    description: 'Flowers, butterflies & bees',
  },
  {
    id: 'balloon',
    name: 'Balloon Celebration',
    emoji: '🎈',
    description: 'Colorful balloons & confetti',
  },
  {
    id: 'moon',
    name: 'Goodnight Moon',
    emoji: '🌙',
    description: 'Moon, stars & sleepy owl',
  },
] as const satisfies readonly FrameInfo[];

export type FrameId = (typeof FRAMES)[number]['id'];
