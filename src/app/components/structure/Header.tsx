'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/styling/header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Image src="/logo.png" alt="Logo" width={120} height={75} className={styles.logo} />
      </div>

      <nav className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/ocr">OCR Tool</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/about">About Us</Link>
      </nav>

      <div className={styles.socialIcons}>
        <a href="#"><Image src="/fb.png" alt="Facebook" width={24} height={24} /></a>
        <a href="#"><Image src="/ig.png" alt="Instagram" width={24} height={24} /></a>
      </div>
    </header>
  );
}
