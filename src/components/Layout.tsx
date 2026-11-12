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
  LayoutGrid,
  BarChart3,
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

interface NavLeaf {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  requiresAuth?: boolean
}

interface NavGroup {
  label: string
  items: NavLeaf[]
}

/** Grupos da navegação hierárquica (desktop dropdown + mobile drawer). */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Soluções',
    items: [
      {
        label: 'Catálogo de Soluções',
        path: '/catalogo',
        icon: LayoutGrid,
        description: 'Todos os programas e produtos digitais',
      },
      {
        label: 'Dashboard ABC de Receita',
        path: '/dashboard',
        icon: BarChart3,
        description: 'Demonstração interativa de inteligência de dados',
      },
      {
        label: 'Carrinho de Compras',
        path: '/carrinho',
        icon: ShoppingBag,
        description: 'Revise os itens selecionados',
      },
    ],
  },
  {
    label: 'Minha Área',
    items: [
      {
        label: 'Meus Pedidos',
        path: '/meus-pedidos',
        icon: Package,
        description: 'Histórico e status das contratações',
        requiresAuth: true,
      },
      {
        label: 'Minha Conta',
        path: '/minha-conta',
        icon: UserIcon,
        description: 'Dados, senha e segurança',
        requiresAuth: true,
      },
    ],
  },
]

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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileMenuOpen])

  // Close drawer with Escape
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.requiresAuth || isAuthenticated),
  })).filter((group) => group.items.length > 0)

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => location.pathname === item.path)

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

            {/* Desktop Navigation: hierarchic dropdowns */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `relative text-sm font-semibold transition-colors py-1 hover:text-[#2563EB] ${
                    isActive ? 'text-[#2563EB]' : 'text-[#1F3A5F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Início
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full animate-fade-in" />
                    )}
                  </>
                )}
              </NavLink>

              {visibleGroups.map((group) => (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-expanded={false}
                      aria-label={`Menu ${group.label}`}
                      className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 hover:text-[#2563EB] focus:outline-none ${
                        isGroupActive(group) ? 'text-[#2563EB]' : 'text-[#1F3A5F]'
                      }`}
                    >
                      {group.label}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={14}
                    className="w-72 p-1.5 rounded-xl shadow-modal border-[#E2E8F0]"
                  >
                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {group.label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`cursor-pointer gap-3 px-3 py-2.5 rounded-lg ${
                            isActive
                              ? 'bg-blue-50 text-[#2563EB]'
                              : 'text-[#1F3A5F] hover:bg-blue-50 hover:text-[#2563EB]'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#1F3A5F]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-tight">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                                {item.description}
                              </span>
                            )}
                          </span>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>

            {/* Right Actions: Cart & User */}
            <div className="flex items-center gap-3 sm:gap-4">
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
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Abrir menu"
                  aria-expanded={mobileMenuOpen}
                  className="p-2 text-[#1F3A5F] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (right slide-over, organized in sections) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-[#030C1E]/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute right-0 top-0 bottom-0 w-[86%] max-w-sm bg-white shadow-modal flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-5 h-20 border-b border-[#E2E8F0]">
              <BrandWordmark />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2 text-[#1F3A5F] hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
              <section>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Navegação
                </p>
                <div className="flex flex-col gap-1">
                  <MobileNavLink to="/" label="Início" />
                  {NAV_GROUPS[0].items.map((item) => (
                    <MobileNavLink
                      key={item.path}
                      to={item.path}
                      label={item.label}
                      icon={<item.icon className="w-5 h-5 text-[#2563EB]" />}
                      badge={item.path === '/carrinho' && itemCount > 0 ? itemCount : undefined}
                    />
                  ))}
                </div>
              </section>

              {isAuthenticated && user ? (
                <section>
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 border-t border-slate-100 pt-5">
                    Sua Conta
                  </p>
                  <div className="flex flex-col gap-1">
                    {NAV_GROUPS[1].items.map((item) => (
                      <MobileNavLink
                        key={item.path}
                        to={item.path}
                        label={item.label}
                        icon={<item.icon className="w-5 h-5 text-[#2563EB]" />}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center gap-3 w-full text-left px-3 py-3 text-base font-semibold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                </section>
              ) : (
                <section className="border-t border-slate-100 pt-5 flex flex-col gap-2">
                  <Link
                    to="/entrar"
                    className="w-full text-center py-3 border border-[#2563EB] text-[#1F3A5F] font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/criar-conta"
                    className="w-full text-center py-3 bg-[#1F3A5F] text-white font-semibold rounded-xl shadow-sm hover:bg-[#17304F] transition-colors"
                  >
                    Criar conta
                  </Link>
                </section>
              )}
            </div>

            <div className="px-5 py-4 border-t border-[#E2E8F0] bg-slate-50">
              <a
                href="mailto:aguiaradvisor@gmail.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F3A5F] hover:text-[#2563EB] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E1A63E]" />
                aguiaradvisor@gmail.com
              </a>
            </div>
          </aside>
        </div>
      )}

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
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1A63E]" />
                    Início
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalogo"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1A63E]" />
                    Catálogo de Soluções
                  </Link>
                </li>
                <li>
                  <Link
                    to="/produtos"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1A63E]" />
                    Produtos (Dashboard de Receita)
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
                href="mailto:aguiaradvisor@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[#E1A63E] hover:text-yellow-300 font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" />
                aguiaradvisor@gmail.com
              </a>
              <div className="mt-4 p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Horário executivo:</span> Seg. a Sex.
                das 9h às 18h (Brasília).
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} A² Strategic Solutions. Todos os direitos reservados.
            </p>
            <p className="text-slate-400">
              Plataforma Executiva v1.0 • Ecossistema Digital de Alta Performance
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/** Item de link do drawer mobile, com destaque de rota ativa. */
function MobileNavLink({
  to,
  label,
  icon,
  badge,
}: {
  to: string
  label: string
  icon?: React.ReactNode
  badge?: number
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 text-base font-semibold rounded-xl transition-colors ${
          isActive ? 'bg-blue-50 text-[#2563EB]' : 'text-[#1F3A5F] hover:bg-slate-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {icon ?? (
            <ArrowRight className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#E1A63E]'}`} />
          )}
          <span className="flex-1">{label}</span>
          {typeof badge === 'number' && (
            <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold text-white bg-[#DC2626] rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
