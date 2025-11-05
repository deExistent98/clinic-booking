import React, { useEffect, useState } from "react";
import { getDoctors } from "../services/api";
import { Link } from "react-router-dom";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctors()
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Errore nel caricamento medici:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Caricamento medici...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">
        <i className="bi bi-stethoscope text-primary me-2"></i> Elenco Medici
      </h2>

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*  Pulsante Home */}
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-outline-primary">
          🏠 Torna alla Home
        </Link>
      </div>
    </div>
  );
}

export default DoctorList;
