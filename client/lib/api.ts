import type { Product } from "@/data/store";

const API_URL = "http://localhost:8086/api";
export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "CARD";

export type DeliveryMethod =
  | "STANDARD"
  | "EXPRESS";

export interface CreateOrderRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  items: {
    productId: number;
    quantity: number;
  }[];

  deliveryMethod: DeliveryMethod;

  paymentMethod: PaymentMethod;

  giftMessage?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  createdAt: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des produits : ${response.status}`
    );
  }

  const data = await response.json();

  return data.map((product: any) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    oldPrice: undefined,
    badge: undefined,
    image: product.image || "/placeholder.svg",

    // Le backend ne possède pas encore hoverImage
    hoverImage: product.image || "/placeholder.svg",

    description: product.description || "",
    scent: product.scent || "",
  }));
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération du produit : ${response.status}`
    );
  }

  const product = await response.json();

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    oldPrice: undefined,
    badge: undefined,
    image: product.image || "/placeholder.svg",
    hoverImage: product.image || "/placeholder.svg",
    description: product.description || "",
    scent: product.scent || "",
  };
}

export async function createOrder(
    order: CreateOrderRequest
  ): Promise<OrderResponse> {
    const response = await fetch(
      `${API_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );
  
    if (!response.ok) {
      const errorMessage =
        await response.text();
  
      throw new Error(
        errorMessage ||
          `Erreur lors de la création de la commande : ${response.status}`
      );
    }
  
    return response.json();
  }