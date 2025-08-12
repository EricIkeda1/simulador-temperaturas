import React from "react";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-logo">🌡️ Dashboard</div>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#graph">Gráfico</a></li>
            <li><a href="#about">Sobre</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
