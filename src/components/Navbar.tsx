import React from 'react';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  limparGrade: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ limparGrade }) => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <button id='limpar' className={styles.navButton} onClick={limparGrade}>
            LIMPAR GRADE
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;