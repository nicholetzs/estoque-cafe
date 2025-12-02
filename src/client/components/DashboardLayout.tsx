import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Produtos",
      href: "/produtos",
      icon: Package,
      badge: null,
    },
    {
      label: "Movimentações",
      href: "/movimentacoes",
      icon: ArrowLeftRight,
      badge: "3",
    },
    {
      label: "Relatórios",
      href: "/relatorios",
      icon: BarChart3,
      badge: null,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0D0907] to-[#1A0F0A]">
      {/* Sidebar Premium */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-[#2C1810] to-[#1A0F0A] border-r border-[#6F4E37]/30 transition-all duration-300 flex flex-col shadow-2xl relative`}
      >
        {/* Borda decorativa com gradiente */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#C4A57B]/0 via-[#C4A57B]/50 to-[#C4A57B]/0"></div>

        {/* Logo Premium */}
        <div className="p-6 border-b border-[#6F4E37]/30">
          <div
            className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6F4E37] rounded-xl flex items-center justify-center shadow-lg">
                <Coffee className="w-7 h-7 text-[#FFF8E7]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2C1810]"></div>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-[#E8DCC8] tracking-wide">
                  CoffeeStock
                </h1>
                <p className="text-xs text-[#8B6F47] font-medium">
                  Sistema de Controle
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items Premium */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={`w-full ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } h-12 px-4 group relative transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#6F4E37] to-[#8B6F47] text-[#FFF8E7] shadow-lg shadow-[#6F4E37]/30"
                    : "text-[#C4A57B] hover:bg-[#3D2415] hover:text-[#E8DCC8]"
                }`}
                onClick={() => navigate(item.href)}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C4A57B] to-[#8B6F47] rounded-r-full"></div>
                )}

                <div
                  className={`flex items-center ${sidebarOpen ? "gap-3" : "gap-0"} w-full`}
                >
                  <Icon
                    className={`w-5 h-5 ${!sidebarOpen && "mx-auto"} ${
                      active ? "scale-110" : "group-hover:scale-110"
                    } transition-transform`}
                  />

                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge className="bg-[#8B6F47] text-[#FFF8E7] border-none px-2 py-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Toggle Button Premium */}
        <div className="p-3 border-t border-[#6F4E37]/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full h-10 bg-[#3D2415] hover:bg-[#6F4E37] text-[#C4A57B] hover:text-[#FFF8E7] transition-all duration-200"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium">Recolher</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Premium */}
        <header className="bg-gradient-to-r from-[#2C1810] to-[#3D2415] border-b border-[#6F4E37]/30 px-8 py-5 shadow-xl">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  type="text"
                  placeholder="Buscar produtos, movimentações..."
                  className="pl-10 bg-[#1A0F0A] border-[#6F4E37]/30 text-[#E8DCC8] placeholder:text-[#8B6F47] focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]/50 h-10"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 ml-8">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#C4A57B] hover:text-[#E8DCC8] hover:bg-[#3D2415]"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#2C1810]"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-[#3D2415] group"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-[#E8DCC8] group-hover:text-[#FFF8E7]">
                        Admin
                      </p>
                      <p className="text-xs text-[#8B6F47]">admin@cafe.com</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6F4E37] rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-[#FFF8E7]" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#2C1810] border-[#6F4E37]/30 text-[#E8DCC8]"
                >
                  <DropdownMenuLabel className="text-[#C4A57B]">
                    Minha Conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#6F4E37]/30" />
                  <DropdownMenuItem className="focus:bg-[#3D2415] focus:text-[#E8DCC8] cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#6F4E37]/30" />
                  <DropdownMenuItem className="focus:bg-red-900/20 focus:text-red-400 cursor-pointer text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
