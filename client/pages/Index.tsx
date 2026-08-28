import { useMemo, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import StorefrontLayout from "@/components/StorefrontLayout";
import { formatPrice, Product, products } from "@/data/store";
import { getStoredCart, setStoredCart } from "@/lib/cartStorage";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
};

const glass =
  "border border-white/20 bg-white/[0.10] backdrop-blur-xl shadow-[0_20px_80px_rgba(20,14,8,.10)]";

function Section({
  id,
  children,
  dark = false,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={`${dark
          ? "bg-[#17130f] text-white"
          : "bg-[#f5efe7] text-ink"
        } ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-gold">
      {children}
    </p>
  );
}

function ProductMiniCard({
  product,
  onAdd,
  onQuickView,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onQuickView: (p: Product) => void;
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className={`${glass} group overflow-hidden rounded-2xl border-ink/10 bg-white/50`}
    >
      <div className="relative aspect-[0.86] overflow-hidden bg-sand/40">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 rounded-full bg-white/90 px-3 py-3 text-center text-[9px] font-semibold uppercase tracking-[.15em]"
          >
            Voir
          </button>

          <button
            onClick={() => onAdd(product)}
            className="flex h-10 w-11 items-center justify-center rounded-full bg-ink text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[.22em] text-gold">
          {product.category}
        </p>

        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl leading-none">
              {product.name.replace("Bougie ", "")}
            </h3>

            <p className="mt-2 text-xs text-ink/45">
              {product.scent}
            </p>
          </div>

          <span className="text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Index() {
  const [cartItems, setCartItems] = useState<Product[]>(getStoredCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.25],
    [0, -120]
  );

  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 1.08]
  );

  const candles = useMemo(
    () => products.filter((p) => p.category === "Bougies"),
    []
  );

  const featured = candles.slice(0, 4);

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const next = current.some((item) => item.id === product.id)
        ? current
        : [...current, product];
      setStoredCart(next);
      return next;
    });

    setCartOpen(true);
  };

  return (
    <StorefrontLayout
      cartItems={cartItems}
      cartOpen={cartOpen}
      onCartOpen={() => setCartOpen(true)}
      onCartClose={() => setCartOpen(false)}
      onRemoveItem={(id) =>
        setCartItems((current) => {
          const next = current.filter((item) => item.id !== id);
          setStoredCart(next);
          return next;
        })
      }
      onAddToCart={(product) => {
        setCartItems((current) => {
          const next = current.some((item) => item.id === product.id) ? current : [...current, product];
          setStoredCart(next);
          return next;
        });
        setCartOpen(true);
      }}
    >
      <main className="overflow-hidden">

        {/* ================================================= */}
        {/* 01 — HERO */}
        {/* ================================================= */}

        <section
          id="hero"
          className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#130f0c] text-white"
        >
          <motion.img
            style={{
              y: heroY,
              scale: heroScale,
            }}
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=2200&q=90"
            alt="Bougie Cote Noir"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(207,157,95,.22),transparent_30%),linear-gradient(90deg,rgba(10,7,5,.82),rgba(10,7,5,.24),rgba(10,7,5,.55))]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-[1500px] items-end px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="max-w-3xl"
            >
              <Label>
                Maison de bougies parfumées
              </Label>

              <h1 className="mt-6 max-w-4xl font-display text-[clamp(4rem,9vw,9rem)] leading-[.78] tracking-[-.055em]">
                La lumière
                <br />
                comme matière.
              </h1>

              <p className="mt-8 max-w-lg text-sm leading-7 text-white/70">
                Des bougies artisanales, coulées à la main,
                pensées comme des objets d'intérieur et
                composées autour de parfums singuliers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/collections/bougies"
                  className="rounded-full bg-[#efe1cd] px-6 py-4 text-[9px] font-semibold uppercase tracking-[.18em] text-ink transition-transform hover:scale-[1.03]"
                >
                  Découvrir la collection
                  <ArrowRight
                    className="ml-2 inline"
                    size={14}
                  />
                </Link>

                <a
                  href="#notes"
                  className={`${glass} rounded-full px-6 py-4 text-[9px] font-semibold uppercase tracking-[.18em]`}
                >
                  Notre univers
                  <ChevronRight
                    className="ml-1 inline"
                    size={14}
                  />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className={`${glass} absolute bottom-5 right-5 hidden rounded-2xl p-4 md:block lg:right-12`}
          >
          </motion.div>
        </section>

        {/* ================================================= */}
        {/* 02 — COLLECTION */}
        {/* ================================================= */}

        <Section
          id="collection"
          className="px-5 py-24 sm:px-10 lg:px-12"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="flex min-h-[520px] items-center justify-center">
              <motion.div
                variants={fadeUp}
                className="w-full max-w-3xl text-center"
              >
                <Label>
                  Collection bougies
                </Label>

                <h2 className="mt-6 font-display text-6xl leading-[.9] tracking-[-.04em] sm:text-7xl lg:text-8xl">
                  Des parfums
                  <br />
                  pour chaque moment.
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-ink/55">
                  Une collection courte, élégante et sensorielle,
                  créée pour accompagner les espaces de vie.
                </p>

                <Link
                  to="/collections/bougies"
                  className="mt-9 inline-flex items-center gap-3 border-b border-ink pb-2 text-[10px] font-semibold uppercase tracking-[.18em]"
                >
                  Voir toute la collection
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* ================================================= */}
        {/* QUICK VIEW */}
        {/* ================================================= */}

        <AnimatePresence>
          {quickView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-5 py-8 backdrop-blur-md"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  y: 20,
                  scale: 0.98,
                }}
                className="relative grid max-h-[90vh] w-full max-w-[900px] overflow-auto rounded-3xl bg-[#f7f1e9] shadow-2xl sm:grid-cols-2"
              >
                <button
                  onClick={() => setQuickView(null)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80"
                >
                  <X size={18} />
                </button>

                <img
                  src={quickView.image}
                  alt={quickView.name}
                  className="aspect-square w-full object-cover"
                />

                <div className="flex flex-col justify-center p-8 sm:p-12">

                  <Label>
                    {quickView.category}
                  </Label>

                  <h2 className="mt-4 font-display text-5xl leading-none">
                    {quickView.name}
                  </h2>

                  <p className="mt-3 text-xs uppercase tracking-[.18em] text-ink/40">
                    {quickView.scent}
                  </p>

                  <p className="mt-7 text-sm leading-7 text-ink/55">
                    {quickView.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">

                    <span className="font-display text-3xl">
                      {formatPrice(quickView.price)}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(quickView);
                        setQuickView(null);
                      }}
                      className="rounded-full bg-ink px-6 py-4 text-[9px] font-semibold uppercase tracking-[.16em] text-white"
                    >
                      Ajouter
                      <ArrowRight
                        className="ml-2 inline"
                        size={13}
                      />
                    </button>

                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </StorefrontLayout>
  );
}
