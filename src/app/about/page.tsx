import Header from "@/components/structure/Header";
import Footer from "@/components/structure/Footer";
import TeamCard from "@/components/about/TeamCard";
import WhoWeAre from "@/components/about/WhoWeAre";

const teamMembers = [
  {
    name: "Minh LY",
    role: "Project Manager",
    image: "/li-minh.jpg",
  },
  {
    name: "Chanveasna ENG",
    role: "AI Engineer",
    image: "/veasna.jpg",
  },
  {
    name: "Sophea Vatey HEANG",
    role: "Backend Developer",
    image: "/vatey.jpg",
  },
  {
    name: "Sophearum SIYONN",
    role: "Frontend Developer",
    image: "/phearum.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <main className="flex-grow">
        {/* Team Section (Hero) */}
        <section className="pt-24 pb-20 px-4 md:px-6">
          <div className="container mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20 space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                Meet Our <span className="text-blue-600">Team</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                The minds behind the next generation of Khmer OCR technology.
              </p>
            </div>

            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageSrc={member.image}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <WhoWeAre />
      </main>

      <Footer />
    </div>
  );
}