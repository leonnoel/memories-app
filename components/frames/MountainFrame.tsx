import React, { useId } from 'react';
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

interface MountainFrameProps {
  photoUri?: string;
  childName: string;
  ageText: string;
  width?: number;
  height?: number;
}

export function MountainFrame({
  photoUri,
  childName,
  ageText,
  width = W,
  height = H,
}: MountainFrameProps) {
  const uid = useId().replace(/:/g, '');
  const c = Colors.frames.mountain;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id={`msky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.sky} />
          <Stop offset="1" stopColor={c.skyDark} />
        </LinearGradient>
        <ClipPath id={`mclip${uid}`}>
          <Circle cx={CX} cy={CY} r={CR} />
        </ClipPath>
      </Defs>

      {/* Sky background */}
      <Rect x="0" y="0" width={W} height={H} fill={`url(#msky${uid})`} />

      {/* Sun */}
      <Circle cx="180" cy="180" r="70" fill={c.sun} opacity={0.9} />
      <Circle cx="180" cy="180" r="90" fill={c.sun} opacity={0.2} />

      {/* Clouds */}
      <G opacity={0.85}>
        <Ellipse cx="750" cy="160" rx="90" ry="35" fill={c.cloud} />
        <Ellipse cx="820" cy="150" rx="70" ry="30" fill={c.cloud} />
        <Ellipse cx="690" cy="155" rx="60" ry="28" fill={c.cloud} />
      </G>
      <G opacity={0.6}>
        <Ellipse cx="350" cy="100" rx="65" ry="25" fill={c.cloud} />
        <Ellipse cx="410" cy="95" rx="55" ry="22" fill={c.cloud} />
      </G>

      {/* Far mountains */}
      <Path
        d="M0,950 L150,700 L280,820 L450,650 L600,780 L750,620 L900,750 L1080,680 L1080,950 Z"
        fill={c.mountain}
        opacity={0.5}
      />

      {/* Near mountains */}
      <Path
        d="M0,1000 L200,750 L350,880 L540,700 L700,850 L850,720 L1080,850 L1080,1000 Z"
        fill={c.mountain}
      />

      {/* Snow caps */}
      <Path d="M540,700 L500,760 L580,760 Z" fill={c.snow} opacity={0.9} />
      <Path d="M200,750 L170,800 L230,800 Z" fill={c.snow} opacity={0.9} />
      <Path d="M850,720 L820,770 L880,770 Z" fill={c.snow} opacity={0.9} />

      {/* Ground / grass */}
      <Path
        d="M0,1000 Q270,960 540,980 Q810,1000 1080,970 L1080,1350 L0,1350 Z"
        fill={c.mountainDark}
        opacity={0.4}
      />
      <Rect x="0" y="1050" width={W} height="300" fill="#7CAA98" opacity={0.6} />

      {/* Pine trees */}
      {[80, 200, 900, 1000].map((x, i) => (
        <G key={i}>
          <Path
            d={`M${x},1060 L${x - 20},1100 L${x - 10},1095 L${x - 25},1130 L${x - 12},1125 L${x - 30},1160 L${x + 30},1160 L${x + 12},1125 L${x + 25},1130 L${x + 10},1095 L${x + 20},1100 Z`}
            fill={c.tree}
          />
          <Rect x={x - 4} y="1160" width="8" height="20" fill="#5A4A3A" />
        </G>
      ))}

      {/* Small birds */}
      <Path d="M300,250 Q310,240 320,250" stroke={Colors.text} strokeWidth="3" fill="none" />
      <Path d="M340,230 Q348,222 356,230" stroke={Colors.text} strokeWidth="2.5" fill="none" />
      <Path d="M820,280 Q828,272 836,280" stroke={Colors.text} strokeWidth="2.5" fill="none" />

      {/* Photo circle border */}
      <Circle cx={CX} cy={CY} r={CR + 8} fill={c.cloud} opacity={0.9} />
      <Circle cx={CX} cy={CY} r={CR + 4} fill={c.sun} opacity={0.3} />

      {/* Photo */}
      {photoUri ? (
        <SvgImage
          x={CX - CR}
          y={CY - CR}
          width={CR * 2}
          height={CR * 2}
          href={photoUri}
          clipPath={`url(#mclip${uid})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <Circle cx={CX} cy={CY} r={CR} fill={Colors.primaryLight} opacity={0.5} />
      )}

      {/* Photo circle outline */}
      <Circle cx={CX} cy={CY} r={CR} fill="none" stroke={c.cloud} strokeWidth="6" />

      {/* Name text */}
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

      {/* Age text */}
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

      {/* Small decorative stars */}
      <Path d="M100,300 l5,-15 l5,15 l-15,-8 l15,0 Z" fill={c.sun} opacity={0.6} />
      <Path d="M950,150 l4,-12 l4,12 l-12,-6 l12,0 Z" fill={c.sun} opacity={0.6} />
    </Svg>
  );
}
