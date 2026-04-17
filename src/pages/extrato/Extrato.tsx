import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../utils/decodeToken";

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
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function carregarExtrato() {
      try {
        const clienteId = getUserIdFromToken();

        if (!clienteId) {
          console.error("ClienteId não encontrado no token");
          return;
        }

        const contaRes = await axios.get(
          `http://localhost:5104/api/Contas/cliente/${clienteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const conta = Array.isArray(contaRes.data)
          ? contaRes.data[0]
          : contaRes.data;

        if (!conta) return;

        const response = await axios.get(
          `http://localhost:5104/api/Transacoes/conta/${conta.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar extrato", error);
      }
    }

    carregarExtrato();
  }, []); // 🔥 IMPORTANTE: array vazio

  function getTipoLabel(tipo: number) {
    switch (tipo) {
      case 0:
        return "Depósito recebido";
      case 1:
        return "Saque realizado";
      case 2:
        return "Transferência";
      default:
        return "Transação";
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Extrato da Conta
        </h2>

        {transacoes.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {transacoes.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">
                    {getTipoLabel(t.tipo)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(t.data).toLocaleString("pt-BR")}
                  </p>
                </div>

                <p
                  className={`font-bold ${
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

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
        >
          Voltar ao menu
        </button>
      </div>
    </MainLayout>
  );
}

export default Extrato;