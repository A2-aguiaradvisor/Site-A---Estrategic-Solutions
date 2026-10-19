import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  const { confirmVerification, requestVerification } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true

    async function handleVerify() {
      if (!token) {
        setStatus('error')
        setErrorMessage('Token de verificação não informado.')
        return
      }

      try {
        await confirmVerification(token)
        if (mounted) {
          setStatus('success')
        }
      } catch (err: any) {
        if (mounted) {
          setStatus('error')
          setErrorMessage(
            err?.data?.message || err?.message || 'Token de verificação inválido ou expirado.',
          )
        }
      }
    }

    handleVerify()

    return () => {
      mounted = false
    }
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail.trim()) return

    setIsResending(true)
    try {
      await requestVerification(resendEmail)
      toast({
        title: 'E-mail enviado!',
        description: 'Um novo link de verificação foi enviado para sua caixa postal.',
      })
      setResendEmail('')
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o e-mail. Verifique se o endereço está correto.',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <BrandWordmark />
        </div>
        <h2 className="text-2xl font-bold text-[#1F3A5F]">Verificação de E-mail</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-[#E2E8F0] sm:px-10 text-center">
          {status === 'verifying' && (
            <div className="py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#1F3A5F]">
                Validando seu e-mail junto à plataforma...
              </p>
              <p className="text-xs text-slate-500">Aguarde alguns instantes.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F3A5F]">E-mail confirmado com sucesso!</h3>
              <p className="text-sm text-slate-600">
                Sua conta está ativa e pronta para uso. Você já pode acessar a plataforma executiva
                da A² Strategic Solutions.
              </p>
              <div className="pt-4">
                <Link
                  to="/entrar"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-[#1F3A5F] hover:bg-[#17304F] text-white font-semibold text-sm shadow-btn-primary transition-all"
                >
                  Entrar na minha conta
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 py-2">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1F3A5F]">Falha na verificação</h3>
              <p className="text-sm text-slate-600">
                {errorMessage || 'O link de confirmação expirou ou não é válido.'}
              </p>

              <div className="pt-4 border-t border-slate-100 text-left">
                <p className="text-xs font-semibold text-[#1F3A5F] mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  Solicitar novo link de verificação:
                </p>
                <form onSubmit={handleResend} className="space-y-2">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Seu e-mail cadastrado"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full py-2.5 px-3 bg-[#2563EB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {isResending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Reenviar confirmação
                  </button>
                </form>
              </div>

              <div className="pt-4">
                <Link
                  to="/entrar"
                  className="text-xs font-semibold text-slate-500 hover:text-[#1F3A5F] underline"
                >
                  Voltar para tela de login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
