import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

export default function Transferencia() {
  const [contaDestinoId, setContaDestinoId] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleTransferencia(e: React.FormEvent) {
    e.preventDefault();
    if (!valor || Number(valor) <= 0 || !contaDestinoId) {
        return alert("Preencha todos os campos corretamente.");
    }

    setLoading(true);
    try {
      const clienteId = getUserIdFromToken();

      const contaRes = await api.get(`/Contas/cliente/${clienteId}`);

      const conta = Array.isArray(contaRes.data)
        ? contaRes.data[0]
        : contaRes.data;

      await api.post("/Transacoes/transferencia", {
        valor: Number(valor),
        contaId: conta.id,
        contaDestinoId: Number(contaDestinoId),
      });

      alert("Transferência realizada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.mensagem || "Erro ao realizar transferência";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      {/* Botão de Voltar Padronizado */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all cursor-pointer font-medium border border-gray-300"
      >
        <span>←</span> Voltar ao Menu
      </button>

      <h1 className="text-2xl font-bold text-gray-800">Transferência</h1>
      <p className="text-gray-500 mb-6">Transfira valores para outras contas instantaneamente.</p>

      <form
        onSubmit={handleTransferencia}
        className="mt-6 flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <label className="text-sm font-semibold text-gray-600">ID da Conta Destino</label>
        <input
          type="number"
          placeholder="Ex: 123"
          value={contaDestinoId}
          onChange={(e) => setContaDestinoId(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <label className="text-sm font-semibold text-gray-600">Valor</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-400">R$</span>
          <input
            type="number"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <button 
          disabled={loading}
          className={`mt-2 py-3 rounded-lg font-bold text-white transition shadow-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Processando..." : "Confirmar Transferência"}
        </button>
      </form>
    </MainLayout>
  );
}