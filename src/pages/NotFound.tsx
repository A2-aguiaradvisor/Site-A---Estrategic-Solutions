import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { BrandWordmark } from '@/components/BrandWordmark'
import { ArrowLeft, Home } from 'lucide-react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.warn('Página não encontrada:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-center">
      <div className="mb-6">
        <BrandWordmark />
      </div>
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E2E8F0] shadow-modal max-w-md w-full">
        <span className="text-5xl font-black text-[#2563EB] block mb-2">404</span>
        <h1 className="text-xl font-bold text-[#1F3A5F] mb-2">Página não encontrada</h1>
        <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
          O endereço solicitado não existe ou pode ter sido movido. Verifique o link ou retorne à
          página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-xs font-semibold hover:bg-[#17304F] transition-colors"
          >
            <Home className="w-4 h-4" />
            Página Inicial
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
