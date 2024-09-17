import React from 'react';
import Link from 'next/link';
import styles from '../Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarMenu}>
        <li className={styles.navbarMenuItem}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className={styles.navbarMenuItem}>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;