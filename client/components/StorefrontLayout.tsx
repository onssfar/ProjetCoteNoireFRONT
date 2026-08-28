import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Camera,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { formatPrice, Product, products } from "@/data/store";
import AlbaConcierge from "@/components/AlbaConcierge";
interface StorefrontLayoutProps {
  children: React.ReactNode;
  cartItems?: Product[];
  cartOpen?: boolean;
  onCartOpen?: () => void;
  onCartClose?: () => void;
  onRemoveItem?: (productId: number) => void;
  onAddToCart?: (product: Product) => void;
}

const navItems = [
  { label: "Nouveautés", href: "/collections/nouveautes" },
  { label: "Fleurs", href: "/collections/fleurs" },
  { label: "Bougies", href: "/collections/bougies" },
  { label: "Diffuseurs", href: "/collections/diffuseurs" },
  { label: "Cadeaux", href: "/collections/cadeaux" },
];

export default function StorefrontLayout({
  children,
  cartItems = [],
  cartOpen = false,
  onCartOpen,
  onCartClose,
  onRemoveItem,
  onAddToCart,
}: StorefrontLayoutProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.scent}`.toLowerCase().includes(query),
    );
  }, [searchQuery]);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-sand px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-brown sm:text-[11px]">
        Livraison offerte dès 90 TND <span className="mx-2 text-taupe">·</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[88px] lg:px-12">
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-start text-ink transition-colors hover:text-gold lg:hidden"
          >
            <Menu size={21} strokeWidth={1.5} />
          </button>

          <Link to="/" className="group flex items-center gap-3" aria-label="Maison Côte Noire accueil">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/70 text-gold transition-transform group-hover:rotate-12">
            <img src="/images/cotenoireLogo.png"
                alt="Côte Noire"
                className="h-28 w-auto object-contain"/>         
            </span>
            <span className="font-display text-[20px] tracking-[0.2em] text-ink sm:text-[22px]">Côte Noire</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-10" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative py-3 text-[11px] font-semibold uppercase tracking-[0.17em] transition-colors after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-all hover:text-gold hover:after:w-full ${location.pathname === item.href ? "text-gold after:w-1/2" : "text-ink/75"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              aria-label="Ouvrir le conseil Côte Noire"
              onClick={() => setAssistantOpen(true)}
              className="hidden h-10 items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-gold xl:flex"
            >
              <Sparkles size={15} strokeWidth={1.4} /> Conseil Côte Noire
            </button>
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink/75 transition-colors hover:text-gold"
            >
              <Search size={19} strokeWidth={1.4} />
            </button>
            <Link to="/compte" aria-label="Mon compte" className="hidden h-10 w-10 items-center justify-center text-ink/75 transition-colors hover:text-gold sm:flex">
              <UserRound size={19} strokeWidth={1.4} />
            </Link>
            <button
              type="button"
              aria-label={`Panier, ${cartItems.length} article${cartItems.length > 1 ? "s" : ""}`}
              onClick={onCartOpen}
              className="relative flex h-10 w-10 items-center justify-center text-ink/75 transition-colors hover:text-gold"
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              {cartItems.length > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-white">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {children}

      <footer className="bg-brown text-white">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-16 lg:px-12 lg:py-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold"><Sparkles size={15} strokeWidth={1.4} /></span>
              <span className="font-display text-[21px] tracking-[0.2em]">À propos de nous</span>
            </div>
            <p className="max-w-xs text-[13px] leading-7 text-white/60">La collection Côte Noire prend les meilleurs éléments du monde entier et les combine pour créer des produits beaux et luxueux.</p>
            <div className="mt-8 flex gap-3">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold"><Camera size={16} strokeWidth={1.4} /></a>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Découvrir</p>
            <div className="flex flex-col gap-3 text-[13px] text-white/65">
              <Link to="/collections/nouveautes" className="transition-colors hover:text-white">Nouveautés</Link>
              <Link to="/collections/fleurs" className="transition-colors hover:text-white">Fleurs préservées</Link>
              <Link to="/collections/bougies" className="transition-colors hover:text-white">Bougies parfumées</Link>
              <Link to="/collections/diffuseurs" className="transition-colors hover:text-white">La maison</Link>
              <Link to="/collections/cadeaux" className="transition-colors hover:text-white">Coffrets cadeaux</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Liens Rapides</p>
            <div className="flex flex-col gap-3 text-[13px] text-white/65">
              <Link to="/livraison" className="transition-colors hover:text-white">A propos de nous</Link>
              <Link to="/contact" className="transition-colors hover:text-white">Nous contacter</Link>
              <Link to="/journal" className="transition-colors hover:text-white">Information de contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-[10px] uppercase tracking-[0.18em] text-white/35">© 2024 Côte Noire Maison · Paris & Lisbonne</div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Rechercher dans la boutique">
          <div className="bg-ivory px-5 py-8 shadow-2xl sm:px-10 sm:py-12">
            <div className="mx-auto max-w-[1000px]">
              <div className="flex items-center gap-4 border-b border-ink/20 pb-4">
                <Search size={23} strokeWidth={1.3} className="text-gold" />
                <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Rechercher une fleur, une senteur..." className="min-w-0 flex-1 bg-transparent font-display text-xl text-ink outline-none placeholder:text-ink/30 sm:text-3xl" />
                <button type="button" aria-label="Fermer la recherche" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-ink/50 transition-colors hover:text-ink"><X size={22} strokeWidth={1.3} /></button>
              </div>
              {searchQuery && (
                <div className="mt-7">
                  {searchResults.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{searchResults.map((product) => <Link key={product.id} to={`/collections/${product.category.toLowerCase()}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-4 border border-ink/10 p-3 transition-colors hover:border-gold"><img src={product.image} alt="" className="h-16 w-16 object-cover" /><span><span className="block text-[10px] uppercase tracking-[0.16em] text-gold">{product.category}</span><span className="mt-1 block font-display text-base">{product.name}</span></span></Link>)}</div> : <p className="text-sm text-ink/50">Aucun résultat pour « {searchQuery} ».</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-ink/30 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu mobile">
          <div className="h-full w-[min(88vw,380px)] bg-ivory px-6 py-7 shadow-2xl">
            <div className="mb-12 flex items-center justify-between"><Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-display text-xl tracking-[0.2em]">Côte Noire</Link><button type="button" aria-label="Fermer le menu" onClick={() => setMobileMenuOpen(false)} className="text-ink/60"><X size={22} strokeWidth={1.3} /></button></div>
            <nav className="flex flex-col" aria-label="Navigation mobile">
              {navItems.map((item) => <Link key={item.href} to={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between border-b border-ink/10 py-5 font-display text-2xl">{item.label}<ChevronRight size={18} strokeWidth={1.2} className="text-gold" /></Link>)}
            </nav>
            <div className="mt-10 flex flex-col gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60"><Link to="/compte" onClick={() => setMobileMenuOpen(false)}>Mon compte</Link><button type="button" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}>Rechercher</button></div>
          </div>
        </div>
      )}

    <AlbaConcierge
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        onAddToCart={onAddToCart}
     />

      {cartOpen && (
        <div className="fixed inset-0 z-[58] bg-ink/30" role="dialog" aria-modal="true" aria-label="Votre panier">
          <button type="button" aria-label="Fermer le panier" onClick={onCartClose} className="absolute inset-0 h-full w-full cursor-default" />
          <aside className="absolute right-0 top-0 flex h-full w-[min(100%,420px)] flex-col bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Votre sélection</p><h2 className="mt-2 font-display text-2xl">Le panier <span className="text-ink/40">({cartItems.length})</span></h2></div><button type="button" aria-label="Fermer le panier" onClick={onCartClose} className="text-ink/50 hover:text-ink"><X size={21} strokeWidth={1.3} /></button></div>
            {cartItems.length ? <><div className="flex-1 overflow-y-auto px-6">{cartItems.map((item) => <div key={item.id} className="flex gap-4 border-b border-ink/10 py-5"><img src={item.image} alt="" className="h-24 w-20 object-cover" /><div className="flex min-w-0 flex-1 flex-col justify-between"><div><p className="font-display text-lg leading-tight">{item.name}</p><p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/45">{item.scent}</p></div><div className="flex items-center justify-between"><span className="text-sm">{formatPrice(item.price)}</span><button type="button" onClick={() => onRemoveItem?.(item.id)} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45 underline underline-offset-4 hover:text-ink">Retirer</button></div></div></div>)}</div><div className="border-t border-ink/10 px-6 py-6"><div className="mb-5 flex items-center justify-between text-sm"><span className="text-ink/55">Sous-total</span><span className="font-semibold">{formatPrice(cartTotal)}</span></div><Link to="/paiement" onClick={onCartClose} className="flex w-full items-center justify-center gap-3 bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold">Passer au paiement <ArrowRight size={16} strokeWidth={1.4} /></Link><p className="mt-4 text-center text-[11px] text-ink/45">Paiement sécurisé · Livraison offerte dès 90 TND</p></div></> : <div className="flex flex-1 flex-col items-center justify-center px-8 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sand text-gold"><ShoppingBag size={25} strokeWidth={1.2} /></div><h3 className="font-display text-2xl">Votre panier est vide</h3><p className="mt-3 max-w-xs text-sm leading-6 text-ink/55">Ajoutez une pièce parfumée ou un bouquet pour commencer votre sélection.</p><button type="button" onClick={onCartClose} className="mt-7 border-b border-ink pb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">Découvrir la collection</button></div>}
          </aside>
        </div>
      )}
    </div>
  );
}
