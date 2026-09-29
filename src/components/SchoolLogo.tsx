import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="silverRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="40%" stopColor="#94a3b8" />
            <stop offset="60%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <radialGradient id="torchGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#dc2626" />
          </radialGradient>
          <linearGradient id="wingBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Pentagon with Silver Bezel */}
        <polygon
          points="100,8 190,74 156,180 44,180 10,74"
          fill="url(#silverRim)"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* Inner Pentagon with White/Subtle Gray Field */}
        <polygon
          points="100,22 176,78 146,168 54,168 24,78"
          fill="url(#shieldBg)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Stylized Blue Wings (left & right) */}
        <path
          d="M 50 82 C 34 65, 42 110, 68 128 C 58 116, 52 100, 58 88 Z"
          fill="url(#wingBlue)"
          opacity="0.85"
        />
        <path
          d="M 150 82 C 166 65, 158 110, 132 128 C 142 116, 148 100, 142 88 Z"
          fill="url(#wingBlue)"
          opacity="0.85"
        />
        <path
          d="M 38 72 C 32 94, 60 114, 76 122 C 60 112, 46 96, 48 80 Z"
          fill="url(#wingBlue)"
          opacity="0.6"
        />
        <path
          d="M 162 72 C 168 94, 140 114, 124 122 C 140 112, 154 96, 152 80 Z"
          fill="url(#wingBlue)"
          opacity="0.6"
        />

        {/* Flame / Obor at the top */}
        <path
          d="M 100 34 C 92 48, 88 56, 100 70 C 112 56, 108 48, 100 34 Z"
          fill="url(#torchGlow)"
        />
        <path
          d="M 100 42 C 96 52, 94 58, 100 66 C 106 58, 104 52, 100 42 Z"
          fill="#fef08a"
        />
        {/* Crown base for flame */}
        <polygon points="90,68 110,68 106,73 94,73" fill="#eab308" />

        {/* Center Target & TB Monogram */}
        <circle cx="100" cy="106" r="32" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="100" cy="106" r="26" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Crosshair spokes */}
        <line x1="100" y1="74" x2="100" y2="138" stroke="#0f172a" strokeWidth="1.2" />
        <line x1="68" y1="106" x2="132" y2="106" stroke="#0f172a" strokeWidth="1.2" />
        <line x1="77" y1="83" x2="123" y2="129" stroke="#64748b" strokeWidth="0.8" />
        <line x1="123" y1="83" x2="77" y2="129" stroke="#64748b" strokeWidth="0.8" />

        {/* Red Center Ball */}
        <circle cx="100" cy="106" r="6" fill="#dc2626" />
        <circle cx="98" cy="104" r="2" fill="#ffffff" opacity="0.8" />

        {/* TB Monogram Text */}
        <text
          x="100"
          y="114"
          textAnchor="middle"
          fill="#b91c1c"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="-1"
          opacity="0.85"
        >
          TB
        </text>

        {/* Open Book at bottom of circle */}
        <path
          d="M 76 148 C 88 142, 98 146, 100 152 C 102 146, 112 142, 124 148 L 122 158 C 112 153, 102 156, 100 162 C 98 156, 88 153, 78 158 Z"
          fill="#cbd5e1"
          stroke="#475569"
          strokeWidth="1.2"
        />
        <line x1="100" y1="152" x2="100" y2="162" stroke="#334155" strokeWidth="1.2" />

        {/* Ribbon Banner "SMK TARUNA BHAKTI" */}
        <path
          d="M 52 165 Q 100 157 148 165 L 144 175 Q 100 167 56 175 Z"
          fill="#ffffff"
          stroke="#475569"
          strokeWidth="1.2"
        />
        <path
          d="M 52 165 L 44 169 L 56 175 Z"
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="1"
        />
        <path
          d="M 148 165 L 156 169 L 144 175 Z"
          fill="#94a3b8"
          stroke="#475569"
          strokeWidth="1"
        />
        <text
          x="100"
          y="172"
          textAnchor="middle"
          fill="#0f172a"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="7.5"
          letterSpacing="0.4"
        >
          SMK TARUNA BHAKTI
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
            SMK TARUNA BHAKTI
          </span>
          <span className="text-xs text-slate-500 font-medium leading-none">
            Kadugede · Kuningan
          </span>
        </div>
      )}
    </div>
  );
};
