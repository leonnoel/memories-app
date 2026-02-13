import React, { useId } from 'react';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
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

interface MoonFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function MoonFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: MoonFrameProps) {
  const uid = useId().replace(/:/g, '');
  const c = Colors.frames.moon;

  const stars = [
    { x: 100, y: 100, s: 4 }, { x: 250, y: 60, s: 3 }, { x: 400, y: 120, s: 5 },
    { x: 550, y: 80, s: 3 }, { x: 700, y: 140, s: 4 }, { x: 850, y: 70, s: 3 },
    { x: 950, y: 130, s: 5 }, { x: 150, y: 200, s: 3 }, { x: 350, y: 250, s: 2 },
    { x: 600, y: 220, s: 4 }, { x: 800, y: 300, s: 3 }, { x: 1000, y: 250, s: 2 },
    { x: 80, y: 350, s: 3 }, { x: 1020, y: 400, s: 4 },
    { x: 60, y: 900, s: 3 }, { x: 200, y: 950, s: 4 }, { x: 400, y: 1000, s: 3 },
    { x: 650, y: 980, s: 2 }, { x: 850, y: 1020, s: 4 }, { x: 1000, y: 950, s: 3 },
    { x: 120, y: 1100, s: 2 }, { x: 300, y: 1150, s: 3 }, { x: 500, y: 1200, s: 4 },
    { x: 750, y: 1150, s: 3 }, { x: 950, y: 1200, s: 2 },
    { x: 170, y: 1250, s: 3 }, { x: 400, y: 1280, s: 2 }, { x: 700, y: 1260, s: 3 },
    { x: 900, y: 1290, s: 4 },
  ];

  const sparkleStars = [
    { x: 180, y: 150, s: 18 }, { x: 500, y: 170, s: 14 },
    { x: 750, y: 100, s: 20 }, { x: 350, y: 300, s: 12 },
    { x: 900, y: 350, s: 16 }, { x: 150, y: 1050, s: 14 },
    { x: 920, y: 1100, s: 16 },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id={`nsky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.skyTop} />
          <Stop offset="0.7" stopColor={c.skyBottom} />
          <Stop offset="1" stopColor="#1D3557" />
        </LinearGradient>
        <RadialGradient id={`mglow${uid}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.moonGlow} stopOpacity={0.6} />
          <Stop offset="1" stopColor={c.moonGlow} stopOpacity={0} />
        </RadialGradient>
        <ClipPath id={`nclip${uid}`}>
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Night sky */}
      <Rect x="0" y="0" width={W} height={H} fill={`url(#nsky${uid})`} />

      {/* Moon glow */}
      <Circle cx="870" cy="200" r="180" fill={`url(#mglow${uid})`} />

      {/* Crescent moon */}
      <Circle cx="870" cy="200" r="80" fill={c.moon} />
      <Circle cx="900" cy="180" r="65" fill={c.skyTop} />

      {/* Small dot stars */}
      {stars.map(({ x, y, s }, i) => (
        <Circle key={`star-${i}`} cx={x} cy={y} r={s} fill={c.starSmall} opacity={0.7} />
      ))}

      {/* Sparkle stars */}
      {sparkleStars.map(({ x, y, s }, i) => (
        <G key={`sparkle-${i}`} opacity={0.8}>
          <Path
            d={`M${x},${y - s} L${x + 3},${y - 3} L${x + s},${y} L${x + 3},${y + 3} L${x},${y + s} L${x - 3},${y + 3} L${x - s},${y} L${x - 3},${y - 3} Z`}
            fill={c.star}
          />
        </G>
      ))}

      {/* Branch at bottom */}
      <Path d="M0,1100 Q100,1080 200,1100 Q300,1120 400,1090 Q500,1060 550,1080" stroke={c.branch} strokeWidth="12" fill="none" strokeLinecap="round" />
      <Path d="M150,1095 Q180,1060 200,1070" stroke={c.branch} strokeWidth="6" fill="none" strokeLinecap="round" />
      <Path d="M300,1110 Q320,1080 340,1085" stroke={c.branch} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Path d="M450,1075 Q470,1050 480,1060" stroke={c.branch} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Leaves on branch */}
      {[
        { x: 180, y: 1060, rot: -30 }, { x: 280, y: 1090, rot: 20 },
        { x: 380, y: 1070, rot: -15 }, { x: 470, y: 1055, rot: 25 },
      ].map(({ x, y, rot }, i) => (
        <Ellipse key={`leaf-${i}`} cx={x} cy={y} rx="15" ry="6" fill="#4A6741" opacity={0.6} transform={`rotate(${rot} ${x} ${y})`} />
      ))}

      {/* Sleeping owl */}
      <G transform="translate(460, 1020)">
        <Ellipse cx="0" cy="0" rx="35" ry="40" fill={c.owl} />
        <Circle cx="0" cy="-30" r="25" fill={c.owl} />
        <Path d="M-20,-50 L-15,-35 L-25,-38 Z" fill={c.owl} />
        <Path d="M20,-50 L15,-35 L25,-38 Z" fill={c.owl} />
        <Ellipse cx="0" cy="5" rx="22" ry="28" fill="#A0936B" opacity={0.5} />
        <Path d="M-12,-33 Q-8,-30 -4,-33" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M4,-33 Q8,-30 12,-33" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Path d="M-4,-25 L0,-20 L4,-25 Z" fill="#D4A855" />
        <Path d="M-12,38 L-18,45 M-12,38 L-12,45 M-12,38 L-6,45" stroke={c.owl} strokeWidth="3" />
        <Path d="M12,38 L6,45 M12,38 L12,45 M12,38 L18,45" stroke={c.owl} strokeWidth="3" />
        <SvgText x="30" y="-45" fontSize="20" fill={c.starSmall} opacity={0.7} fontWeight="bold">z</SvgText>
        <SvgText x="45" y="-60" fontSize="16" fill={c.starSmall} opacity={0.5} fontWeight="bold">z</SvgText>
        <SvgText x="55" y="-70" fontSize="12" fill={c.starSmall} opacity={0.4} fontWeight="bold">z</SvgText>
      </G>

      {/* Right branch with sleeping bird */}
      <Path d="M1080,1150 Q980,1130 900,1160 Q820,1190 780,1170" stroke={c.branch} strokeWidth="10" fill="none" strokeLinecap="round" />
      <G transform="translate(870, 1130)">
        <Ellipse cx="0" cy="0" rx="18" ry="14" fill={c.starSmall} opacity={0.8} />
        <Circle cx="-12" cy="-8" r="10" fill={c.starSmall} opacity={0.8} />
        <Path d="M-20,-8 L-26,-5 L-20,-6 Z" fill={c.moon} />
        <Path d="M-8,-12 Q-5,-10 -2,-12" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </G>

      {/* Photo circle glow */}
      <Circle cx={CX} cy={CY} r={CR + 18} fill={c.moonGlow} opacity={0.3} />
      <Circle cx={CX} cy={CY} r={CR + 10} fill={c.moon} opacity={0.2} />

      {/* Photo */}
      {photoUri ? (
        <SvgImage
          x={CX - CR} y={CY - CR} width={CR * 2} height={CR * 2}
          href={photoUri} clipPath={`url(#nclip${uid})`} preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <Circle cx={CX} cy={CY} r={CR} fill={c.skyBottom} opacity={0.4} />
      )}
      <Circle cx={CX} cy={CY} r={CR} fill="none" stroke={c.moonGlow} strokeWidth="6" opacity={0.8} />

      {/* Name */}
      <SvgText x={CX} y={CY - CR - 50} textAnchor="middle" fontFamily="Nunito_700Bold, Nunito, sans-serif" fontSize="72" fontWeight="bold" fill={c.moonGlow}>
        {childName}
      </SvgText>

      {/* Age */}
      <SvgText x={CX} y={CY + CR + 80} textAnchor="middle" fontFamily="Nunito_600SemiBold, Nunito, sans-serif" fontSize="56" fontWeight="600" fill={c.starSmall}>
        {ageText}
      </SvgText>
    </Svg>
  );
}
