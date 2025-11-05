import React, { useEffect, useState } from "react";
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from "../services/api";
import { Link } from "react-router-dom";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    availability: "",
  });
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data);
    } catch (err) {
      console.error("❌ Errore nel caricamento medici:", err);
      setMessage("Errore nel caricamento medici.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.firstName || !newDoctor.lastName || !newDoctor.specialty) {
      setMessage("⚠️ Tutti i campi principali sono obbligatori!");
      return;
    }
    try {
      await createDoctor(newDoctor);
      setMessage("✅ Medico aggiunto con successo!");
      setNewDoctor({ firstName: "", lastName: "", specialty: "", availability: "" });
      loadDoctors();
    } catch (err) {
      setMessage("❌ Errore durante la creazione del medico.");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questo medico?")) return;
    try {
      await deleteDoctor(id);
      setMessage("✅ Medico eliminato con successo!");
      loadDoctors();
    } catch {
      setMessage("❌ Errore durante l'eliminazione.");
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await updateDoctor(editingDoctor.id, editingDoctor);
      setMessage("✅ Medico aggiornato con successo!");
      setEditingDoctor(null);
      loadDoctors();
    } catch {
      setMessage("❌ Errore durante l'aggiornamento del medico.");
    }
  };

  if (loading) return <p className="text-center mt-4">Caricamento medici...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🩺 Gestione Medici</h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* 🔹 Aggiungi nuovo medico */}
      <form onSubmit={handleCreateDoctor} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">➕ Aggiungi Nuovo Medico</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nome"
              value={newDoctor.firstName}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, firstName: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cognome"
              value={newDoctor.lastName}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, lastName: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Specialità"
              value={newDoctor.specialty}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, specialty: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Disponibilità (es. Lun-Ven 9-17)"
              value={newDoctor.availability}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, availability: e.target.value })
              }
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Salva
        </button>
      </form>

      {/* 🔹 Tabella medici */}
      {doctors.length === 0 ? (
        <p>Nessun medico trovato.</p>
      ) : (
        <div className="card shadow-sm p-3 rounded">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Specialità</th>
                  <th>Disponibilità</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.firstName}</td>
                    <td>{doc.lastName}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1">
                        {doc.specialty}
                      </span>
                    </td>
                    <td>{doc.availability || "N/D"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => setEditingDoctor(doc)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteDoctor(doc.id)}
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
      )}

      {/* 🔹 Modifica medico */}
      {editingDoctor && (
        <div className="card p-3 mt-4 bg-light border border-primary">
          <h5 className="mb-3">✏️ Modifica Medico #{editingDoctor.id}</h5>
          <form onSubmit={handleUpdateDoctor}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  value={editingDoctor.firstName}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, firstName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  value={editingDoctor.lastName}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, lastName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  value={editingDoctor.specialty}
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, specialty: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  value={editingDoctor.availability}
                  placeholder="Es. Lun-Ven 9-17"
                  onChange={(e) =>
                    setEditingDoctor({ ...editingDoctor, availability: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success mt-3 me-2">
              Salva
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3"
              onClick={() => setEditingDoctor(null)}
            >
              Annulla
            </button>
          </form>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-primary">
          🏠 Torna alla Home
        </Link>
      </div>
    </div>
  );
}

export default DoctorList;
