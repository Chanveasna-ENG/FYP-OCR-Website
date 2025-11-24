import Image from "next/image";

type TeamCardProps = {
  name: string;
  role: string;
  imageSrc: string;
};

export default function TeamCard({ name, role, imageSrc }: TeamCardProps) {
  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 w-full p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-1 tracking-wide group-hover:text-blue-400 transition-colors">
          {name}
        </h3>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
          {role}
        </p>
      </div>
    </div>
  );
}