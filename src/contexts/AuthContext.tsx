import React, { createContext, useContext, useEffect, useState } from 'react'
import type { AuthRecord } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: AuthRecord | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  requestPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (token: string, password: string, passwordConfirm: string) => Promise<void>
  requestVerification: (email: string) => Promise<void>
  confirmVerification: (token: string) => Promise<void>
  requestEmailChange: (newEmail: string) => Promise<void>
  confirmEmailChange: (token: string, password: string) => Promise<void>
  updateProfile: (data: { name?: string }) => Promise<void>
  updatePassword: (oldPassword: string, password: string, passwordConfirm: string) => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthRecord | null>(pb.authStore.record)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Initial sync
    setUser(pb.authStore.record)
    setIsLoading(false)

    // Listen to auth store state changes
    const unsub = pb.authStore.onChange((_token, model) => {
      setUser(model)
    })

    return () => {
      unsub()
    }
  }, [])

  const refreshAuth = async () => {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh()
        setUser(pb.authStore.record)
      }
    } catch {
      pb.authStore.clear()
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    await pb.collection('users').authWithPassword(email.trim(), password)
    setUser(pb.authStore.record)
  }

  const signUp = async (email: string, password: string, name: string) => {
    await pb.collection('users').create({
      email: email.trim(),
      password,
      passwordConfirm: password,
      name: name.trim(),
    })
    // Request verification email
    try {
      await pb.collection('users').requestVerification(email.trim())
    } catch (e) {
      console.warn('Falha ao disparar e-mail de verificação automático:', e)
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
  }

  const requestPasswordReset = async (email: string) => {
    await pb.collection('users').requestPasswordReset(email.trim())
  }

  const confirmPasswordReset = async (token: string, password: string, passwordConfirm: string) => {
    await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm)
  }

  const requestVerification = async (email: string) => {
    await pb.collection('users').requestVerification(email.trim())
  }

  const confirmVerification = async (token: string) => {
    await pb.collection('users').confirmVerification(token)
    if (pb.authStore.isValid) {
      await refreshAuth()
    }
  }

  const requestEmailChange = async (newEmail: string) => {
    await pb.collection('users').requestEmailChange(newEmail.trim())
  }

  const confirmEmailChange = async (token: string, password: string) => {
    await pb.collection('users').confirmEmailChange(token, password)
    // User is logged out after confirming email change per spec
    signOut()
  }

  const updateProfile = async (data: { name?: string }) => {
    if (!pb.authStore.record) throw new Error('Não autenticado')
    const updated = await pb.collection('users').update(pb.authStore.record.id, data)
    setUser(updated)
  }

  const updatePassword = async (oldPassword: string, password: string, passwordConfirm: string) => {
    if (!pb.authStore.record) throw new Error('Não autenticado')
    await pb.collection('users').update(pb.authStore.record.id, {
      oldPassword,
      password,
      passwordConfirm,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && pb.authStore.isValid,
        isLoading,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        confirmPasswordReset,
        requestVerification,
        confirmVerification,
        requestEmailChange,
        confirmEmailChange,
        updateProfile,
        updatePassword,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
