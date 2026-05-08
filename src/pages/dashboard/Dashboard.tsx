import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [contaId, setContaId] = useState<number | null>(null);
  const [temConta, setTemConta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [verSaldo, setVerSaldo] = useState(true); // Estética NuBank

  const navigate = useNavigate();

  const carregarDados = useCallback(async () => {
    try {
      const clienteId = getUserIdFromToken();
      if (!clienteId) {
        navigate("/");
        return;
      }
      const clienteRes = await api.get(`/Clientes/${clienteId}`);
      setNome(clienteRes.data.nome);

      try {
        const contaRes = await api.get(`/Contas/cliente/${clienteId}`);
        const conta = Array.isArray(contaRes.data) ? contaRes.data[0] : contaRes.data;
        if (conta) {
          setSaldo(conta.saldo);
          setContaId(conta.id);
          setTemConta(true);
        } else {
          setTemConta(false);
        }
      } catch (err) {
        setTemConta(false);
      }
    } catch (error) {
      console.error("Erro ao carregar Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function criarConta() {
    try {
      setBtnLoading(true);
      const clienteId = getUserIdFromToken();
      if (!clienteId) return;
      await api.post("/Contas", { clienteId: Number(clienteId) });
      alert("Conta criada com sucesso!");
      await carregarDados(); 
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setBtnLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-[#003399] rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Ford Enter está carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <p className="text-slate-500 font-medium">Olá,</p>
        <h2 className="text-3xl font-bold text-slate-800">{nome} 👋</h2>
      </header>

      {!temConta ? (
        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-blue-50 text-center">
          <div className="w-20 h-20 bg-blue-50 text-[#003399] rounded-full flex items-center justify-center mx-auto mb-6">
             <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Pronto para começar?</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">Sua conta digital Ford Enter é gratuita e fica pronta em segundos.</p>
          <button
            onClick={criarConta}
            disabled={btnLoading}
            className="w-full bg-[#003399] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {btnLoading ? "Criando..." : "Quero minha conta agora"}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* CARD DE SALDO */}
          <div className="bg-[#003399] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-blue-100/80 font-medium uppercase tracking-widest text-xs">Saldo disponível</p>
                <button onClick={() => setVerSaldo(!verSaldo)} className="p-2 hover:bg-white/10 rounded-full transition">
                   {verSaldo ? "👁️" : "🙈"}
                </button>
              </div>
              
              <h3 className="text-4xl font-black mb-6">
                {verSaldo ? `R$ ${saldo?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "••••"}
              </h3>

              <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10">
                <span className="text-xs font-bold uppercase text-blue-100">Conta Nº #{contaId}</span>
              </div>
            </div>
            {/* Detalhe no fundo do card */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
            
          {/* MENU DE AÇÕES RÁPIDAS */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Depositar", icon: "➕", path: "/deposito", color: "bg-emerald-50 text-emerald-600" },
              { label: "Transferir", icon: "💸", path: "/transferencia", color: "bg-blue-50 text-blue-600" },
              { label: "Sacar", icon: "💵", path: "/saque", color: "bg-rose-50 text-rose-600" },
              { label: "Extrato", icon: "📄", path: "/extrato", color: "bg-slate-100 text-slate-600" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Dashboard;