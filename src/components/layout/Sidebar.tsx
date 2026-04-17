import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-secondary text-white p-5">
      <h2 className="text-2xl font-bold mb-10 text-primary">
        Banco Digital
      </h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>

        <Link to="/deposito" className="hover:text-primary">
          Depósito
        </Link>

        <Link to="/transferencia" className="hover:text-primary">
          Transferência
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;