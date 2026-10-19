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
      {/* Official emblem with golden subtle border ring */}
      <div className="relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#E1A63E] via-[#94A3B8] to-[#1F3A5F] shadow-md group-hover:scale-105 transition-transform duration-200">
        <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#0F1E36] flex items-center justify-center">
          <img
            src={officialLogo}
            alt="A² Strategic Solutions Emblem"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-lg sm:text-xl font-black tracking-tight ${
              light ? 'text-white' : 'text-[#0F1E36]'
            }`}
          >
            A<sup className="text-xs font-bold text-[#E1A63E] -top-1.5 ml-0.5">2</sup>
          </span>
          <span
            className={`text-sm sm:text-base font-extrabold tracking-wide uppercase ${
              light ? 'text-slate-100' : 'text-[#1F3A5F]'
            }`}
          >
            STRATEGIC
          </span>
        </div>
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
