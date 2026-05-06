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
}

function Extrato() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarExtrato() {
      try {
        const clienteId = getUserIdFromToken();
        if (!clienteId) return;

        const contaRes = await api.get(`/Contas/cliente/${clienteId}`);
        const conta = Array.isArray(contaRes.data) ? contaRes.data[0] : contaRes.data;

        if (!conta) return;

        const response = await api.get(`/Transacoes/conta/${conta.id}`);
        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar extrato", error);
      } finally {
        setLoading(false);
      }
    }
    carregarExtrato();
  }, []);

  // Ajustado para bater com o Enum do Backend (1, 2, 3)
  function getTipoInfo(tipo: number) {
    switch (tipo) {
      case 1: // Depósito
        return { label: "Depósito Recebido", color: "text-blue-600", sign: "+" };
      case 2: // Saque
        return { label: "Saque Realizado", color: "text-red-600", sign: "-" };
      case 3: // Transferência
        return { label: "Transferência", color: "text-red-600", sign: "-" };
      default:
        return { label: "Transação", color: "text-gray-600", sign: "" };
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-6">
        {/* BOTÃO VOLTAR ESTILIZADO */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all cursor-pointer font-medium border border-gray-300 shadow-sm"
        >
          <span>←</span> Voltar ao Menu
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
            Extrato da Conta
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500 animate-pulse">Carregando transações...</p>
          ) : transacoes.length === 0 ? (
            <p className="text-center py-10 text-gray-500">Nenhuma movimentação encontrada.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {transacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map((t) => {
                const info = getTipoInfo(t.tipo);
                return (
                  <div key={t.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-700">{info.label}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(t.data).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <p className={`font-bold text-lg ${info.color}`}>
                      {info.sign} {t.valor.toLocaleString("pt-BR", {
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
      </div>
    </MainLayout>
  );
}

export default Extrato;