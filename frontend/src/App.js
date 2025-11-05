import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import DoctorList from "./components/DoctorList";
import BookingList from "./components/BookingList";
import Homepage from "./components/Homepage";

function App() {
  //  Imposta il tema (chiaro di default)
  const [theme, setTheme] = useState("light");

  // 🔧 Carica dal localStorage solo se esiste un valore
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  //  Applica sempre il tema corrente
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔁 Cambia tema
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Router>
      {/*  NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            🏥 Gestione Clinica
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  👥 Utenti
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/doctors">
                  🩺 Medici
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/bookings">
                  📅 Prenotazioni
                </Link>
              </li>
            </ul>

            {/*  Switch tema */}
            <div className="form-check form-switch ms-3 d-flex align-items-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <label
                className="form-check-label text-light ms-2"
                htmlFor="themeSwitch"
                style={{ fontSize: "1.3rem" }}
              >
                {theme === "dark" ? "🌙" : "🌞"}
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/*  Gestione pagine */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/bookings" element={<BookingList />} />
      </Routes>
    </Router>
  );
}

export default App;
