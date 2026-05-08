import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/Auth/login", {
        cpf,
        senha,
      });

      const token = response.data.token;
      login(token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("CPF ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 px-6">
      {/* LOGO AREA */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-16 h-16 bg-[#003399] rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200">
          <span className="text-white font-black text-xl">FE</span>
        </div>
        <h1 className="text-2xl font-black text-[#003399] tracking-tighter">
          FORD<span className="font-light text-slate-400">ENTER</span>
        </h1>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 w-full max-w-sm flex flex-col gap-5 border border-white"
      >
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-slate-800">Bem-vindo de volta</h2>
          <p className="text-sm text-slate-400">Acesse sua conta Ford Enter</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:border-[#003399] focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:border-[#003399] focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#003399] hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
        >
          {loading ? "Autenticando..." : "Entrar"}
        </button>

        <p className="text-sm text-center text-slate-500 mt-2">
          Ainda não tem conta?{" "}
          <span
            className="text-[#003399] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Abra a sua agora
          </span>
        </p>
      </form>
    </div>
  );
}