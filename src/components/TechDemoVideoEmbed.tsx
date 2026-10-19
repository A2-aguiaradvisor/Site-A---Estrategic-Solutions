import React, { useState } from 'react'
import { Play, Pause, ExternalLink, ShieldCheck, Sparkles, Layers } from 'lucide-react'

interface TechDemoVideoEmbedProps {
  className?: string
  title?: string
  subtitle?: string
}

export const TechDemoVideoEmbed: React.FC<TechDemoVideoEmbedProps> = ({
  className = '',
  title = 'Ecossistema A² Strategic em Operação',
  subtitle = 'Demonstração de arquitetura financeira e fechamento com dashboards interativos em alta definição.',
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#0F1E36] to-[#0A1526] overflow-hidden shadow-2xl ${className}`}
    >
      <div className="p-4 sm:p-5 border-b border-slate-700/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E1A63E] animate-pulse" />
          <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Demonstração em Vídeo
        </span>
      </div>

      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden group">
        {!isPlaying ? (
          <>
            {/* High-tech dashboard thumbnail preview */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1E36] via-[#1E293B] to-[#0A1526] opacity-90" />

            {/* Visual tech grid overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.25),transparent_70%)]" />

            {/* Stylized UI lines */}
            <div className="absolute inset-6 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between pointer-events-none opacity-60">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>DRE CONSOLIDADA • A² ANALYTICS</span>
                <span>STATUS: OPERACIONAL (24/7)</span>
              </div>
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E1A63E]/20 border-2 border-[#E1A63E] flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#E1A63E]/20">
                    <Play className="w-7 h-7 text-[#E1A63E] fill-[#E1A63E] translate-x-0.5" />
                  </div>
                  <p className="text-xs font-bold text-white">Assistir demonstração guiada</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Vídeo explicativo de 2 min sobre os recursos
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>CONECTORES: SAP, TOTVS, EXCEL</span>
                <span>PADRÃO LEVERPRO BENCHMARK</span>
              </div>
            </div>

            {/* Play Button Trigger */}
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
              aria-label="Iniciar reprodução da demonstração tecnológica"
            />
          </>
        ) : (
          <iframe
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="A² Strategic Solutions - Demonstração Tecnológica"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="p-4 bg-slate-900/60 border-t border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p className="text-slate-300 text-center sm:text-left">{subtitle}</p>
        <div className="flex items-center gap-2 flex-shrink-0 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Qualidade 4K Ultra HD</span>
        </div>
      </div>
    </div>
  )
}
