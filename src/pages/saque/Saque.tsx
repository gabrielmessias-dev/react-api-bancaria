import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { api } from "../../services/api";
import { getUserIdFromToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";

export default function Saque() {
  const [valor, setValor] = useState("");
  const navigate = useNavigate();

  async function handleSaque(e: any) {
    e.preventDefault();

    try {
      const clienteId = getUserIdFromToken();

      const contaRes = await api.get(
        `/api/Contas/cliente/${clienteId}`
      );

      const conta = Array.isArray(contaRes.data)
        ? contaRes.data[0]
        : contaRes.data;

      await api.post("/api/Transacoes/saque", {
        valor: Number(valor),
        contaId: conta.id,
      });

      alert("Saque realizado com sucesso!");
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Erro ao realizar saque");
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

      <h1 className="text-2xl font-bold">Saque</h1>

      <form
        onSubmit={handleSaque}
        className="mt-6 flex flex-col gap-4 max-w-md"
      >
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded cursor-pointer transition">
          Sacar
        </button>
      </form>
    </MainLayout>
  );
}