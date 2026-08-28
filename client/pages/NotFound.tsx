import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <StorefrontLayout>
      <main className="flex min-h-[65vh] items-center justify-center bg-sand/35 px-6 py-20 text-center">
        <div className="max-w-lg">
          <Sparkles className="mx-auto text-gold" size={26} strokeWidth={1.2} />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">Maison Côte Noire</p>
          <h1 className="mt-4 font-display text-6xl tracking-[-0.04em]">404</h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-ink/55">Cette adresse n'existe pas encore. Revenez découvrir nos pièces parfumées et nos fleurs préservées.</p>
          <Link to="/" className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-gold">Retour à la maison <ArrowLeft size={15} strokeWidth={1.4} /></Link>
        </div>
      </main>
    </StorefrontLayout>
  );
};

export default NotFound;
