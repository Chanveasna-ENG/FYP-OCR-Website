'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/styling/header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* left: logo */}
      <div className={styles.left}>
        <Link href="/">
          <Image src="/ocr.jpg" alt="Logo" width={100} height={10} className={styles.logo} />
        </Link>
      </div>

      {/* center: nav */}
      <nav className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/ocr">OCR Tool</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/about">About Us</Link>
      </nav>

      {/* right: login */}
      <div className={styles.right}>
        <Link href="/login" className={styles.loginBtn}>Log in</Link>
      </div>
    </header>
  );
}
