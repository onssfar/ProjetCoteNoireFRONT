import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandleHero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#e8dfd2]">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2000&q=90"
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#2b241f]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-[1500px] flex-col items-center justify-center px-6 text-center text-white">

        <p className="text-[10px] font-semibold uppercase tracking-[0.35em]">
          Cote Noir · Maison parfumée
        </p>

        <h1 className="mt-7 max-w-4xl font-display text-[64px] leading-[0.88] tracking-[-0.05em] sm:text-[90px] lg:text-[120px]">
          La lumière
          <br />
          comme matière.
        </h1>

        <p className="mt-8 max-w-md text-sm leading-7 text-white/80">
          Des bougies imaginées comme des objets d'intérieur,
          coulées à la main et composées autour de parfums singuliers.
        </p>

        <Link
          to="/collections/bougies"
          className="mt-9 flex items-center gap-4 border-b border-white pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:border-gold hover:text-gold"
        >
          Découvrir les bougies
          <ArrowRight size={16} strokeWidth={1.3} />
        </Link>
      </div>
    </section>
  );
}