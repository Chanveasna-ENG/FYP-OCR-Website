import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="header">
      <Image src="/logo.png" alt="Logo" width={80} height={50} className="logo" />

      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/ocrtool">OCR Tool</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/api">API</Link>
        <Link href="/about">About Us</Link>
      </nav>

      <div className="social-icons">
        <a href="#"><Image src="/fb.png" alt="Facebook" width={24} height={24} /></a>
        <a href="#"><Image src="/ig.png" alt="Instagram" width={24} height={24} /></a>
      </div>
    </header>
  );
};

export default Header;
