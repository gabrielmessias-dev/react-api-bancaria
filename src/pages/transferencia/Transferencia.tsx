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
      const conta = Array.isArray(contaRes.data) ? contaRes.data[0] : contaRes.data;

      await api.post("/Transacoes/transferencia", {
        valor: Number(valor),
        contaId: conta.id,
        contaDestinoId: Number(contaDestinoId),
      });

      alert("Transferência realizada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "Erro ao realizar transferência";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 mb-8 text-slate-400 hover:text-[#003399] transition-colors font-semibold text-sm cursor-pointer"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
          Voltar ao início
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transferência</h1>
          <p className="text-slate-500 font-medium">Envie dinheiro para qualquer conta FE.</p>
        </header>

        <form
          onSubmit={handleTransferencia}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 flex flex-col gap-5"
        >
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">ID da Conta de Destino</label>
            <input
              type="number"
              placeholder="Ex: 123"
              value={contaDestinoId}
              onChange={(e) => setContaDestinoId(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 p-4 rounded-2xl font-bold text-slate-700 focus:border-[#003399] focus:bg-white outline-none transition-all placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">Valor para transferir</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-300">R$</span>
              <input
                type="number"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 p-5 pl-14 rounded-2xl text-2xl font-bold text-slate-700 focus:border-[#003399] focus:bg-white outline-none transition-all placeholder:text-slate-200"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-lg active:scale-[0.98] mt-2 ${
              loading ? "bg-slate-300 cursor-not-allowed" : "bg-[#003399] hover:bg-blue-800 shadow-blue-100 cursor-pointer"
            }`}
          >
            {loading ? "Processando..." : "Realizar Transferência"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}