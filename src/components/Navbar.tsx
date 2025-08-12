import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-logo">PainelTérmico</div>
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/grafico" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Gráfico
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/sobre" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Sobre
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
