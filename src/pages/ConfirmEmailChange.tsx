import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

export default function ConfirmEmailChange() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { confirmEmailChange } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Informe sua senha para confirmar a alteração do e-mail.')
      return
    }
    if (!token) {
      setError('Token de alteração ausente ou inválido.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await confirmEmailChange(token, password)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Token expirado ou senha incorreta.')
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
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Confirmação de Novo E-mail</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F3A5F]">
                Seu e-mail foi alterado com sucesso!
              </h3>
              <p className="text-sm text-slate-600">
                Por motivos de segurança, você foi desconectado. Faça login com o seu novo e-mail.
              </p>
              <div className="pt-4">
                <Link
                  to="/entrar"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all"
                >
                  Entrar com o novo e-mail
                </Link>
              </div>
            </div>
          ) : (
            <>
              {!token && (
                <div className="p-3.5 mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  Token não informado na URL. Verifique o link recebido no e-mail.
                </div>
              )}

              {error && (
                <div className="p-3.5 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-sm text-slate-600 mb-5">
                Para confirmar a alteração do seu e-mail cadastrado, confirme a sua senha atual
                abaixo:
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#1F3A5F] mb-1.5"
                  >
                    Sua senha atual
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar' : 'Exibir'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    'Confirmar alteração de e-mail'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
