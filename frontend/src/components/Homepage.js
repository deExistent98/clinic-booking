import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, getDoctors, getBookings } from "../services/api";

function Homepage() {
  const [usersCount, setUsersCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getDoctors(), getBookings()])
      .then(([usersRes, doctorsRes, bookingsRes]) => {
        setUsersCount(usersRes.data.length);
        setDoctorsCount(doctorsRes.data.length);
        setBookingsCount(bookingsRes.data.length);

        // Ordina prenotazioni per data discendente e prendi le ultime 5
        const sorted = bookingsRes.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentBookings(sorted);
      })
      .catch((err) => console.error("Errore nel caricamento dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Caricamento dashboard...</p>;

  return (
    <div className="container mt-5">
      {/* Titolo principale */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">
          🏥 Pannello di <span className="text-primary">Gestione Clinica</span>
        </h1>
        <p className="text-muted">
          Monitora in tempo reale utenti, medici e prenotazioni.
        </p>
      </div>

      {/* 🔹 Statistiche principali */}
      <div className="row g-4 mb-4 text-center">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-light h-100">
            <i className="bi bi-people-fill text-primary" style={{ fontSize: "2rem" }}></i>
            <h5 className="mt-2 fw-bold">Utenti</h5>
            <p className="display-6 fw-bold text-primary">{usersCount}</p>
            <Link to="/users" className="btn btn-outline-primary btn-sm mt-2">
              Vai agli Utenti
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-light h-100">
            <i className="bi bi-person-badge-fill text-success" style={{ fontSize: "2rem" }}></i>
            <h5 className="mt-2 fw-bold">Medici</h5>
            <p className="display-6 fw-bold text-success">{doctorsCount}</p>
            <Link to="/doctors" className="btn btn-outline-success btn-sm mt-2">
              Vai ai Medici
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 bg-light h-100">
            <i className="bi bi-calendar-check-fill text-info" style={{ fontSize: "2rem" }}></i>
            <h5 className="mt-2 fw-bold">Prenotazioni</h5>
            <p className="display-6 fw-bold text-info">{bookingsCount}</p>
            <Link to="/bookings" className="btn btn-outline-info btn-sm mt-2">
              Vai alle Prenotazioni
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Ultime prenotazioni */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white fw-bold">
          📅 Ultime Prenotazioni
        </div>
        <div className="card-body table-responsive">
          {recentBookings.length === 0 ? (
            <p className="text-center text-muted mb-0">Nessuna prenotazione trovata.</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
                <tr>
                  <th>ID</th>
                  <th>Utente</th>
                  <th>Medico</th>
                  <th>Data</th>
                  <th>Orario</th>
                  <th>Stato</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
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
                        <span className="badge bg-success">✅ Completata</span>
                      ) : b.status?.toLowerCase() === "in attesa" ? (
                        <span className="badge bg-warning text-dark">⏳ In attesa</span>
                      ) : b.status?.toLowerCase() === "cancellata" ? (
                        <span className="badge bg-danger">❌ Cancellata</span>
                      ) : (
                        <span className="badge bg-secondary">⚪ N/D</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
