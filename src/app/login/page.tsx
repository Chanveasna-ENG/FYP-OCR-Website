import styles from "@/app/styling/login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <form className={styles.form}>
        <h1>Log in</h1>

        <label>
          Email
          <input type="email" required />
        </label>

        <label>
          Password
          <input type="password" required />
        </label>

        <button type="submit">Log in</button>
      </form>
    </main>
  );
}
