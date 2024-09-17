import React from 'react';
import styles from '../styles/page.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Home Page!</h1>
      <p className={styles.description}>
        This is the homepage of your Next.js site. Start building something amazing!
      </p>
      <a href="/about" className={styles.button}>Learn More</a>
    </div>
  );
};

export default HomePage;
