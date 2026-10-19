import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  Package,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { BrandWordmark } from '@/components/BrandWordmark'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { getInitials } from '@/lib/formatters'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Layout() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { itemCount, hasJustChanged } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const navLinks = [
    { label: 'Catálogo', path: '/' },
    { label: 'Produtos', path: '/#produtos' },
    { label: 'Minha Conta', path: '/minha-conta', requiresAuth: true },
    { label: 'Meus Pedidos', path: '/meus-pedidos', requiresAuth: true },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB] selection:text-white">
      {/* Fixed Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-header-scroll border-b border-[#E2E8F0]'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Wordmark (Left) */}
            <div className="flex-shrink-0">
              <BrandWordmark />
            </div>

            {/* Desktop Navigation Menu (Center/Right) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isAuthenticated) return null
                const isActive = location.pathname === link.path && !location.hash
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`relative text-sm font-semibold transition-colors py-1 hover:text-[#2563EB] ${
                      isActive ? 'text-[#2563EB]' : 'text-[#1F3A5F]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full animate-fade-in" />
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Right Actions: Cart & User */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link
                to="/carrinho"
                aria-label={`Carrinho de compras com ${itemCount} itens`}
                className="relative p-2.5 text-[#1F3A5F] hover:text-[#2563EB] transition-colors rounded-lg hover:bg-slate-100"
              >
                <ShoppingBag className="w-6 h-6" />
                {itemCount > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#DC2626] rounded-full shadow-sm ${
                      hasJustChanged ? 'animate-pop' : ''
                    }`}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu / Auth Buttons */}
              <div className="hidden sm:flex items-center gap-3">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#E2E8F0] bg-white hover:bg-slate-50 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30">
                        <div className="w-8 h-8 rounded-full bg-[#1F3A5F] text-[#E1A63E] flex items-center justify-center font-bold text-xs shadow-sm">
                          {getInitials(user.name, user.email)}
                        </div>
                        <span className="text-xs font-semibold text-[#1F3A5F] max-w-[120px] truncate">
                          {user.name || user.email?.split('@')[0]}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 p-1 rounded-xl shadow-modal border-[#E2E8F0]"
                    >
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-xs font-semibold text-[#0F172A] truncate">
                          {user.name || 'Minha Conta'}
                        </p>
                        <p className="text-[11px] text-[#64748B] font-normal truncate">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={() => navigate('/meus-pedidos')}
                        className="cursor-pointer gap-2.5 px-3 py-2 text-sm text-[#1F3A5F] rounded-lg hover:bg-blue-50 hover:text-[#2563EB]"
                      >
                        <Package className="w-4 h-4" />
                        <span>Meus Pedidos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/minha-conta')}
                        className="cursor-pointer gap-2.5 px-3 py-2 text-sm text-[#1F3A5F] rounded-lg hover:bg-blue-50 hover:text-[#2563EB]"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Minha Conta</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer gap-2.5 px-3 py-2 text-sm text-[#DC2626] rounded-lg hover:bg-red-50 hover:text-[#DC2626]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/entrar"
                      className="px-4 py-2 text-sm font-semibold text-[#1F3A5F] hover:text-[#2563EB] transition-colors rounded-lg hover:bg-slate-100"
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/criar-conta"
                      className="px-4 py-2 text-sm font-semibold text-white bg-[#1F3A5F] hover:bg-[#17304F] transition-all rounded-lg shadow-sm hover:shadow active:scale-95"
                    >
                      Criar conta
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Abrir menu"
                  className="p-2 text-[#1F3A5F] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in-down">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-semibold text-[#1F3A5F] hover:bg-slate-50 rounded-lg"
              >
                Catálogo
              </NavLink>
              <NavLink
                to="/#produtos"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-semibold text-[#1F3A5F] hover:bg-slate-50 rounded-lg"
              >
                Produtos
              </NavLink>
              <NavLink
                to="/carrinho"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-base font-semibold text-[#1F3A5F] hover:bg-slate-50 rounded-lg"
              >
                <span>Carrinho</span>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#DC2626] rounded-full">
                    {itemCount}
                  </span>
                )}
              </NavLink>

              {isAuthenticated && user ? (
                <>
                  <div className="pt-2 pb-1 border-t border-slate-100">
                    <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sua Conta
                    </p>
                  </div>
                  <NavLink
                    to="/meus-pedidos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-base font-semibold text-[#1F3A5F] hover:bg-slate-50 rounded-lg"
                  >
                    <Package className="w-5 h-5 text-[#2563EB]" />
                    Meus Pedidos
                  </NavLink>
                  <NavLink
                    to="/minha-conta"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-base font-semibold text-[#1F3A5F] hover:bg-slate-50 rounded-lg"
                  >
                    <UserIcon className="w-5 h-5 text-[#2563EB]" />
                    Minha Conta
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-base font-semibold text-[#DC2626] hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair ({user.email})
                  </button>
                </>
              ) : (
                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/entrar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 border border-[#2563EB] text-[#1F3A5F] font-semibold rounded-lg hover:bg-blue-50"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/criar-conta"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-[#1F3A5F] text-white font-semibold rounded-lg shadow-sm hover:bg-[#17304F]"
                  >
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* 3-Column Footer */}
      <footer className="bg-[#0F172A] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1: Logo & description */}
            <div className="space-y-4">
              <BrandWordmark light />
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Soluções em consultoria e educação digital. Estruturação estratégica, financeira e
                governança executiva de alto impacto.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#E1A63E] font-medium pt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Ambiente seguro • Pagamento online simulado v1</span>
              </div>
            </div>

            {/* Column 2: Quick links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
                Navegação Rápida
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    Catálogo de Soluções
                  </Link>
                </li>
                <li>
                  <Link
                    to="/meus-pedidos"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    Meus Pedidos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/minha-conta"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    Minha Conta & Segurança
                  </Link>
                </li>
                <li>
                  <Link
                    to="/carrinho"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                    Carrinho de Compras
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
                Atendimento Executivo
              </h3>
              <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                Dúvidas sobre programas de mentoria institucional ou assessoria sob medida:
              </p>
              <a
                href="mailto:contato@aguiaradvisory.com.br"
                className="inline-flex items-center gap-2 text-sm text-[#2563EB] hover:text-blue-400 font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                contato@aguiaradvisory.com.br
              </a>
              <div className="mt-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Horário executivo:</span> Seg. a Sex.
                das 9h às 18h (Brasília).
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Aguiar Advisory. Todos os direitos reservados.</p>
            <p className="text-slate-400">Identidade provisória • Plataforma institucional v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
