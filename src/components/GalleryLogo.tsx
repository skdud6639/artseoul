interface GalleryLogoProps {
  className?: string;
  color?: string;
}

export default function GalleryLogo({ className = "h-5 sm:h-6 md:h-7 w-auto", color = "currentColor" }: GalleryLogoProps) {
  return (
    <svg
      viewBox="0 0 484 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
      aria-label="ART SEOUL"
    >
      {/* 
        Exact Vector Representation of "∧ R T   S E O U L" 
        Matching the uploaded image:
        - Geometric sans-serif monoline architecture
        - Uniform stroke width & cap-height
        - Exact letter proportions & elegant wide tracking
      */}
      <g stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter">
        {/* 1. ∧ (A Chevron without crossbar) */}
        <path d="M 12 46 L 29 14 L 46 46" strokeLinecap="round" />

        {/* 2. R */}
        <path d="M 76 46 V 14 H 96 C 105 14 111 19 111 27 C 111 35 105 40 96 40 H 76" strokeLinejoin="round" />
        <path d="M 94 40 L 110 46" />

        {/* 3. T */}
        <path d="M 136 14 H 168 M 152 14 V 46" />

        {/* 4. S */}
        <path
          d="M 245 22 C 242 16.5 235 14 227 14 C 217 14 210.5 19 210.5 26 C 210.5 38 245 31 245 40 C 245 45.5 237.5 46 227 46 C 216 46 209 41.5 207 36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. E */}
        <path d="M 271 14 H 295 M 271 30 H 291 M 271 46 H 295 M 271 14 V 46" />

        {/* 6. O */}
        <circle cx="332" cy="30" r="16" />

        {/* 7. U */}
        <path d="M 374 14 V 34 C 374 43 381 46 388 46 C 395 46 402 43 402 34 V 14" strokeLinejoin="round" />

        {/* 8. L */}
        <path d="M 430 14 V 46 H 454" />
      </g>
    </svg>
  );
}
