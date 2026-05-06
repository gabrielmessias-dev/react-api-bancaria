import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"; 

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/Clientes", {
        nome,
        cpf,
        senha,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/"); 
    } catch (error: any) {
      console.error(error);
      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Erro ao cadastrar ou conectar ao servidor.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-80 flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold text-center">Cadastro</h1>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Cadastrar
        </button>
        <p className="text-sm text-center">
          Já tem conta?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Entrar
          </span>
        </p>
      </form>
    </div>
  );
}