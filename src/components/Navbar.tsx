import React from 'react';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  limparGrade: () => void;
  salvarGrade: () => void;
}


const Navbar: React.FC<NavbarProps> = ({ limparGrade, salvarGrade }) => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <button id='limpar' className={styles.navButton} onClick={limparGrade}>
            LIMPAR GRADE
          </button>
        </li>
        <li>
          <button id='salvar' className={styles.navButton} onClick={salvarGrade}>
            SALVAR
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;