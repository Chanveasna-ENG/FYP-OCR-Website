import Image from "next/image";
import "@/app/styling/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={120} // adjust as needed
          height={50} // adjust as needed
          priority
        />
        <div className="social-icons">
          {/* Facebook Icon */}
          <Image src="/fb.png" alt="Facebook Icon" width={24} height={24} />
          {/* Instagram Icon */}
          <Image src="/ig.png" alt="Instagram Icon" width={24} height={24} />
        </div>
      </div>

      <div className="footer-info">
        <div>
          <p className="info-title">About</p>
          <p>Project Overview</p>
          <p>How It Works</p>
          <p>Partner</p>
          <p>Team</p>
        </div>
        <div>
          <p className="info-title">Resources</p>
          <p>Documentation</p>
          <p>API Reference</p>
          <p>Dataset</p>
          <p>Tutorial</p>
        </div>
        <div>
          <p className="info-title">Community</p>
          <p>Update</p>
          <p>Contribute</p>
          <p>Contact Us</p>
          <p>Support</p>
        </div>
      </div>

      <div className="copyright">
        © 2025 FYP. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
