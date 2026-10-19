import React from 'react'
import { Link } from 'react-router-dom'

interface BrandWordmarkProps {
  className?: string
  light?: boolean
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className = '', light = false }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-extrabold tracking-wider transition-opacity hover:opacity-90 ${className}`}
      aria-label="Aguiar Advisory"
    >
      {/* Stylized geometric 'A' emblem / chart-up triangle */}
      <div
        className={`relative flex items-center justify-center w-9 h-9 rounded-lg shadow-sm border ${
          light
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-[#1F3A5F] border-[#1F3A5F] text-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-[#E1A63E]"
        >
          {/* Stylized sharp A with upward-trending arrow crossbar */}
          <path d="M4 20L12 4L20 20" />
          <path d="M7.5 14H16.5" />
          <polyline points="15 9 19 9 19 13" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={`text-base font-black tracking-widest ${
            light ? 'text-white' : 'text-[#1F3A5F]'
          }`}
        >
          AGUIAR
        </span>
        <span
          className={`text-[10px] font-semibold tracking-[0.25em] ${
            light ? 'text-blue-200' : 'text-[#2563EB]'
          }`}
        >
          ADVISORY
        </span>
      </div>
    </Link>
  )
}
