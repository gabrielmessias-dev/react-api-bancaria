import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [contaId, setContaId] = useState<number | null>(null); // Armazena o ID da conta
  const [temConta, setTemConta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

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
          setContaId(conta.id); // Guarda o ID da conta
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

      await api.post("/Contas", {
        clienteId: Number(clienteId),
      });

      alert("Conta criada com sucesso!");
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
        <p className="p-10 text-center animate-pulse text-gray-500">Sincronizando com o banco...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-lg">Olá, <span className="font-semibold text-blue-600">{nome}</span> 👋</p>

      {!temConta ? (
        <div className="mt-6 p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl text-center">
          <p className="text-blue-800 font-medium">Sua jornada financeira começa aqui. Abra sua conta agora!</p>
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
        <div className="mt-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Saldo em Conta</p>
              <p className="text-3xl font-bold text-gray-800">
                R$ {saldo?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            {/* Badge do número da conta */}
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase">Nº da Conta</p>
              <p className="text-lg font-mono font-bold text-blue-700">#{contaId}</p>
            </div>
          </div>
            
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate("/deposito")} className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition font-bold shadow-md cursor-pointer">Depósito</button>
            <button onClick={() => navigate("/transferencia")} className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-md cursor-pointer">Transferência</button>
            <button onClick={() => navigate("/saque")} className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition font-bold shadow-md cursor-pointer">Saque</button>
            <button onClick={() => navigate("/extrato")} className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition font-bold shadow-md cursor-pointer">Extrato</button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default Dashboard;