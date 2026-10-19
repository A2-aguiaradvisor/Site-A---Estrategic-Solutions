import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { User, Mail, Shield, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'
import { getInitials } from '@/lib/formatters'

export default function Conta() {
  const { user, updateProfile, requestEmailChange, updatePassword } = useAuth()
  const { toast } = useToast()

  // Profile
  const [name, setName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Email change
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [requestingEmail, setRequestingEmail] = useState(false)
  const [emailRequestedMessage, setEmailRequestedMessage] = useState(false)

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Inline errors
  const [profileError, setProfileError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setProfileError('Nome não pode ficar em branco.')
      return
    }
    setSavingProfile(true)
    setProfileError(null)
    try {
      await updateProfile({ name: name.trim() })
      toast({
        title: 'Dados atualizados!',
        description: 'Seu nome foi atualizado com sucesso.',
      })
    } catch (err: any) {
      setProfileError(err?.message || 'Falha ao atualizar dados pessoais.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError('Informe um e-mail válido.')
      return
    }
    if (newEmail.trim() === user?.email) {
      setEmailError('O novo e-mail deve ser diferente do e-mail atual.')
      return
    }

    setRequestingEmail(true)
    setEmailError(null)

    try {
      await requestEmailChange(newEmail)
      setEmailRequestedMessage(true)
      setShowEmailForm(false)
      toast({
        title: 'Confirmação enviada!',
        description: 'Enviamos um link de confirmação para o novo e-mail.',
      })
    } catch (err: any) {
      setEmailError(err?.data?.message || err?.message || 'Falha ao solicitar alteração de e-mail.')
    } finally {
      setRequestingEmail(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword) {
      setPasswordError('Informe a senha atual.')
      return
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('A nova senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não conferem.')
      return
    }

    setSavingPassword(true)
    setPasswordError(null)

    try {
      await updatePassword(oldPassword, newPassword, confirmPassword)
      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      })
      setShowPasswordForm(false)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordError(err?.data?.message || err?.message || 'Senha atual incorreta ou inválida.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E2E8F0]">
        <div className="w-16 h-16 rounded-full bg-[#1F3A5F] text-[#E1A63E] flex items-center justify-center font-bold text-xl shadow-card-rest">
          {getInitials(user?.name, user?.email)}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F3A5F]">Minha Conta</h1>
          <p className="text-sm text-[#64748B]">
            Gerencie seus dados pessoais, credenciais de acesso e segurança
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Personal Data */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-card-rest">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#1F3A5F]">Dados Pessoais</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            {profileError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#1F3A5F] mb-1.5"
              >
                Nome completo
              </label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={savingProfile}
                className="py-2.5 px-5 bg-[#1F3A5F] hover:bg-[#17304F] text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar alterações
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Email */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-card-rest">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#1F3A5F]">E-mail de Acesso</h2>
          </div>

          {emailRequestedMessage && (
            <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Enviamos um link de confirmação para o novo e-mail.</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Acesse sua nova caixa postal para confirmar e concluir a troca.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-5">
            <div>
              <span className="text-xs text-[#64748B] block font-medium">E-mail atual</span>
              <span className="text-sm font-bold text-[#1F3A5F]">{user?.email}</span>
            </div>
            {!showEmailForm && (
              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(true)
                  setEmailError(null)
                }}
                className="py-2 px-4 border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-xs font-semibold rounded-lg transition-colors w-fit"
              >
                Alterar e-mail
              </button>
            )}
          </div>

          {showEmailForm && (
            <form
              onSubmit={handleRequestEmailChange}
              className="space-y-4 max-w-lg p-4 rounded-xl border border-blue-100 bg-blue-50/30"
            >
              <p className="text-xs text-[#64748B]">
                Um link de confirmação será enviado para o endereço informado.
              </p>

              {emailError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="newEmail"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Novo e-mail
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo@email.com.br"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={requestingEmail}
                  className="py-2 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {requestingEmail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Enviar confirmação
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="py-2 px-3 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 3: Security / Password */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-card-rest">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#1F3A5F]">Segurança da Conta</h2>
          </div>

          {!showPasswordForm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F3A5F]">Senha de acesso</p>
                <p className="text-xs text-[#64748B]">
                  Recomendamos atualizar sua senha periodicamente.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(true)
                  setPasswordError(null)
                }}
                className="py-2 px-4 border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 text-xs font-semibold rounded-lg transition-colors"
              >
                Alterar senha
              </button>
            </div>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Senha atual
                </label>
                <input
                  id="oldPassword"
                  type={showPass ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Nova senha (mínimo 8 caracteres)
                </label>
                <input
                  id="newPassword"
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#1F3A5F] mb-1"
                >
                  Confirmar nova senha
                </label>
                <input
                  id="confirmPassword"
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#2563EB] text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPass ? 'Ocultar senhas' : 'Exibir senhas'}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="py-2.5 px-5 bg-[#1F3A5F] hover:bg-[#17304F] text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar nova senha
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="py-2.5 px-4 text-slate-600 hover:text-slate-800 text-sm font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
