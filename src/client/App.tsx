import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Movimentacoes from "./pages/Movimentacoes";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/Home";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <HashRouter>
            <DashboardLayout>
              <main className="w-full min-h-screen flex flex-col">
                <div className="w-full flex-1 flex">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/movimentacoes" element={<Movimentacoes />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                    {/* Rota fallback 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </DashboardLayout>
          </HashRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
