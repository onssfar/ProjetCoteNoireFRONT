import type { Product } from "@/data/store";

const CART_KEY = "cote-noire-cart";

export function getStoredCart(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setStoredCart(items: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearStoredCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
}
