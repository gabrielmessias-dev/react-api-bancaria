import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

export default function Transferencia() {
  const [contaDestinoId, setContaDestinoId] = useState("");
  const [valor, setValor] = useState("");
  const navigate = useNavigate();

  async function handleTransferencia(e: any) {
    e.preventDefault();

    try {
      const clienteId = getUserIdFromToken();

      // conta do usuário logado
      const contaRes = await api.get(
        `/api/Contas/cliente/${clienteId}`
      );

      const conta = Array.isArray(contaRes.data)
        ? contaRes.data[0]
        : contaRes.data;

      await api.post("/api/Transacoes/transferencia", {
        valor: Number(valor),
        contaId: conta.id,
        contaDestinoId: Number(contaDestinoId),
      });

      alert("Transferência realizada com sucesso!");
      navigate("/dashboard")

      setContaDestinoId("");
      setValor("");
    } catch (error) {
      console.error(error);
      alert("Erro na transferência");
    }
  }

  return (
    <MainLayout>
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 text-blue-600 hover:underline cursor-pointer"
      >
        ← Voltar ao menu
      </button>
      <h1 className="text-2xl font-bold">Transferência</h1>

      <form
        onSubmit={handleTransferencia}
        className="mt-6 flex flex-col gap-4 max-w-md"
      >
        <input
          type="number"
          placeholder="ID da conta destino"
          value={contaDestinoId}
          onChange={(e) => setContaDestinoId(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer transition">
          Transferir
        </button>
      </form>
    </MainLayout>
  );
}