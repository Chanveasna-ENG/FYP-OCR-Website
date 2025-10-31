import Header from "@/app/components/structure/Header";
import Footer from "@/app/components/structure/Footer";
import styles from "@/app/styling/about.module.css";
import Image from "next/image";


export default function AboutPage() {
  return (
    <>
      <Header />

      {/* TEAM SECTION (dark) */}
      <section className={styles.teamHero}>
        <h2>Meet Our Team</h2>

        <div className={styles.teamGrid}>
          {/* Card 1 */}
          <article className={styles.card}>
            <Image
              src="/li-minh.jpg"
              alt="Li Minh"
              width={300}
              height={400}
              className={styles.avatar}
            />
            <h3>Minh LY</h3>
            <p className={styles.role}>Project<br />Manager</p>
        
          </article>

          {/* Card 2 */}
          <article className={styles.card}>
            <Image
              src="/veasna.jpg"
              alt="Veasna"
              width={600}
              height={270}
              className={styles.avatar}
            />
            <h3>Chanveasna ENG</h3>
            <p className={styles.role}>AI Engineer</p>
       
          </article>

          {/* Card 3 */}
          <article className={styles.card}>
            <Image
              src="/vatey.jpg"
              alt="Vatey"
              width={600}
              height={270}
              className={styles.avatar}
            />
            <h3>Sophea Vatey HEANG</h3>
            <p className={styles.role}>Backend<br/>Developer</p>
   
          </article>

          {/* Card 4 */}
          <article className={styles.card}>
            <Image
              src="/phearum.jpg"
              alt="Phearum"
              width={600}
              height={270}
              className={styles.avatar}
            />
            <h3>Sophearum SIYONN</h3>
            <p className={styles.role}>Frontend<br />Developer</p>
     
          </article>
        </div>
      </section>

      {/* ABOUT SECTION (light blue) */}
      <section className={styles.about}>
        <h2>Who We Are</h2>
        <p>
          We are a team of students passionate about using technology to make the Khmer language more accessible.
          Our project, Khmer OCR with Modern Architecture, focuses on building a powerful OCR engine that accurately
          recognizes Khmer text, helping preserve culture, support education, and drive digital transformation
          in Cambodia.
        </p>
      </section>

      <Footer />
    </>
  );
}
