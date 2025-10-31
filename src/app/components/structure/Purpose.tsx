import Image from 'next/image';
import styles from '@/app/styling/purpose.module.css';

export default function Purpose() {
  return (
    <section className={styles.wrapper} id="about">
      <h2>Why This Project Matters</h2>
      <div className={styles.container}>
        <div className={styles.box}><Image src="/edu.png" alt="Education" fill /></div>
        <div className={styles.box}><Image src="/pres.png" alt="Preservation" fill /></div>
        <div className={styles.box}><Image src="/acces.png" alt="Accessibility" fill /></div>
      </div>
    </section>
  );
}
