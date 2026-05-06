import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api"; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      // A instância que já tem a baseURL do Render
      const response = await api.post("/Auth/login", {
        cpf,
        senha,
      });

      const token = response.data.token;
      login(token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("CPF ou senha inválidos");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80 flex flex-col gap-3"
      >
        <h1 className="text-xl font-bold text-center">Entrar</h1>
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition w-full"
        >
          Entrar
        </button>
        <p className="text-sm text-center">
          Não tem conta?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Cadastrar
          </span>
        </p>
      </form>
    </div>
  );
}