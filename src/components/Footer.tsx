import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Eric Yuji Ikeda. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
