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
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Banco Digital
        </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer transition"
      >
        Sair
      </button>
      </header>

      {/* CONTEÚDO */}
      <main className="p-6">{children}</main>
    </div>
  );
}

export default MainLayout;