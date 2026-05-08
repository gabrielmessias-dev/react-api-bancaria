import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"; 

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/Clientes", {
        nome,
        cpf,
        senha,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/"); 
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data || "Erro ao cadastrar.");
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
        onSubmit={handleRegister}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 w-full max-w-sm flex flex-col gap-4 border border-white"
      >
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-slate-800">Crie sua conta</h2>
          <p className="text-sm text-slate-400">Simples, rápido e 100% digital</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:border-[#003399] focus:bg-white outline-none transition-all text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:border-[#003399] focus:bg-white outline-none transition-all text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
            <input
              type="password"
              placeholder="Crie uma senha forte"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:border-[#003399] focus:bg-white outline-none transition-all text-slate-700"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#003399] hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
        >
          {loading ? "Cadastrando..." : "Confirmar Cadastro"}
        </button>

        <p className="text-sm text-center text-slate-500 mt-2">
          Já faz parte do Ford Enter?{" "}
          <span
            className="text-[#003399] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Fazer Login
          </span>
        </p>
      </form>
    </div>
  );
}