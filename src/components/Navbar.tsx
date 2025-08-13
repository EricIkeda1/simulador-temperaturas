import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-logo">PainelTérmico</div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/download">Download</NavLink>
          </li>
          <li>
            <NavLink to="/sobre">Sobre</NavLink>
          </li>
        </ul>

        <div
          className={`hamburger-mid ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className={`nav-drawer-premium ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" end onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/download" onClick={closeMenu}>
              Download
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre" onClick={closeMenu}>
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>

      {menuOpen && (
        <div className="overlay-premium" onClick={closeMenu}></div>
      )}
    </header>
  );
};

export default Navbar;
