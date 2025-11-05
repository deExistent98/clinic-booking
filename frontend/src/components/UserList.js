import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "patient",
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Errore nel caricamento utenti:", err);
      setMessage("Errore nel caricamento utenti.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email) {
      setMessage("⚠️ Nome e email sono obbligatori!");
      return;
    }

    try {
      await createUser(newUser);
      setMessage("✅ Utente creato con successo!");
      setNewUser({ fullName: "", email: "", phone: "", role: "patient" });
      loadUsers();
    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante la creazione dell'utente.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editingUser);
      setMessage("✅ Utente aggiornato con successo!");
      setEditingUser(null);
      loadUsers();
    } catch {
      setMessage("❌ Errore durante l'aggiornamento.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questo utente?")) return;
    try {
      await deleteUser(id);
      setMessage("✅ Utente eliminato.");
      loadUsers();
    } catch {
      setMessage("❌ Errore durante l'eliminazione.");
    }
  };

  if (loading) return <p className="text-center mt-5">Caricamento utenti...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">
        <i className="bi bi-people-fill text-primary me-2"></i> Gestione Utenti
      </h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* ➕ FORM NUOVO UTENTE */}
      <form onSubmit={handleCreateUser} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3 d-flex align-items-center">
          <i className="bi bi-person-plus text-success me-2"></i>
          ➕ Aggiungi Nuovo Utente
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Nome completo"
              value={newUser.fullName}
              onChange={(e) =>
                setNewUser({ ...newUser, fullName: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Telefono"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              Salva
            </button>
          </div>
        </div>
      </form>

      {/* 📋 LISTA UTENTI */}
      <div className="card shadow-sm p-3 rounded">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Ruolo</th>
                <th>Azioni</th>
              </tr>
              <tr>
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
                          ? "bg-danger text-light"
                          : u.role?.toLowerCase() === "doctor"
                          ? "bg-primary text-light"
                          : "bg-secondary text-light"
                      } px-3 py-2`}
                    >
                      {u.role?.toUpperCase() || "N/D"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setEditingUser(u)}
                      className="btn btn-sm btn-warning me-2 text-dark"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✏️ FORM MODIFICA UTENTE */}
      {editingUser && (
        <div className="card p-3 mt-4 bg-light border border-primary">
          <h5 className="mb-3">
            ✏️ Modifica Utente #{editingUser.id}
          </h5>
          <form onSubmit={handleUpdateUser}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome completo"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Telefono"
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100">
                  Salva
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary mt-3"
              onClick={() => setEditingUser(null)}
            >
              Annulla
            </button>
          </form>
        </div>
      )}

      {/* 🏠 Pulsante Home */}
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-primary">
          🏠 Torna alla Home
        </Link>
      </div>
    </div>
  );
}

export default UserList;
