import Image from 'next/image';
import styles from '@/app/styling/hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <h1>UNLOCKING THE<br />KHMER SCRIPT</h1>
        <a href="#about" className={styles.heroBtn}>Try OCR Now</a>
      </div>
      <div className={styles.heroImage}>
        <Image src="/pic1.png" alt="OCR Scanner" fill className={styles.image} />
      </div>
    </section>
  );
}
