import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [temConta, setTemConta] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        const clienteId = getUserIdFromToken();
        if (!clienteId) return;

        const clienteRes = await api.get(`/api/Clientes/${clienteId}`);
        setNome(clienteRes.data.nome);

        try {
          const contaRes = await api.get(
            `/api/Contas/cliente/${clienteId}`
          );

          const conta = Array.isArray(contaRes.data)
            ? contaRes.data[0]
            : contaRes.data;

          if (conta) {
            setSaldo(conta.saldo);
            setTemConta(true);
          }
        } catch {
          setTemConta(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  async function criarConta() {
    try {
      const clienteId = getUserIdFromToken();

      await api.post("/api/Contas", {
        clienteId,
      });

      alert("Conta criada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar conta");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <p>Carregando...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-4 text-lg">Olá, {nome} 👋</p>

      {!temConta ? (
        <div className="mt-6">
          <p>Você ainda não possui conta.</p>

          <button
            onClick={criarConta}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
          >
            Criar Conta
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-xl">
            Saldo:
            <span className="font-bold text-green-600 ml-2">
              R$ {saldo}
            </span>
          </p>

          {/* BOTÕES DE AÇÃO */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/deposito")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer transition"
            >
              Depósito
            </button>

            <button
              onClick={() => navigate("/transferencia")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
            >
              Transferência
            </button>

            <button
              onClick={() => navigate("/saque")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer transition"
            >
              Saque
            </button>

            <button
              onClick={() => navigate("/extrato")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
            >
              Ver Extrato
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Dashboard;