import React from 'react'
import { Link } from 'react-router-dom'

interface BrandWordmarkProps {
  className?: string
  light?: boolean
}

import officialLogo from '@/assets/logo-oficial-set2026-0dea0.png'

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className = '', light = false }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 font-extrabold tracking-wider transition-all hover:opacity-95 group ${className}`}
      aria-label="A² Strategic Solutions"
    >
      {/* Official emblem with golden subtle border ring — zoomed/cropped to focus on eagle + A² and hide bottom wordmark */}
      <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#E1A63E] via-[#94A3B8] to-[#1F3A5F] shadow-md group-hover:scale-105 transition-transform duration-200">
        <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#0B1527] relative">
          <img
            src={officialLogo}
            alt="A² Strategic Solutions Emblem"
            className="w-full h-full object-cover scale-[1.38] object-[center_32%]"
          />
        </div>
      </div>

      {/* Brand name text: "A²" removed here because the zoomed eagle emblem already contains A² in metallic silver */}
      <div className="flex flex-col leading-tight">
        <span
          className={`text-sm sm:text-base font-extrabold tracking-wide uppercase ${
            light ? 'text-slate-100' : 'text-[#1F3A5F]'
          }`}
        >
          STRATEGIC
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase ${
            light ? 'text-[#E1A63E]' : 'text-[#B47517]'
          }`}
        >
          SOLUTIONS
        </span>
      </div>
    </Link>
  )
}
