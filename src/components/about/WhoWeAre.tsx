export default function WhoWeAre() {
  return (
    <section className="bg-black text-white py-24 border-t border-gray-900">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
          Who <span className="text-blue-500">We Are</span>
        </h2>
        <div className="bg-gray-900/50 p-8 md:p-12 rounded-3xl border border-gray-800 shadow-xl backdrop-blur-sm">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            We are a team of students passionate about using technology to make the
            Khmer language more accessible. Our project,{" "}
            <span className="text-white font-semibold">Khmer OCR with Modern Architecture</span>, 
            focuses on building a powerful OCR engine that accurately recognizes
            Khmer text, helping preserve culture, support education, and drive
            digital transformation in Cambodia.
          </p>
        </div>
      </div>
    </section>
  );
}