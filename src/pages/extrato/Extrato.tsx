import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { api } from "../../services/api";

interface Transacao {
  id: number;
  tipo: number; // 1: Deposito, 2: Saque, 3: Transferencia
  valor: number;
  data: string;
  contaId: number;
  contaDestinoId?: number;
}

function Extrato() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [minhaContaId, setMinhaContaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarExtrato() {
      try {
        const clienteId = getUserIdFromToken();
        if (!clienteId) return;

        const contaRes = await api.get(`/Contas/cliente/${clienteId}`);
        const conta = Array.isArray(contaRes.data) ? contaRes.data[0] : contaRes.data;

        if (conta) {
          setMinhaContaId(conta.id);
          const response = await api.get(`/Transacoes/conta/${conta.id}`);
          setTransacoes(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar extrato:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarExtrato();
  }, []);

  function getTransacaoDetails(t: Transacao) {
    switch (t.tipo) {
      case 1:
        return { label: "Depósito Recebido", color: "text-emerald-600", bg: "bg-emerald-50", icon: "arrow-down", sign: "+" };
      case 2:
        return { label: "Saque Realizado", color: "text-rose-600", bg: "bg-rose-50", icon: "arrow-up", sign: "-" };
      case 3:
        const euRecebi = t.contaDestinoId === minhaContaId;
        return {
          label: euRecebi ? "Transferência Recebida" : "Transferência Enviada",
          color: euRecebi ? "text-emerald-600" : "text-[#003399]",
          bg: euRecebi ? "bg-emerald-50" : "bg-blue-50",
          icon: euRecebi ? "arrow-down" : "arrow-right",
          sign: euRecebi ? "+" : "-",
        };
      default:
        return { label: "Transação", color: "text-slate-600", bg: "bg-slate-50", icon: "dots", sign: "" };
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 mb-8 text-slate-400 hover:text-[#003399] transition-colors font-semibold text-sm cursor-pointer"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
          Voltar ao início
        </button>

        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Atividades</h1>
            <p className="text-slate-500 font-medium">Seu histórico financeiro recente.</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Conta ativa</p>
            <p className="text-sm font-bold text-[#003399]">#{minhaContaId}</p>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-4 border-slate-100 border-t-[#003399] rounded-full animate-spin"></div>
               <p className="text-slate-400 font-medium text-sm">Organizando suas finanças...</p>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-4xl mb-4 block">📔</span>
              <p className="text-slate-400 font-medium">Você ainda não possui movimentações.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-50">
              {[...transacoes]
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((t) => {
                  const details = getTransacaoDetails(t);
                  return (
                    <div key={t.id} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Círculo do Ícone */}
                        <div className={`w-12 h-12 ${details.bg} ${details.color} rounded-2xl flex items-center justify-center text-xl`}>
                           {details.icon === "arrow-down" && "↓"}
                           {details.icon === "arrow-up" && "↑"}
                           {details.icon === "arrow-right" && "→"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{details.label}</p>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">
                            {new Date(t.data).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <p className={`font-black text-lg ${details.color}`}>
                        {details.sign} {t.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        
        <p className="mt-8 text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
          Fim do extrato • Ford Enter 2026
        </p>
      </div>
    </MainLayout>
  );
}

export default Extrato;