import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
      <Link className="navbar-brand" to="/">Clinic Booking</Link>
      <div>
        <Link className="nav-link d-inline text-white" to="/">Medici</Link>
        <Link className="nav-link d-inline text-white" to="/new-booking">Prenota</Link>
        <Link className="nav-link d-inline text-white" to="/bookings">Le mie Prenotazioni</Link>
        <Link className="nav-link d-inline text-white" to="/login">Login</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
