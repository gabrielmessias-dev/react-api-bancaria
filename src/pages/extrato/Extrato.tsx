import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { api } from "../../services/api";

interface Transacao {
  id: number;
  tipo: number;
  valor: number;
  data: string;
  contaId: number;
  contaDestinoId?: number;
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

        const conta = Array.isArray(contaRes.data)
          ? contaRes.data[0]
          : contaRes.data;

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

  function getTipoLabel(tipo: number) {
    switch (tipo) {
      case 0: return "Depósito";
      case 1: return "Saque";
      case 2: return "Transferência";
      default: return "Transação";
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-6">
        {/* Botão de Voltar Padronizado */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all cursor-pointer font-medium border border-gray-300"
        >
          <span>←</span> Voltar ao Menu
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Extrato da Conta</h2>

          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Buscando transações...</p>
          ) : transacoes.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Nenhuma transação encontrada.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {transacoes.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {getTipoLabel(t.tipo)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.data).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <p
                    className={`font-bold text-lg ${
                      t.tipo === 0
                        ? "text-green-600"
                        : t.tipo === 1
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {t.tipo === 0 ? "+" : "-"}
                    {t.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Extrato;