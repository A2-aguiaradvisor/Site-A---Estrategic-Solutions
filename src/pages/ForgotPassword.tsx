import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Insira um e-mail válido.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch {
      // Per spec: On success, always show informative message even if email is not found
      setSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandWordmark />
        </div>
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Recuperar senha</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Insira seu e-mail para receber as instruções de recuperação
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10">
          {submitted ? (
            <div className="text-center py-3 space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-[#2563EB] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1F3A5F]">Instruções enviadas</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Se existir uma conta associada a <strong>{email}</strong>, enviamos um link seguro
                de recuperação para a sua caixa de entrada.
              </p>
              <div className="pt-3">
                <Link
                  to="/entrar"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm transition-all"
                >
                  Voltar para o Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1.5"
                >
                  E-mail cadastrado
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                    error
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15'
                  }`}
                />
                {error && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando link...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <Link
              to="/entrar"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#1F3A5F] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Lembrou sua senha? Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
