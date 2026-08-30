import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { useParams } from "react-router-dom";

import StorefrontLayout from "@/components/StorefrontLayout";

import {
  formatPrice,
  Product,
  ProductCategory,
} from "@/data/store";

import { getProducts } from "@/lib/api";
import {
  getStoredCart,
  setStoredCart,
} from "@/lib/cartStorage";

import CandleHero from "@/components/candleHero";

/* =========================================================
   CATEGORY CONFIGURATION
========================================================= */

const categoryMap: Record<
  string,
  {
    title: string;
    intro: string;
    filter?: ProductCategory;
  }
> = {
  catalogue: {
    title: "Toute la collection",
    intro:
      "Des objets parfumés et des fleurs imaginés pour les intérieurs qui ont une âme.",
  },

  nouveautes: {
    title: "Les nouveautés",
    intro:
      "Les dernières pièces sorties de nos ateliers, en petites séries.",
  },

  fleurs: {
    title: "Fleurs préservées",
    intro:
      "Des bouquets sculpturaux qui gardent la beauté du geste, saison après saison.",
    filter: "Fleurs",
  },

  bougies: {
    title: "Bougies parfumées",
    intro:
      "Une lumière douce, une cire naturelle et des sillages imaginés à Paris.",
    filter: "Bougies",
  },

  diffuseurs: {
    title: "La maison",
    intro:
      "Des parfums d'intérieur délicats pour composer votre atmosphère.",
    filter: "Diffuseurs",
  },

  cadeaux: {
    title: "À offrir",
    intro:
      "Des attentions choisies avec soin, prêtes à faire plaisir.",
    filter: "Cadeaux",
  },
};

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[0.84] overflow-hidden bg-sand/45">
        <img
          src={
            hovered && product.hoverImage
              ? product.hoverImage
              : product.image
          }
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
        />

        {/* BADGE */}
        {product.badge && (
          <span
            className={`absolute left-3 top-3 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${
              product.badge.startsWith("-")
                ? "bg-[#b56d5e] text-white"
                : "bg-ivory/90 text-ink"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* ADD TO CART */}
        <button
          type="button"
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={() => onAdd(product)}
          className="absolute bottom-3 left-3 right-3 flex translate-y-3 items-center justify-center gap-2 bg-ink py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white opacity-0 transition-all duration-300 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100"
        >
          Ajouter au panier
          <ArrowRight
            size={14}
            strokeWidth={1.4}
          />
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              {product.category}
            </p>

            <h3 className="mt-1 font-display text-[18px] leading-tight">
              {product.name}
            </h3>

            <p className="mt-1.5 text-[12px] text-ink/45">
              {product.scent}
            </p>
          </div>

          <div className="shrink-0 pt-0.5 text-right text-[13px]">
            {product.oldPrice && (
              <span className="mr-1 text-ink/35 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}

            <span
              className={
                product.oldPrice
                  ? "text-[#b56d5e]"
                  : "text-ink"
              }
            >
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   CATALOG PAGE
========================================================= */

export default function Catalog() {
  const { collection = "catalogue" } = useParams();

  const details =
    categoryMap[collection] ??
    categoryMap.catalogue;

  /* =====================================================
     STATE
  ===================================================== */

  const [cartItems, setCartItems] =
    useState<Product[]>(getStoredCart);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [sort, setSort] =
    useState("featured");

  const [filterOpen, setFilterOpen] =
    useState(false);

  /*
   * Filtre sélectionné.
   *
   * On initialise avec le filtre de l'URL.
   *
   * Exemple :
   * /collections/fleurs
   * => "Fleurs"
   */
  const [selectedFilter, setSelectedFilter] =
    useState<ProductCategory | null>(
      details.filter ?? null
    );

  /*
   * Produits provenant directement du backend.
   */
  const [backendProducts, setBackendProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =====================================================
     LOAD PRODUCTS FROM BACKEND
  ===================================================== */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts();

        console.log(
          "=== PRODUITS BACKEND ==="
        );
        console.table(
  data.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    scent: product.scent,
  }))
);

        /*
         * Le backend ne possède pas forcément
         * hoverImage.
         *
         * Dans ce cas, on utilise image.
         */
        const formattedProducts: Product[] =
          data.map((product: Product) => ({
            ...product,

            hoverImage:
              product.hoverImage ||
              product.image,
          }));

        setBackendProducts(
          formattedProducts
        );
      } catch (err) {
        console.error(
          "Erreur lors du chargement des produits :",
          err
        );

        setError(
          "Impossible de charger les produits."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* =====================================================
     UPDATE FILTER WHEN URL CHANGES
  ===================================================== */

  useEffect(() => {
    setSelectedFilter(
      details.filter ?? null
    );
  }, [collection, details.filter]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const visibleProducts = useMemo(() => {
    let list = [...backendProducts];
  
    // La catégorie demandée par l'URL
    const categoryFromUrl = details.filter;
  
    // Filtre manuel sélectionné
    const categoryFromFilter = selectedFilter;
  
    // Le filtre manuel est prioritaire.
    // Sinon on utilise la catégorie de l'URL.
    const activeCategory =
      categoryFromFilter !== null
        ? categoryFromFilter
        : categoryFromUrl;
  
    if (activeCategory) {
      const normalizedCategory =
        activeCategory.trim().toLowerCase();
  
      list = list.filter((product) => {
        const productCategory =
          String(product.category ?? "")
            .trim()
            .toLowerCase();
  
        return productCategory === normalizedCategory;
      });
    }
  
    // Tri
    if (sort === "price-low") {
      list.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }
  
    if (sort === "price-high") {
      list.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }
  
    return list;
  }, [
    backendProducts,
    details.filter,
    selectedFilter,
    sort,
  ]);

  /* =====================================================
     CART
  ===================================================== */

  const addToCart = (
    product: Product
  ) => {
    setCartItems((current) => {
      const next = current.some(
        (item) =>
          item.id === product.id
      )
        ? current
        : [
            ...current,
            product,
          ];

      setStoredCart(next);

      return next;
    });

    setCartOpen(true);
  };

  const removeFromCart = (
    id: number
  ) => {
    setCartItems((current) => {
      const next =
        current.filter(
          (item) =>
            item.id !== id
        );

      setStoredCart(next);

      return next;
    });
  };

  /* =====================================================
     FILTER HANDLER
  ===================================================== */

  const handleFilter = (
    filter: ProductCategory | null
  ) => {
    setSelectedFilter(filter);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <StorefrontLayout
      cartItems={cartItems}
      cartOpen={cartOpen}
      onCartOpen={() =>
        setCartOpen(true)
      }
      onCartClose={() =>
        setCartOpen(false)
      }
      onRemoveItem={removeFromCart}
    >
      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <CandleHero />

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="border-b border-ink/10 bg-sand/45 px-5 pb-14 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-12 lg:pt-24">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Maison Côte Noire · collection
            </p>

            <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[76px]">
                  {details.title}
                </h1>

                <p className="mt-6 max-w-lg text-[14px] leading-7 text-ink/60 sm:text-[15px]">
                  {details.intro}
                </p>
              </div>

              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                {visibleProducts.length} pièces
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            FILTER + SORT
        ================================================= */}

        <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-5">

            {/* FILTER BUTTON */}

            <button
              type="button"
              onClick={() =>
                setFilterOpen(
                  (open) => !open
                )
              }
              className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60 hover:text-ink"
            >
              <SlidersHorizontal
                size={15}
                strokeWidth={1.4}
              />

              Filtrer
            </button>

            {/* SORT */}

            <label className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
              Trier par

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="bg-transparent text-ink outline-none"
              >
                <option value="featured">
                  Notre sélection
                </option>

                <option value="price-low">
                  Prix croissant
                </option>

                <option value="price-high">
                  Prix décroissant
                </option>
              </select>
            </label>
          </div>

          {/* =================================================
              FILTER BUTTONS
          ================================================= */}

          {filterOpen && (
            <div className="mb-8 flex flex-wrap gap-2 border-b border-ink/10 pb-8">

              {/* ALL */}

              <button
                type="button"
                onClick={() =>
                  handleFilter(null)
                }
                className={`flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.15em] transition ${
                  selectedFilter === null
                    ? "bg-ink text-white"
                    : "border border-ink/15 text-ink/55 hover:bg-ink hover:text-white"
                }`}
              >
                {selectedFilter === null && (
                  <Check
                    size={13}
                  />
                )}

                Toutes les pièces
              </button>

              {/* CATEGORIES */}

              {(
                [
                  "Fleurs",
                  "Bougies",
                  "Diffuseurs",
                  "Cadeaux",
                ] as ProductCategory[]
              ).map(
                (filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() =>
                      handleFilter(
                        filter
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.15em] transition ${
                      selectedFilter ===
                      filter
                        ? "bg-ink text-white"
                        : "border border-ink/15 text-ink/55 hover:bg-ink hover:text-white"
                    }`}
                  >
                    {selectedFilter ===
                      filter && (
                      <Check
                        size={13}
                      />
                    )}

                    {filter}
                  </button>
                )
              )}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
                Chargement des produits...
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="py-20 text-center">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {!loading &&
            !error &&
            visibleProducts.length ===
              0 && (
              <div className="py-20 text-center">
                <p className="font-display text-3xl">
                  Aucun produit trouvé
                </p>

                <p className="mt-3 text-sm text-ink/50">
                  Aucun produit ne
                  correspond à ce filtre.
                </p>
              </div>
            )}

          {/* =================================================
              PRODUCTS
          ================================================= */}

          {!loading &&
            !error &&
            visibleProducts.length >
              0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-16">
                {visibleProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                    />
                  )
                )}
              </div>
            )}
        </section>
      </main>
    </StorefrontLayout>
  );
}