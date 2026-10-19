import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import Layout from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Public & Catalog Pages
import Index from '@/pages/Index'
import Catalogo from '@/pages/Catalogo'
import AbcRevenueDashboardPage from '@/pages/AbcRevenueDashboardPage'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'

// Protected Pages
import Checkout from '@/pages/Checkout'
import MeusPedidos from '@/pages/MeusPedidos'
import OrderDetail from '@/pages/OrderDetail'
import Conta from '@/pages/Conta'

// Auth Pages (Public centered layout)
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import VerifyEmail from '@/pages/VerifyEmail'
import ConfirmEmailChange from '@/pages/ConfirmEmailChange'

import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Pages wrapped in the Global Navigation & Footer Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/produtos" element={<AbcRevenueDashboardPage />} />
              <Route path="/dashboard" element={<AbcRevenueDashboardPage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/carrinho" element={<Cart />} />

              {/* Protected Routes inside Layout */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meus-pedidos"
                element={
                  <ProtectedRoute>
                    <MeusPedidos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pedido/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/minha-conta"
                element={
                  <ProtectedRoute>
                    <Conta />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Standalone Auth Pages (Clean Centered Layout with Wordmark) */}
            <Route path="/entrar" element={<Login />} />
            <Route path="/criar-conta" element={<Signup />} />
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/verificar-email" element={<VerifyEmail />} />
            <Route path="/confirmar-alteracao-email" element={<ConfirmEmailChange />} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
