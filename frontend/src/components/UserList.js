import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((res) => {
        if (Array.isArray(res.data)) setUsers(res.data);
        else setUsers([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Errore nel caricamento utenti:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Caricamento utenti...</p>;
  if (!users || users.length === 0)
    return <p className="text-center mt-5">Nessun utente trovato.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">👥 Elenco Utenti</h2>
      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Ruolo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role?.toLowerCase() === "admin"
                          ? "bg-danger"
                          : u.role?.toLowerCase() === "doctor"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {u.role || "N/D"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Pulsante Home */}
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-primary">
          🏠 Torna alla Home
        </Link>
      </div>
    </div>
  );
}

export default UserList;
