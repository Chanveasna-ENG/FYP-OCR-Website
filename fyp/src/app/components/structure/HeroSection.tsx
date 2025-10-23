const HeroSection = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <h1>
            UNLOCKING THE<br /> KHMER SCRIPT
          </h1>
          <a href="#about" className="hero-btn">Try OCR Now</a>
        </div>
        <div className="hero-image">
          <img src="pic1.png" alt="OCR Scanner" />
        </div>
      </section>

      <section className="ocr-challenges">
        <h2>OCR Challenge</h2>
        <div className="challenge-container">
          <div className="challenge-box">Image Noise<br /> & Low Lighting</div>
          <div className="challenge-box">Lack of Khmer<br />OCR Tool</div>
          <div className="challenge-box">Segmentation<br />Problem</div>
        </div>
      </section>

      <section className="purpose">
        <h2>Why This Project Matters</h2>
        <div className="purpose-container">
          <div className="purpose-box">
            <img src="edu.png" alt="Education" />
          </div>
          <div className="purpose-box">
            <img src="pres.png" alt="Preservation" />
          </div>
          <div className="purpose-box">
            <img src="acces.png" alt="Accessibility" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
