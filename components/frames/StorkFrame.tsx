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

interface StorkFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function StorkFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: StorkFrameProps) {
  const c = Colors.frames.stork;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="storkSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.skyTop} />
          <Stop offset="1" stopColor={c.skyBottom} />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Sky */}
      <Rect x="0" y="0" width={W} height={H} fill="url(#storkSky)" />

      {/* Scattered stars */}
      {[
        { x: 120, y: 100, s: 20 },
        { x: 300, y: 60, s: 15 },
        { x: 500, y: 120, s: 18 },
        { x: 780, y: 80, s: 22 },
        { x: 920, y: 140, s: 16 },
        { x: 160, y: 1200, s: 14 },
        { x: 400, y: 1250, s: 18 },
        { x: 700, y: 1180, s: 16 },
        { x: 900, y: 1230, s: 20 },
      ].map(({ x, y, s }, i) => (
        <Path
          key={i}
          d={`M${x},${y - s} L${x + s * 0.3},${y - s * 0.3} L${x + s},${y} L${x + s * 0.3},${y + s * 0.3} L${x},${y + s} L${x - s * 0.3},${y + s * 0.3} L${x - s},${y} L${x - s * 0.3},${y - s * 0.3} Z`}
          fill={c.star}
          opacity={0.7}
        />
      ))}

      {/* Left stork */}
      <G transform="translate(100, 300) scale(0.8)">
        {/* Body */}
        <Ellipse cx="80" cy="60" rx="50" ry="30" fill={c.stork} />
        {/* Head */}
        <Circle cx="140" cy="35" r="18" fill={c.stork} />
        {/* Beak */}
        <Path d="M158,35 L200,30 L158,40 Z" fill={c.bundle} />
        {/* Eye */}
        <Circle cx="148" cy="32" r="4" fill="#2C3E50" />
        {/* Wing */}
        <Path d="M60,45 Q30,70 50,90 Q80,75 100,65 Z" fill="#E8E8E8" />
        {/* Legs */}
        <Path d="M70,88 L60,140" stroke={c.bundle} strokeWidth="4" />
        <Path d="M90,88 L100,140" stroke={c.bundle} strokeWidth="4" />
        {/* Bundle */}
        <Path
          d="M170,45 Q200,60 190,85 Q175,95 160,85 Q150,65 170,45 Z"
          fill={c.ribbon}
          opacity={0.7}
        />
        <Path d="M158,38 Q175,40 170,45" stroke={c.ribbon} strokeWidth="3" fill="none" />
      </G>

      {/* Right stork (flipped) */}
      <G transform="translate(980, 350) scale(-0.7, 0.7)">
        <Ellipse cx="80" cy="60" rx="50" ry="30" fill={c.stork} />
        <Circle cx="140" cy="35" r="18" fill={c.stork} />
        <Path d="M158,35 L200,30 L158,40 Z" fill={c.bundle} />
        <Circle cx="148" cy="32" r="4" fill="#2C3E50" />
        <Path d="M60,45 Q30,70 50,90 Q80,75 100,65 Z" fill="#E8E8E8" />
        <Path d="M70,88 L60,140" stroke={c.bundle} strokeWidth="4" />
        <Path d="M90,88 L100,140" stroke={c.bundle} strokeWidth="4" />
      </G>

      {/* Clouds */}
      <G opacity={0.6}>
        <Ellipse cx="200" cy="200" rx="80" ry="30" fill="white" />
        <Ellipse cx="260" cy="195" rx="60" ry="25" fill="white" />
      </G>
      <G opacity={0.5}>
        <Ellipse cx="800" cy="250" rx="70" ry="28" fill="white" />
        <Ellipse cx="860" cy="245" rx="55" ry="22" fill="white" />
      </G>

      {/* Hearts */}
      {[
        { x: 250, y: 800, s: 1.2 },
        { x: 830, y: 780, s: 1.0 },
        { x: 150, y: 950, s: 0.8 },
        { x: 920, y: 920, s: 0.9 },
      ].map(({ x, y, s }, i) => (
        <Path
          key={i}
          d={`M${x},${y + 10 * s} C${x - 15 * s},${y - 5 * s} ${x - 25 * s},${y - 20 * s} ${x},${y - 10 * s} C${x + 25 * s},${y - 20 * s} ${x + 15 * s},${y - 5 * s} ${x},${y + 10 * s} Z`}
          fill={c.heart}
          opacity={0.4}
        />
      ))}

      {/* Ribbon decorations at bottom */}
      <Path
        d="M0,1200 Q270,1170 540,1190 Q810,1210 1080,1180 L1080,1210 Q810,1240 540,1220 Q270,1200 0,1230 Z"
        fill={c.ribbon}
        opacity={0.3}
      />
      <Path
        d="M0,1250 Q270,1230 540,1245 Q810,1260 1080,1240 L1080,1350 L0,1350 Z"
        fill={c.ribbon}
        opacity={0.15}
      />

      {/* Photo circle border */}
      <Circle cx={CX} cy={CY} r={CR + 10} fill="white" opacity={0.9} />
      <Circle cx={CX} cy={CY} r={CR + 5} fill={c.ribbon} opacity={0.3} />

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

      <Circle
        cx={CX}
        cy={CY}
        r={CR}
        fill="none"
        stroke="white"
        strokeWidth="8"
      />

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
