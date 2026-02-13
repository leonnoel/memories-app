import React, { useId, useMemo } from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Ellipse,
  Path,
  G,
  ClipPath,
  Image as SvgImage,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { FrameDimensions } from '@/constants/layout';

const W = FrameDimensions.width;
const H = FrameDimensions.height;
const CX = FrameDimensions.photoCircleCenterX;
const CY = FrameDimensions.photoCircleCenterY;
const CR = FrameDimensions.photoCircleRadius;

interface BalloonFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

// Seeded random for deterministic confetti positions
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function BalloonFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: BalloonFrameProps) {
  const uid = useId().replace(/:/g, '');
  const c = Colors.frames.balloon;

  const balloons = [
    { x: 120, y: 200, color: c.balloon1, rx: 55, ry: 70 },
    { x: 250, y: 140, color: c.balloon3, rx: 50, ry: 65 },
    { x: 100, y: 500, color: c.balloon4, rx: 45, ry: 58 },
    { x: 230, y: 650, color: c.balloon5, rx: 50, ry: 65 },
    { x: 80, y: 800, color: c.balloon6, rx: 48, ry: 62 },
    { x: 960, y: 180, color: c.balloon2, rx: 52, ry: 68 },
    { x: 850, y: 130, color: c.balloon6, rx: 48, ry: 62 },
    { x: 980, y: 480, color: c.balloon3, rx: 50, ry: 65 },
    { x: 870, y: 620, color: c.balloon1, rx: 45, ry: 58 },
    { x: 990, y: 780, color: c.balloon5, rx: 52, ry: 68 },
  ];

  // Deterministic confetti using seeded random
  const confetti = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      x: seededRandom(i * 3 + 1) * W,
      y: seededRandom(i * 3 + 2) * H,
      size: 6 + seededRandom(i * 3 + 3) * 10,
      color: c.confetti[i % c.confetti.length],
      rotation: seededRandom(i * 7) * 360,
    })), [c.confetti]);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id={`bsky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.skyTop} />
          <Stop offset="1" stopColor={c.skyBottom} />
        </LinearGradient>
        <ClipPath id={`bclip${uid}`}>
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Sky */}
      <Rect x="0" y="0" width={W} height={H} fill={`url(#bsky${uid})`} />

      {/* Confetti */}
      {confetti.map(({ x, y, size, color, rotation }, i) => (
        <Rect
          key={`confetti-${i}`}
          x={x} y={y} width={size} height={size * 0.5}
          fill={color} opacity={0.4} rx={2}
          transform={`rotate(${rotation} ${x + size / 2} ${y + size * 0.25})`}
        />
      ))}

      {/* Streamers */}
      <Path d="M0,300 Q100,280 150,320 Q200,360 250,340 Q300,320 350,350" stroke={c.balloon1} strokeWidth="4" fill="none" opacity={0.3} />
      <Path d="M730,250 Q780,230 830,270 Q880,310 930,290 Q980,270 1080,300" stroke={c.balloon2} strokeWidth="4" fill="none" opacity={0.3} />
      <Path d="M0,1100 Q150,1080 300,1100 Q450,1120 600,1095 Q750,1070 900,1100 Q1000,1120 1080,1100" stroke={c.balloon3} strokeWidth="3" fill="none" opacity={0.25} />

      {/* Balloons */}
      {balloons.map(({ x, y, color, rx, ry }, i) => (
        <G key={`balloon-${i}`}>
          <Path
            d={`M${x},${y + ry} Q${x + 10},${y + ry + 40} ${x - 5},${y + ry + 80} Q${x + 8},${y + ry + 120} ${x},${y + ry + 160}`}
            stroke={color} strokeWidth="2" fill="none" opacity={0.5}
          />
          <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity={0.85} />
          <Ellipse cx={x - rx * 0.25} cy={y - ry * 0.25} rx={rx * 0.2} ry={ry * 0.25} fill="white" opacity={0.4} />
          <Path d={`M${x - 5},${y + ry} L${x},${y + ry + 8} L${x + 5},${y + ry} Z`} fill={color} opacity={0.9} />
        </G>
      ))}

      {/* Clouds */}
      <G opacity={0.6}>
        <Ellipse cx="540" cy="100" rx="100" ry="38" fill="white" />
        <Ellipse cx="620" cy="95" rx="75" ry="30" fill="white" />
        <Ellipse cx="470" cy="98" rx="70" ry="28" fill="white" />
      </G>

      {/* Party bunting at top */}
      <G opacity={0.6}>
        {[300, 340, 380, 420, 460, 500, 540, 580, 620, 660, 700].map((x, i) => (
          <Path key={i} d={`M${x},50 L${x + 20},0 L${x + 40},50`} fill={c.confetti[i % c.confetti.length]} />
        ))}
        <Path d="M300,50 L740,50" stroke={Colors.text} strokeWidth="2" fill="none" />
      </G>

      {/* Photo circle border */}
      <Circle cx={CX} cy={CY} r={CR + 12} fill="white" opacity={0.9} />
      <Circle cx={CX} cy={CY} r={CR + 6} fill={Colors.accent} opacity={0.3} />

      {/* Photo */}
      {photoUri ? (
        <SvgImage
          x={CX - CR} y={CY - CR} width={CR * 2} height={CR * 2}
          href={photoUri} clipPath={`url(#bclip${uid})`} preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <Circle cx={CX} cy={CY} r={CR} fill={Colors.primaryLight} opacity={0.4} />
      )}
      <Circle cx={CX} cy={CY} r={CR} fill="none" stroke="white" strokeWidth="8" />

      {/* Name */}
      <SvgText x={CX} y={CY - CR - 50} textAnchor="middle" fontFamily="Nunito_700Bold, Nunito, sans-serif" fontSize="72" fontWeight="bold" fill={Colors.text}>
        {childName}
      </SvgText>

      {/* Age */}
      <SvgText x={CX} y={CY + CR + 80} textAnchor="middle" fontFamily="Nunito_600SemiBold, Nunito, sans-serif" fontSize="56" fontWeight="600" fill={Colors.text}>
        {ageText}
      </SvgText>
    </Svg>
  );
}
