import React from "react";
import Navbar from "../components/Navbar";
import "../styles/sobre.css";

const Sobre: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="sobre-main">
        <section className="sobre-container">
          <h1>Sobre Este Projeto</h1>
          <p>
            Este dashboard foi desenvolvido para simular e monitorar temperaturas em tempo real. 
            Permite adicionar valores manualmente ou usar uma simulação automática para testes.
          </p>
          <p>
            O sistema utiliza <strong>React</strong> com <strong>TypeScript</strong> e bibliotecas modernas para gráficos e animações, proporcionando uma experiência interativa e visualmente agradável.
          </p>

          <div className="tech-cards">
            <div className="card">
              <h3>React</h3>
              <p>Biblioteca para construir interfaces de usuário declarativas e eficientes.</p>
            </div>
            <div className="card">
              <h3>TypeScript</h3>
              <p>Superset do JavaScript que adiciona tipagem estática para maior robustez.</p>
            </div>
            <div className="card">
              <h3>React Spring</h3>
              <p>Biblioteca para animações fluidas e naturais dentro do React.</p>
            </div>
            <div className="card">
              <h3>Chart.js</h3>
              <p>Ferramenta para criar gráficos interativos e responsivos.</p>
            </div>
          </div>

        </section>
      </main>
    </>
  );
};

export default Sobre;
