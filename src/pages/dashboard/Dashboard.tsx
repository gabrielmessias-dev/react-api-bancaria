import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [temConta, setTemConta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false); // Feedback para o botão

  const navigate = useNavigate();

  // 1. Isolamos a lógica de carregar dados para poder chamá-la em vários lugares
  const carregarDados = useCallback(async () => {
    try {
      const clienteId = getUserIdFromToken();
      if (!clienteId) {
        navigate("/"); // Só redireciona se realmente não houver token
        return;
      }

      // Busca dados do Cliente
      const clienteRes = await api.get(`/Clientes/${clienteId}`);
      setNome(clienteRes.data.nome);

      // Busca dados da Conta
      try {
        const contaRes = await api.get(`/Contas/cliente/${clienteId}`);
        const conta = Array.isArray(contaRes.data) ? contaRes.data[0] : contaRes.data;

        if (conta) {
          setSaldo(conta.saldo);
          setTemConta(true);
        } else {
          setTemConta(false);
        }
      } catch (err) {
        setTemConta(false); // Caso o 404 da conta seja tratado como erro
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

  // 2. Função de criar conta atualizada
  async function criarConta() {
    try {
      setBtnLoading(true);
      const clienteId = getUserIdFromToken();
      if (!clienteId) return;

      await api.post("/Contas", {
        clienteId: Number(clienteId),
      });

      alert("Conta criada com sucesso!");

      // ✅ A MÁGICA: Em vez de reload, apenas chamamos a função novamente
      // Isso atualiza o saldo e o estado 'temConta' sem recarregar a página
      await carregarDados(); 
      
    } catch (error) {
      console.error(error);
      alert("Erro ao criar conta");
    } finally {
      setBtnLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <p className="p-10 text-center animate-pulse">Sincronizando com o banco...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Olá, <span className="font-semibold text-blue-600">{nome}</span> 👋</p>

      {!temConta ? (
        <div className="mt-6 p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl text-center">
          <p className="text-blue-800 font-medium">Você está quase lá! Abra sua conta para começar.</p>
          <button
            onClick={criarConta}
            disabled={btnLoading}
            className={`mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg transition shadow-lg ${
              btnLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {btnLoading ? "Processando..." : "Abrir Minha Conta"}
          </button>
        </div>
      ) : (
        <div className="mt-6">
            {/* O restante do seu código de Saldo e Botões (Saque, Deposito, etc) permanece igual */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 font-semibold uppercase">Saldo em Conta</p>
                <p className="text-3xl font-bold text-gray-800">R$ {saldo?.toFixed(2)}</p>
            </div>
            
            {/* botões de navegação ... */}
            <div className="mt-6 flex flex-wrap gap-4">
                 <button onClick={() => navigate("/deposito")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Depósito</button>
                 <button onClick={() => navigate("/transferencia")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Transferência</button>
                 <button onClick={() => navigate("/saque")} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Saque</button>
                 <button onClick={() => navigate("/extrato")} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Extrato</button>
            </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Dashboard;