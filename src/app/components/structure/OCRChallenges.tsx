import styles from '@/app/styling/ocr-challenges.module.css';

export default function OCRChallenges() {
  return (
    <section className={styles.wrapper} id="challenges">
      <h2>OCR Challenge</h2>
      <div className={styles.container}>
        <div className={styles.box}>Image Noise<br />&amp; Low Lighting</div>
        <div className={styles.box}>Lack of Khmer<br />OCR Tool</div>
        <div className={styles.box}>Segmentation<br />Problem</div>
      </div>
    </section>
  );
}
