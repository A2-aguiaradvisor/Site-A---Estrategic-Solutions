import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    passwordConfirm?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registeredSuccess, setRegisteredSuccess] = useState(false)

  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const errs: typeof errors = {}
    if (!name.trim()) {
      errs.name = 'Nome completo é obrigatório.'
    }
    if (!email.trim()) {
      errs.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Insira um e-mail válido.'
    }
    if (!password) {
      errs.password = 'Senha é obrigatória.'
    } else if (password.length < 8) {
      errs.password = 'A senha deve ter no mínimo 8 caracteres.'
    }
    if (!passwordConfirm) {
      errs.passwordConfirm = 'Confirme sua senha.'
    } else if (password !== passwordConfirm) {
      errs.passwordConfirm = 'As senhas não coincidem.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      await signUp(email, password, name)
      setRegisteredSuccess(true)
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verifique seu e-mail para confirmar.',
      })
    } catch (err: any) {
      const fieldErrors: typeof errors = {}
      if (err?.data?.data) {
        const d = err.data.data
        if (d.email) fieldErrors.email = d.email.message || 'Este e-mail já está em uso.'
        if (d.password) fieldErrors.password = d.password.message || 'Senha inválida.'
        if (d.name) fieldErrors.name = d.name.message
      }
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
      } else {
        setErrors({ general: err?.message || 'Falha ao criar conta. Tente novamente.' })
      }
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
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Criar sua conta</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Acesse consultorias exclusivas e materiais executivos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10">
          {registeredSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F3A5F]">Conta criada com sucesso!</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enviamos um link de confirmação para <strong>{email}</strong>. Por favor, verifique
                sua caixa de entrada e spam antes de realizar seu primeiro acesso.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/entrar')}
                  className="w-full py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all"
                >
                  Ir para Login
                </button>
              </div>
            </div>
          ) : (
            <>
              {errors.general && (
                <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1F3A5F] mb-1">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                  >
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
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                  >
                    Senha (mínimo 8 caracteres)
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

                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                  >
                    Confirmar senha
                  </label>
                  <input
                    id="passwordConfirm"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                      errors.passwordConfirm
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/15'
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
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
                <p className="text-sm text-[#64748B]">
                  Já tem uma conta?{' '}
                  <Link to="/entrar" className="font-bold text-[#2563EB] hover:underline">
                    Entrar
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
