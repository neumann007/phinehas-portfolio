'use client'

const NAV_W = 960
const NAV_H = 48

// Displacement map SVG — encodes refraction direction per pixel
// Neutral gray (128,128,128) = no displacement
// R > 128 = shift right, R < 128 = shift left
// G > 128 = shift down, G < 128 = shift up
// Edges have strong color values → strong bending at glass rim
const displacementMap = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${NAV_W}" height="${NAV_H}">
  <defs>
    <!-- Left bezel: R=220 → strong rightward bend (convex lens) -->
    <linearGradient id="le" x1="0" y1="0" x2="${NAV_W * 0.06}" y2="0"
      gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(220,128,128)"/>
      <stop offset="1" stop-color="rgb(128,128,128)"/>
    </linearGradient>
    <!-- Right bezel: R=36 → strong leftward bend -->
    <linearGradient id="re" x1="${NAV_W * 0.94}" y1="0" x2="${NAV_W}" y2="0"
      gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(128,128,128)"/>
      <stop offset="1" stop-color="rgb(36,128,128)"/>
    </linearGradient>
    <!-- Top bezel: G=210 → strong downward bend -->
    <linearGradient id="te" x1="0" y1="0" x2="0" y2="${NAV_H * 0.5}"
      gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(128,210,128)"/>
      <stop offset="1" stop-color="rgb(128,128,128)"/>
    </linearGradient>
    <!-- Bottom bezel: G=46 → strong upward bend -->
    <linearGradient id="be" x1="0" y1="${NAV_H * 0.5}" x2="0" y2="${NAV_H}"
      gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(128,128,128)"/>
      <stop offset="1" stop-color="rgb(128,46,128)"/>
    </linearGradient>
  </defs>
  <!-- Neutral base -->
  <rect width="${NAV_W}" height="${NAV_H}" fill="rgb(128,128,128)"/>
  <!-- Edge overlays -->
  <rect width="${NAV_W * 0.06}" height="${NAV_H}" fill="url(#le)"/>
  <rect x="${NAV_W * 0.94}" width="${
  NAV_W * 0.06
}" height="${NAV_H}" fill="url(#re)"/>
  <rect width="${NAV_W}" height="${NAV_H * 0.5}" fill="url(#te)"/>
  <rect y="${NAV_H * 0.5}" width="${NAV_W}" height="${
  NAV_H * 0.5
}" fill="url(#be)"/>
</svg>
`)}`

// Specular rim — white gradient stroke along top edge for the glowing rim highlight
const specularMap = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="${NAV_W}" height="${NAV_H}">
  <defs>
    <linearGradient id="sg" x1="0" y1="0" x2="${NAV_W}" y2="0"
      gradientUnits="userSpaceOnUse">
      <stop offset="0"   stop-color="white" stop-opacity="0"/>
      <stop offset="15%" stop-color="white" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="white" stop-opacity="1"/>
      <stop offset="85%" stop-color="white" stop-opacity="0.7"/>
      <stop offset="1"   stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sg2" x1="0" y1="0" x2="${NAV_W}" y2="0"
      gradientUnits="userSpaceOnUse">
      <stop offset="0"   stop-color="white" stop-opacity="0"/>
      <stop offset="10%" stop-color="white" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="white" stop-opacity="0.5"/>
      <stop offset="90%" stop-color="white" stop-opacity="0.3"/>
      <stop offset="1"   stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Top specular rim highlight — the "lit glass edge" -->
  <rect width="${NAV_W}" height="1.5" fill="url(#sg)"/>
  <!-- Secondary softer highlight -->
  <rect y="1.5" width="${NAV_W}" height="3" fill="url(#sg2)" opacity="0.4"/>
</svg>
`)}`

export default function GlassFilter () {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden='true'
    >
      <defs>
        <filter
          id='liquid-glass-nav'
          x='-5%'
          y='-30%'
          width='110%'
          height='160%'
          colorInterpolationFilters='sRGB'
        >
          {/* Step 1: Slight blur of the source */}
          <feGaussianBlur
            in='SourceGraphic'
            stdDeviation='1'
            result='blurred_source'
          />

          {/* Step 2: Load displacement map */}
          <feImage
            href={displacementMap}
            x='0'
            y='0'
            width={NAV_W}
            height={NAV_H}
            result='displacement_map'
          />

          {/* Step 3: Apply displacement — strong scale=55 for heavy bending */}
          <feDisplacementMap
            in='blurred_source'
            in2='displacement_map'
            scale='55'
            xChannelSelector='R'
            yChannelSelector='G'
            result='displaced'
          />

          {/* Step 4: Saturate displaced result for richer color */}
          <feColorMatrix
            in='displaced'
            type='saturate'
            values='1.8'
            result='displaced_saturated'
          />

          {/* Step 5: Load specular rim map */}
          <feImage
            href={specularMap}
            x='0'
            y='0'
            width={NAV_W}
            height={NAV_H}
            result='specular_layer'
          />

          {/* Step 6: Soften the rim slightly */}
          <feGaussianBlur
            in='specular_layer'
            stdDeviation='0.8'
            result='specular_blurred'
          />

          {/* Step 7: Mask saturated layer by specular rim shape */}
          <feComposite
            in='displaced_saturated'
            in2='specular_blurred'
            operator='in'
            result='specular_masked'
          />

          {/* Step 8: Blend specular highlight over displaced base */}
          <feBlend in='specular_masked' in2='displaced' mode='screen' />
        </filter>
      </defs>
    </svg>
  )
}
