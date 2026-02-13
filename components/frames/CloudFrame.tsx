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

interface CloudFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function CloudFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: CloudFrameProps) {
  const c = Colors.frames.cloud;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="cloudSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.skyTop} />
          <Stop offset="0.6" stopColor={c.skyBottom} />
          <Stop offset="1" stopColor="#F0E6FF" />
        </LinearGradient>
        <ClipPath id="photoClip">
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Gradient sky */}
      <Rect x="0" y="0" width={W} height={H} fill="url(#cloudSky)" />

      {/* Rainbow */}
      <G opacity={0.35}>
        {c.rainbow.map((color: string, i: number) => (
          <Path
            key={i}
            d={`M200,${320 + i * 18} Q540,${140 + i * 18} 880,${320 + i * 18}`}
            stroke={color}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </G>

      {/* Big fluffy clouds - top */}
      <G opacity={0.9}>
        <Ellipse cx="200" cy="120" rx="120" ry="50" fill={c.cloud} />
        <Ellipse cx="300" cy="110" rx="100" ry="45" fill={c.cloud} />
        <Ellipse cx="140" cy="115" rx="80" ry="40" fill={c.cloud} />
        <Ellipse cx="250" cy="140" rx="90" ry="35" fill={c.cloud} />
      </G>

      <G opacity={0.85}>
        <Ellipse cx="800" cy="150" rx="110" ry="48" fill={c.cloud} />
        <Ellipse cx="880" cy="140" rx="90" ry="40" fill={c.cloud} />
        <Ellipse cx="740" cy="145" rx="70" ry="35" fill={c.cloud} />
      </G>

      {/* Mid clouds */}
      <G opacity={0.5}>
        <Ellipse cx="100" cy="400" rx="80" ry="30" fill={c.cloud} />
        <Ellipse cx="160" cy="395" rx="65" ry="25" fill={c.cloud} />
      </G>
      <G opacity={0.5}>
        <Ellipse cx="920" cy="450" rx="85" ry="32" fill={c.cloud} />
        <Ellipse cx="990" cy="445" rx="60" ry="25" fill={c.cloud} />
      </G>

      {/* Bottom clouds layer */}
      <G opacity={0.7}>
        <Ellipse cx="150" cy="1100" rx="130" ry="50" fill={c.cloud} />
        <Ellipse cx="270" cy="1090" rx="100" ry="45" fill={c.cloud} />
        <Ellipse cx="80" cy="1095" rx="90" ry="40" fill={c.cloud} />
      </G>
      <G opacity={0.7}>
        <Ellipse cx="900" cy="1120" rx="120" ry="48" fill={c.cloud} />
        <Ellipse cx="1000" cy="1110" rx="80" ry="38" fill={c.cloud} />
        <Ellipse cx="820" cy="1115" rx="90" ry="40" fill={c.cloud} />
      </G>

      {/* Cloud shadows */}
      <G opacity={0.15}>
        <Ellipse cx="200" cy="135" rx="110" ry="30" fill={c.cloudShadow} />
        <Ellipse cx="800" cy="165" rx="100" ry="28" fill={c.cloudShadow} />
      </G>

      {/* Twinkling stars */}
      {[
        { x: 100, y: 250, s: 18 },
        { x: 300, y: 180, s: 14 },
        { x: 680, y: 200, s: 16 },
        { x: 950, y: 260, s: 12 },
        { x: 480, y: 1000, s: 15 },
        { x: 120, y: 900, s: 12 },
        { x: 900, y: 950, s: 14 },
        { x: 750, y: 1050, s: 10 },
        { x: 350, y: 1150, s: 16 },
      ].map(({ x, y, s }, i) => (
        <G key={i} opacity={0.6}>
          <Path
            d={`M${x},${y - s} L${x + 3},${y - 3} L${x + s},${y} L${x + 3},${y + 3} L${x},${y + s} L${x - 3},${y + 3} L${x - s},${y} L${x - 3},${y - 3} Z`}
            fill={c.star}
          />
        </G>
      ))}

      {/* Soft bottom area */}
      <Rect x="0" y="1200" width={W} height="150" fill={c.skyBottom} opacity={0.5} />

      {/* Photo circle glow */}
      <Circle cx={CX} cy={CY} r={CR + 20} fill={c.cloud} opacity={0.4} />
      <Circle cx={CX} cy={CY} r={CR + 10} fill={c.cloud} opacity={0.7} />

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
        <Circle cx={CX} cy={CY} r={CR} fill={c.cloud} opacity={0.4} />
      )}

      <Circle
        cx={CX}
        cy={CY}
        r={CR}
        fill="none"
        stroke={c.cloud}
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
        fill={Colors.surface}
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
        fill={Colors.surface}
      >
        {ageText}
      </SvgText>
    </Svg>
  );
}
