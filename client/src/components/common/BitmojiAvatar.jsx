import React from 'react'

// Color Palettes & Options
export const BACKGROUND_COLORS = [
  { id: 'amber', hex: '#F5B800', label: 'Amber Gold' },
  { id: 'emerald', hex: '#10B981', label: 'Emerald Green' },
  { id: 'indigo', hex: '#6366F1', label: 'Indigo Night' },
  { id: 'rose', hex: '#F43F5E', label: 'Rose Velvet' },
  { id: 'cyan', hex: '#06B6D4', label: 'Cyan Pulse' },
  { id: 'slate', hex: '#475569', label: 'Slate Dark' },
  { id: 'violet', hex: '#8B5CF6', label: 'Violet Myst' },
  { id: 'bronze', hex: '#D97706', label: 'Warm Bronze' },
]

export const SKIN_TONES = [
  { id: 'fair', hex: '#FCE0D8', label: 'Warm Fair' },
  { id: 'golden', hex: '#F1C27D', label: 'Golden Tan' },
  { id: 'honey', hex: '#E0AC69', label: 'Honey' },
  { id: 'bronze', hex: '#C68642', label: 'Bronze' },
  { id: 'deep', hex: '#4A2C11', label: 'Espresso' },
]

export const HAIR_OPTIONS = [
  { id: 'SHORT', label: 'Short Crop' },
  { id: 'CURLY', label: 'Curls / Afro' },
  { id: 'LONG', label: 'Long Waves' },
  { id: 'CAP', label: 'Streetwear Cap' },
  { id: 'BEANIE', label: 'Knit Beanie' },
  { id: 'HOODIE', label: 'Cozy Hood' },
  { id: 'CROWN', label: 'Trust Crown' },
]

export const EYE_OPTIONS = [
  { id: 'PUPILS', label: 'Calm Eyes' },
  { id: 'SHADES', label: 'Cool Shades 🕶️' },
  { id: 'GLASSES', label: 'Wise Glasses 👓' },
  { id: 'STARRY', label: 'Starry Eyes ★' },
  { id: 'HAPPY', label: 'Happy Arches ^' },
]

export const MOUTH_OPTIONS = [
  { id: 'SMILE', label: 'Warm Smile' },
  { id: 'SMIRK', label: 'Cool Smirk' },
  { id: 'NEUTRAL', label: 'Neutral Line' },
  { id: 'LAUGH', label: 'Big Laugh' },
]

export const ACCESSORY_OPTIONS = [
  { id: 'NONE', label: 'None' },
  { id: 'HEADPHONES', label: 'Headphones 🎧' },
  { id: 'BADGE', label: 'Trust Badge ⭐' },
  { id: 'SPARKLES', label: 'Ambient Sparkles ✦' },
]

// Safe string hash for deterministic default avatar options
function stringToHash(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getItem(arr = [], index = 0) {
  if (!arr || arr.length === 0) return {}
  const safeIdx = Math.abs(index) % arr.length
  return arr[safeIdx] || arr[0]
}

export function getDefaultAvatarConfig(seed = 'Persona') {
  const hash = stringToHash(seed || 'Persona')
  return {
    bg: getItem(BACKGROUND_COLORS, hash)?.hex || '#F5B800',
    skin: getItem(SKIN_TONES, Math.floor(hash / 3))?.hex || '#F1C27D',
    hair: getItem(HAIR_OPTIONS, Math.floor(hash / 7))?.id || 'SHORT',
    eyes: getItem(EYE_OPTIONS, Math.floor(hash / 13))?.id || 'PUPILS',
    mouth: getItem(MOUTH_OPTIONS, Math.floor(hash / 17))?.id || 'SMILE',
    accessory: getItem(ACCESSORY_OPTIONS, Math.floor(hash / 23))?.id || 'NONE',
  }
}

export default function BitmojiAvatar({ seed = 'Persona', avatarConfig, size = 'md', className = '' }) {
  // Merge default seed config with custom avatarConfig
  const defaultConfig = getDefaultAvatarConfig(seed)
  const config = { ...defaultConfig, ...(avatarConfig || {}) }

  // Dimensions based on size token
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96,
  }
  const pxSize = typeof size === 'number' ? size : (sizeMap[size] || 40)

  return (
    <svg
      width={pxSize}
      height={pxSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shrink-0 shadow-xs select-none ${className}`}
    >
      {/* LAYER 1: Background Circle */}
      <circle cx="50" cy="50" r="50" fill={config.bg || '#F5B800'} />
      <circle cx="50" cy="50" r="49" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" />

      {/* LAYER 2: Clothing / Outfit Base */}
      <path
        d="M20 90C20 74 32 68 50 68C68 68 80 74 80 90V100H20V90Z"
        fill="#151518"
      />
      <path
        d="M38 68L50 82L62 68"
        stroke="#25252A"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* LAYER 3: Neck & Base Head */}
      <rect x="43" y="52" width="14" height="18" rx="4" fill={config.skin || '#F1C27D'} />
      <ellipse cx="50" cy="44" rx="22" ry="24" fill={config.skin || '#F1C27D'} />

      {/* LAYER 4: Facial Expressions (Eyes & Eyewear) */}
      {config.eyes === 'PUPILS' && (
        <g fill="#111113">
          <circle cx="41" cy="42" r="3" />
          <circle cx="59" cy="42" r="3" />
          <circle cx="42" cy="41" r="1" fill="#ffffff" />
          <circle cx="60" cy="41" r="1" fill="#ffffff" />
        </g>
      )}

      {config.eyes === 'HAPPY' && (
        <g stroke="#111113" strokeWidth="2.5" strokeLinecap="round">
          <path d="M37 43Q41 38 45 43" />
          <path d="M55 43Q59 38 63 43" />
        </g>
      )}

      {config.eyes === 'SHADES' && (
        <g>
          {/* Cool Sunglasses */}
          <path d="M32 38H68V46C68 49 64 51 60 51H58C55 51 53 49 53 46V41H47V46C47 49 45 51 42 51H40C36 51 32 49 32 46V38Z" fill="#111113" />
          <path d="M34 40H45V44H34V40Z" fill="#333338" />
          <path d="M55 40H66V44H55V40Z" fill="#333338" />
          <line x1="28" y1="40" x2="33" y2="40" stroke="#111113" strokeWidth="2" />
          <line x1="67" y1="40" x2="72" y2="40" stroke="#111113" strokeWidth="2" />
        </g>
      )}

      {config.eyes === 'GLASSES' && (
        <g stroke="#111113" strokeWidth="2" fill="none">
          <circle cx="40" cy="42" r="7" stroke="#111113" />
          <circle cx="60" cy="42" r="7" stroke="#111113" />
          <line x1="47" y1="42" x2="53" y2="42" stroke="#111113" strokeWidth="2" />
          <circle cx="40" cy="42" r="2" fill="#111113" stroke="none" />
          <circle cx="60" cy="42" r="2" fill="#111113" stroke="none" />
        </g>
      )}

      {config.eyes === 'STARRY' && (
        <g fill="#F5B800">
          {/* Star Left */}
          <path d="M40 37L41.5 40.5L45 41L42.5 43.5L43 47L40 45L37 47L37.5 43.5L35 41L38.5 40.5Z" />
          {/* Star Right */}
          <path d="M60 37L61.5 40.5L65 41L62.5 43.5L63 47L60 45L57 47L57.5 43.5L55 41L58.5 40.5Z" />
        </g>
      )}

      {/* LAYER 5: Mouth */}
      {config.mouth === 'SMILE' && (
        <path d="M42 53Q50 61 58 53" stroke="#111113" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {config.mouth === 'SMIRK' && (
        <path d="M44 54Q52 58 57 52" stroke="#111113" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      {config.mouth === 'NEUTRAL' && (
        <line x1="43" y1="54" x2="57" y2="54" stroke="#111113" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {config.mouth === 'LAUGH' && (
        <path d="M42 52C42 59 58 59 58 52Z" fill="#111113" />
      )}

      {/* LAYER 6: Hair & Headwear */}
      {config.hair === 'SHORT' && (
        <path
          d="M28 40C28 26 38 20 50 20C62 20 72 26 72 40C72 30 64 24 50 24C36 24 28 30 28 40Z"
          fill="#111113"
        />
      )}

      {config.hair === 'CURLY' && (
        <g fill="#111113">
          <circle cx="32" cy="30" r="10" />
          <circle cx="44" cy="24" r="11" />
          <circle cx="56" cy="24" r="11" />
          <circle cx="68" cy="30" r="10" />
          <circle cx="28" cy="38" r="8" />
          <circle cx="72" cy="38" r="8" />
        </g>
      )}

      {config.hair === 'LONG' && (
        <g fill="#111113">
          <path d="M28 36C28 24 38 20 50 20C62 20 72 24 72 36V62C72 64 68 66 66 62V42C66 30 58 24 50 24C42 24 34 30 34 42V62C34 66 30 64 28 62V36Z" />
        </g>
      )}

      {config.hair === 'CAP' && (
        <g>
          {/* Baseball Cap */}
          <path d="M26 38C26 25 36 20 50 20C64 20 74 25 74 38H26Z" fill="#151518" />
          <path d="M18 38H56V42H20C18.5 42 18 40 18 38Z" fill="#25252A" />
          <circle cx="50" cy="20" r="3" fill="#F5B800" />
        </g>
      )}

      {/* Streetwear Knit Beanie */}
      {config.hair === 'BEANIE' && (
        <g>
          <path d="M26 38C26 22 36 16 50 16C64 16 74 22 74 38H26Z" fill="#25252A" />
          <rect x="24" y="34" width="52" height="7" rx="3" fill="#151518" />
          <circle cx="50" cy="14" r="4" fill="#F5B800" />
        </g>
      )}

      {/* Cozy Hood */}
      {config.hair === 'HOODIE' && (
        <path
          d="M24 45C24 24 34 18 50 18C66 18 76 24 76 45V68H68V48C68 32 60 26 50 26C40 26 32 32 32 48V68H24V45Z"
          fill="#151518"
        />
      )}

      {/* Trust Crown */}
      {config.hair === 'CROWN' && (
        <g>
          <path d="M28 35L34 22L50 30L66 22L72 35H28Z" fill="#F5B800" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="34" cy="22" r="2.5" fill="#ffffff" />
          <circle cx="50" cy="30" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="22" r="2.5" fill="#ffffff" />
        </g>
      )}

      {/* LAYER 7: Accessories */}
      {config.accessory === 'HEADPHONES' && (
        <g>
          <path d="M22 42C22 26 34 18 50 18C66 18 78 26 78 42" stroke="#151518" strokeWidth="4" strokeLinecap="round" fill="none" />
          <rect x="18" y="38" width="8" height="14" rx="4" fill="#F5B800" />
          <rect x="74" y="38" width="8" height="14" rx="4" fill="#F5B800" />
        </g>
      )}

      {config.accessory === 'BADGE' && (
        <g>
          <circle cx="68" cy="74" r="7" fill="#F5B800" stroke="#151518" strokeWidth="1.5" />
          <path d="M68 70.5L69 72.5L71.5 73L69.5 74.5L70 77L68 75.5L66 77L66.5 74.5L64.5 73L67 72.5Z" fill="#151518" />
        </g>
      )}

      {config.accessory === 'SPARKLES' && (
        <g fill="#F5B800">
          <path d="M82 18L83 22L87 23L83 24L82 28L81 24L77 23L81 22Z" opacity="0.9" />
          <path d="M16 28L17 31L20 32L17 33L16 36L15 33L12 32L15 31Z" opacity="0.7" />
        </g>
      )}
    </svg>
  )
}
