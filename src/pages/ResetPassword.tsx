import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    passwordConfirm?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { confirmPasswordReset } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const errs: typeof errors = {}
    if (!password) {
      errs.password = 'Nova senha é obrigatória.'
    } else if (password.length < 8) {
      errs.password = 'A senha deve ter no mínimo 8 caracteres.'
    }
    if (!passwordConfirm) {
      errs.passwordConfirm = 'Confirme a nova senha.'
    } else if (password !== passwordConfirm) {
      errs.passwordConfirm = 'As senhas não conferem.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (!token) {
      setErrors({ general: 'Token de recuperação ausente ou inválido.' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await confirmPasswordReset(token, password, passwordConfirm)
      setIsSuccess(true)
      toast({
        title: 'Senha redefinida!',
        description: 'Sua senha foi alterada com sucesso.',
      })
      setTimeout(() => {
        navigate('/entrar')
      }, 2000)
    } catch (err: any) {
      setErrors({
        general:
          err?.data?.message ||
          err?.message ||
          'Token expirado ou inválido. Solicite um novo link.',
      })
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
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Definir nova senha</h2>
        <p className="mt-1 text-sm text-[#64748B]">Crie uma nova senha de acesso para sua conta</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10">
          {!token && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm mb-4">
              <p className="font-semibold">Link incompleto</p>
              <p className="text-xs text-amber-800 mt-1">
                Não encontramos o token de redefinição nesta URL. Por favor, acesse o link enviado
                diretamente para o seu e-mail.
              </p>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F3A5F]">Senha alterada com sucesso!</h3>
              <p className="text-sm text-slate-600">
                Você será redirecionado para a página de login em instantes...
              </p>
              <div className="pt-2">
                <Link
                  to="/entrar"
                  className="w-full inline-block py-2.5 px-4 rounded-lg bg-[#1F3A5F] text-white font-semibold text-sm"
                >
                  Ir para Login agora
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Nova senha (mínimo 8 caracteres)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#E2E8F0] focus:border-[#2563EB]'
                    }`}
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
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Confirmar nova senha
                </label>
                <input
                  id="passwordConfirm"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                    errors.passwordConfirm
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#E2E8F0] focus:border-[#2563EB]'
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando nova senha...
                    </>
                  ) : (
                    'Salvar nova senha'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <Link
              to="/entrar"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#1F3A5F] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
