import React, { useEffect, useState } from "react";
import {
  getBookings,
  getUsers,
  getDoctors,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../services/api";
import { Link } from "react-router-dom";

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const [filters, setFilters] = useState({ userId: "", doctorId: "" });
  const [newBooking, setNewBooking] = useState({
    userId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  // 🔹 Caricamento iniziale
  useEffect(() => {
    Promise.all([getBookings(), getUsers(), getDoctors()])
      .then(([bookingsRes, usersRes, doctorsRes]) => {
        setBookings(bookingsRes.data);
        setFilteredBookings(bookingsRes.data);
        setUsers(usersRes.data);
        setDoctors(doctorsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Errore nel caricamento:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Gestione filtro
  useEffect(() => {
    let filtered = [...bookings];
    if (filters.userId)
      filtered = filtered.filter((b) => b.user?.id === parseInt(filters.userId));
    if (filters.doctorId)
      filtered = filtered.filter((b) => b.doctor?.id === parseInt(filters.doctorId));
    setFilteredBookings(filtered);
  }, [filters, bookings]);

  // 🔹 Crea nuova prenotazione
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!newBooking.userId || !newBooking.doctorId || !newBooking.date || !newBooking.timeSlot) {
      setMessage("⚠️ Tutti i campi sono obbligatori!");
      return;
    }

    try {
      const response = await createBooking({
        user: { id: newBooking.userId },
        doctor: { id: newBooking.doctorId },
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        status: "In attesa",
        notes: newBooking.notes,
      });
      const updated = [...bookings, response.data];
      setBookings(updated);
      setFilteredBookings(updated);
      setMessage("✅ Prenotazione creata con successo!");
      setNewBooking({ userId: "", doctorId: "", date: "", timeSlot: "", notes: "" });
    } catch {
      setMessage("❌ Errore durante la creazione della prenotazione.");
    }
  };

  // 🔹 Elimina prenotazione
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questa prenotazione?")) return;
    try {
      await deleteBooking(id);
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);
      setFilteredBookings(updated);
      setMessage("✅ Prenotazione eliminata con successo!");
    } catch {
      setMessage("❌ Errore durante l'eliminazione.");
    }
  };

  // 🔹 Avvia modifica
  const startEditBooking = (b) =>
    setEditingBooking({ ...b, userId: b.user?.id || "", doctorId: b.doctor?.id || "" });

  // 🔹 Salva modifica
  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await updateBooking(editingBooking.id, {
        user: { id: editingBooking.userId },
        doctor: { id: editingBooking.doctorId },
        date: editingBooking.date,
        timeSlot: editingBooking.timeSlot,
        status: editingBooking.status,
        notes: editingBooking.notes,
      });
      const updated = bookings.map((b) =>
        b.id === editingBooking.id ? response.data : b
      );
      setBookings(updated);
      setFilteredBookings(updated);
      setEditingBooking(null);
      setMessage("✅ Prenotazione aggiornata con successo!");
    } catch {
      setMessage("❌ Errore durante l'aggiornamento.");
    }
  };

  if (loading) return <p className="text-center mt-4">Caricamento prenotazioni...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📅 Gestione Prenotazioni</h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* 🔹 FILTRI */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">🔍 Filtra Prenotazioni</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Utente</label>
            <select
              className="form-select"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            >
              <option value="">Tutti</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Medico</label>
            <select
              className="form-select"
              value={filters.doctorId}
              onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
            >
              <option value="">Tutti</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => setFilters({ userId: "", doctorId: "" })}
            >
              🔄 Reset Filtri
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 FORM NUOVA PRENOTAZIONE */}
      <form onSubmit={handleCreateBooking} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">➕ Nuova Prenotazione</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Utente</label>
            <select
              className="form-select"
              value={newBooking.userId}
              onChange={(e) =>
                setNewBooking({ ...newBooking, userId: e.target.value })
              }
            >
              <option value="">-- Seleziona --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Medico</label>
            <select
              className="form-select"
              value={newBooking.doctorId}
              onChange={(e) =>
                setNewBooking({ ...newBooking, doctorId: e.target.value })
              }
            >
              <option value="">-- Seleziona --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Data</label>
            <input
              type="date"
              className="form-control"
              value={newBooking.date}
              onChange={(e) =>
                setNewBooking({ ...newBooking, date: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Orario</label>
            <input
              type="text"
              className="form-control"
              placeholder="Es. 10:00-10:30"
              value={newBooking.timeSlot}
              onChange={(e) =>
                setNewBooking({ ...newBooking, timeSlot: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Note</label>
            <input
              type="text"
              className="form-control"
              value={newBooking.notes}
              onChange={(e) =>
                setNewBooking({ ...newBooking, notes: e.target.value })
              }
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Salva Prenotazione
        </button>
      </form>

      {/* 🔹 TABELLA PRENOTAZIONI */}
      {filteredBookings.length === 0 ? (
        <p className="text-center">Nessuna prenotazione trovata.</p>
      ) : (
        <div className="card shadow-sm p-3 rounded">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Utente</th>
                  <th>Medico</th>
                  <th>Data</th>
                  <th>Orario</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.user?.fullName || "N/D"}</td>
                    <td>
                      {b.doctor
                        ? `${b.doctor.firstName} ${b.doctor.lastName}`
                        : "N/D"}
                    </td>
                    <td>{b.date}</td>
                    <td>{b.timeSlot}</td>
                    <td>
                      {b.status?.toLowerCase() === "completata" ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1">
                          ✅ Completata
                        </span>
                      ) : b.status?.toLowerCase() === "in attesa" ? (
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-1">
                          ⏳ In attesa
                        </span>
                      ) : b.status?.toLowerCase() === "cancellata" ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1">
                          ❌ Cancellata
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary px-3 py-1">
                          ⚪ N/D
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => startEditBooking(b)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="btn btn-sm btn-danger"
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

      {/* 🔹 SEZIONE MODIFICA PRENOTAZIONE */}
      {editingBooking && (
        <div className="card p-3 mt-4 bg-light border border-primary">
          <h5 className="mb-3">
            ✏️ Modifica Prenotazione #{editingBooking.id}
          </h5>
          <form onSubmit={handleUpdateBooking}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Utente</label>
                <select
                  className="form-select"
                  value={editingBooking.userId}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, userId: e.target.value })
                  }
                >
                  <option value="">-- Seleziona --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Medico</label>
                <select
                  className="form-select"
                  value={editingBooking.doctorId}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, doctorId: e.target.value })
                  }
                >
                  <option value="">-- Seleziona --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.firstName} {d.lastName} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={editingBooking.date}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, date: e.target.value })
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Orario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Es. 10:00-10:30"
                  value={editingBooking.timeSlot}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, timeSlot: e.target.value })
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Stato</label>
                <select
                  className="form-select"
                  value={editingBooking.status}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, status: e.target.value })
                  }
                >
                  <option value="In attesa">In attesa</option>
                  <option value="Completata">Completata</option>
                  <option value="Cancellata">Cancellata</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Note</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingBooking.notes || ""}
                  onChange={(e) =>
                    setEditingBooking({ ...editingBooking, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success mt-3 me-2">
              Salva Modifiche
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3"
              onClick={() => setEditingBooking(null)}
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

export default BookingList;
