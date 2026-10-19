import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [resendingEmail, setResendingEmail] = useState(false)

  const { signIn, requestVerification } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const validate = () => {
    const errs: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errs.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Insira um e-mail válido.'
    }
    if (!password) {
      errs.password = 'Senha é obrigatória.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})
    setUnverifiedEmail(null)

    try {
      await signIn(email, password)
      toast({
        title: 'Bem-vindo(a)!',
        description: 'Login realizado com sucesso.',
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'E-mail ou senha incorretos.'
      if (msg.toLowerCase().includes('verified')) {
        setUnverifiedEmail(email)
      }
      setErrors({ general: 'Falha no login. Verifique suas credenciais e tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return
    setResendingEmail(true)
    try {
      await requestVerification(unverifiedEmail)
      toast({
        title: 'E-mail reenviado!',
        description: 'Verifique sua caixa de entrada e spam para confirmar a conta.',
      })
    } catch {
      toast({
        title: 'Erro ao reenviar',
        description: 'Não foi possível enviar o e-mail de confirmação. Tente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandWordmark />
        </div>
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Acessar sua conta</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Entre para gerenciar seus programas e pedidos na A² Strategic Solutions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10">
          {unverifiedEmail && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Seu e-mail ainda não foi verificado.</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Para sua segurança, confirme o link enviado para sua caixa postal.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendingEmail}
                    className="mt-2 text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    {resendingEmail && <Loader2 className="w-3 h-3 animate-spin" />}
                    Reenviar e-mail de verificação
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F3A5F] mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#1F3A5F]">
                  Senha
                </label>
                <Link
                  to="/esqueci-senha"
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
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
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-sm text-[#64748B]">
              Não tem uma conta?{' '}
              <Link to="/criar-conta" className="font-bold text-[#2563EB] hover:underline">
                Criar conta
              </Link>
            </p>
            <div className="mt-4">
              <Link
                to="/"
                className="inline-flex items-center text-xs text-slate-500 hover:text-[#1F3A5F] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Voltar para o catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
