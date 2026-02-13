import React from 'react';
import { MountainFrame } from './MountainFrame';
import { StorkFrame } from './StorkFrame';
import { CloudFrame } from './CloudFrame';
import { GardenFrame } from './GardenFrame';
import { BalloonFrame } from './BalloonFrame';
import { MoonFrame } from './MoonFrame';
import { FrameId } from '@/constants/frames';

interface FrameRendererProps {
  frameId: FrameId;
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function FrameRenderer({
  frameId,
  photoUri,
  childName,
  ageText,
  width,
  height,
}: FrameRendererProps) {
  const props = { photoUri, childName, ageText, width, height };

  switch (frameId) {
    case 'mountain':
      return <MountainFrame {...props} />;
    case 'stork':
      return <StorkFrame {...props} />;
    case 'cloud':
      return <CloudFrame {...props} />;
    case 'garden':
      return <GardenFrame {...props} />;
    case 'balloon':
      return <BalloonFrame {...props} />;
    case 'moon':
      return <MoonFrame {...props} />;
    default:
      return <MountainFrame {...props} />;
  }
}
