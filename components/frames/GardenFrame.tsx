import React from 'react';
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

interface GardenFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function GardenFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: GardenFrameProps) {
  const c = Colors.frames.garden;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.sky} />
          <Stop offset="0.6" stopColor="#E8F5E9" />
          <Stop offset="1" stopColor={c.grass} />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Sky */}
      <Rect x="0" y="0" width={W} height={H} fill="url(#gardenSky)" />

      {/* Sun */}
      <Circle cx="900" cy="120" r="65" fill={Colors.accent} opacity={0.8} />
      <Circle cx="900" cy="120" r="85" fill={Colors.accent} opacity={0.2} />

      {/* Clouds */}
      <G opacity={0.7}>
        <Ellipse cx="250" cy="100" rx="90" ry="35" fill="white" />
        <Ellipse cx="320" cy="95" rx="70" ry="30" fill="white" />
        <Ellipse cx="190" cy="98" rx="60" ry="28" fill="white" />
      </G>
      <G opacity={0.5}>
        <Ellipse cx="650" cy="80" rx="75" ry="30" fill="white" />
        <Ellipse cx="710" cy="75" rx="55" ry="25" fill="white" />
      </G>

      {/* Grass ground */}
      <Path
        d="M0,1000 Q270,970 540,990 Q810,1010 1080,980 L1080,1350 L0,1350 Z"
        fill={c.grass}
      />
      <Path
        d="M0,1040 Q270,1020 540,1030 Q810,1050 1080,1020 L1080,1350 L0,1350 Z"
        fill={c.grassDark}
        opacity={0.5}
      />

      {/* Grass blades */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 50 + i * 52;
        return (
          <Path
            key={`grass-${i}`}
            d={`M${x},1020 Q${x - 8},990 ${x + 5},970`}
            stroke={c.grassDark}
            strokeWidth="3"
            fill="none"
            opacity={0.4}
          />
        );
      })}

      {/* Flowers at bottom */}
      {[
        { x: 100, y: 1050, color: c.flower1, s: 1.2 },
        { x: 220, y: 1080, color: c.flower2, s: 1.0 },
        { x: 360, y: 1060, color: c.flower3, s: 1.1 },
        { x: 500, y: 1090, color: c.flower1, s: 0.9 },
        { x: 630, y: 1055, color: c.flower2, s: 1.2 },
        { x: 760, y: 1075, color: c.flower3, s: 1.0 },
        { x: 890, y: 1065, color: c.flower1, s: 1.1 },
        { x: 1000, y: 1085, color: c.flower2, s: 0.9 },
      ].map(({ x, y, color, s }, i) => (
        <G key={`flower-${i}`}>
          {/* Stem */}
          <Path
            d={`M${x},${y} L${x},${y + 50 * s}`}
            stroke={c.grassDark}
            strokeWidth="3"
          />
          {/* Leaf */}
          <Ellipse
            cx={x + 10 * s}
            cy={y + 25 * s}
            rx={8 * s}
            ry={4 * s}
            fill={c.grass}
            transform={`rotate(30 ${x + 10 * s} ${y + 25 * s})`}
          />
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            const px = x + Math.cos(rad) * 14 * s;
            const py = y + Math.sin(rad) * 14 * s;
            return (
              <Circle
                key={j}
                cx={px}
                cy={py}
                r={10 * s}
                fill={color}
                opacity={0.8}
              />
            );
          })}
          {/* Center */}
          <Circle cx={x} cy={y} r={7 * s} fill={Colors.accent} />
        </G>
      ))}

      {/* Butterflies */}
      {[
        { x: 150, y: 350, rot: -15 },
        { x: 900, y: 400, rot: 10 },
        { x: 200, y: 900, rot: -10 },
      ].map(({ x, y, rot }, i) => (
        <G key={`butterfly-${i}`} transform={`translate(${x}, ${y}) rotate(${rot})`}>
          <Path
            d="M0,0 Q-20,-15 -15,-30 Q-5,-20 0,-5 Z"
            fill={c.butterfly}
            opacity={0.7}
          />
          <Path
            d="M0,0 Q20,-15 15,-30 Q5,-20 0,-5 Z"
            fill={c.butterfly}
            opacity={0.7}
          />
          <Path
            d="M0,0 Q-15,10 -12,25 Q-3,15 0,5 Z"
            fill={c.butterfly}
            opacity={0.5}
          />
          <Path
            d="M0,0 Q15,10 12,25 Q3,15 0,5 Z"
            fill={c.butterfly}
            opacity={0.5}
          />
          <Path d="M0,-5 L0,10" stroke="#666" strokeWidth="1.5" />
        </G>
      ))}

      {/* Bees */}
      {[
        { x: 800, y: 300 },
        { x: 350, y: 850 },
      ].map(({ x, y }, i) => (
        <G key={`bee-${i}`}>
          <Ellipse cx={x} cy={y} rx="12" ry="9" fill={c.bee} />
          <Path d={`M${x - 4},${y - 3} L${x + 4},${y - 3}`} stroke="#333" strokeWidth="2" />
          <Path d={`M${x - 4},${y + 1} L${x + 4},${y + 1}`} stroke="#333" strokeWidth="2" />
          <Ellipse cx={x - 8} cy={y - 10} rx="6" ry="4" fill="white" opacity={0.7} transform={`rotate(-20 ${x - 8} ${y - 10})`} />
          <Ellipse cx={x + 8} cy={y - 10} rx="6" ry="4" fill="white" opacity={0.7} transform={`rotate(20 ${x + 8} ${y - 10})`} />
        </G>
      ))}

      {/* Flowers on sides */}
      {[
        { x: 80, y: 600, color: c.flower2, s: 0.8 },
        { x: 1000, y: 650, color: c.flower1, s: 0.7 },
        { x: 60, y: 800, color: c.flower3, s: 0.6 },
        { x: 1020, y: 850, color: c.flower2, s: 0.7 },
      ].map(({ x, y, color, s }, i) => (
        <G key={`side-flower-${i}`}>
          {[0, 72, 144, 216, 288].map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            const px = x + Math.cos(rad) * 12 * s;
            const py = y + Math.sin(rad) * 12 * s;
            return <Circle key={j} cx={px} cy={py} r={8 * s} fill={color} opacity={0.6} />;
          })}
          <Circle cx={x} cy={y} r={5 * s} fill={Colors.accent} />
        </G>
      ))}

      {/* Photo circle border */}
      <Circle cx={CX} cy={CY} r={CR + 12} fill="white" opacity={0.8} />
      <Circle cx={CX} cy={CY} r={CR + 6} fill={c.grass} opacity={0.3} />

      {/* Photo */}
      {photoUri ? (
        <SvgImage
          x={CX - CR}
          y={CY - CR}
          width={CR * 2}
          height={CR * 2}
          href={photoUri}
          clipPath="url(#photoClip)"
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <Circle cx={CX} cy={CY} r={CR} fill={Colors.primaryLight} opacity={0.4} />
      )}

      <Circle cx={CX} cy={CY} r={CR} fill="none" stroke="white" strokeWidth="8" />

      {/* Name */}
      <SvgText
        x={CX}
        y={CY - CR - 50}
        textAnchor="middle"
        fontFamily="Nunito_700Bold, Nunito, sans-serif"
        fontSize="72"
        fontWeight="bold"
        fill={Colors.text}
      >
        {childName}
      </SvgText>

      {/* Age */}
      <SvgText
        x={CX}
        y={CY + CR + 80}
        textAnchor="middle"
        fontFamily="Nunito_600SemiBold, Nunito, sans-serif"
        fontSize="56"
        fontWeight="600"
        fill={Colors.text}
      >
        {ageText}
      </SvgText>
    </Svg>
  );
}
