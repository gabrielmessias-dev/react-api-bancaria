import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo Banco Ford Enter */}
            <div className="w-8 h-8 bg-[#003399] rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xs">FE</span>
            </div>
            <h1 className="text-xl font-black text-[#003399] tracking-tighter">
              FORD<span className="font-light text-slate-400">ENTER</span>
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      {/* CONTEÚDO CENTRALIZADO */}
      <main className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;