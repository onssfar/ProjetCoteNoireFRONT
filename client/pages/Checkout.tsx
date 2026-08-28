import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, LockKeyhole, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, Product } from "@/data/store";
import { clearStoredCart, getStoredCart, setStoredCart } from "@/lib/cartStorage";

import {
  createOrder,
  type DeliveryMethod,
} from "@/lib/api";
type CheckoutStep = "information" | "delivery" | "payment" | "success";

const stepLabels = ["Coordonnées", "Livraison", "Paiement"];

export default function Checkout() {
  const [cartItems, setCartItems] = useState<Product[]>(getStoredCart);
  const [step, setStep] = useState<CheckoutStep>("information");
  const [shipping, setShipping] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const subtotal = useMemo(() => cartItems.reduce((sum, product) => sum + product.price, 0), [cartItems]);
  const delivery = shipping === "express" ? 12 : subtotal >= 90 ? 0 : 6;
  const total = subtotal + delivery;
  const stepIndex = step === "information" ? 0 : step === "delivery" ? 1 : 2;
  const contactReady = Boolean(
    email &&
    firstName &&
    lastName &&
    phone &&
    address &&
    city &&
    postalCode
  );
  const paymentReady = paymentMethod !== "card" || (cardNumber.replace(/\s/g, "").length >= 16 && expiry.length >= 5 && cvc.length >= 3);

  const goNext = () => {
    if (step === "information" && contactReady) setStep("delivery");
    else if (step === "delivery") setStep("payment");
  };
  const removeFromCart = (id: number) => {
    setCartItems((current) => {
      const next = current.filter((item) => item.id !== id);
      setStoredCart(next);
      return next;
    });
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();

    if (!paymentReady) {
      return;
    }

    try {
      const order = {
        customer: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode,
        },

        items: cartItems.map((product) => ({
          productId: product.id,
          quantity: 1,
        })),

        deliveryMethod: (
          shipping === "express"
            ? "EXPRESS"
            : "STANDARD"
        ) as DeliveryMethod,

        paymentMethod: "CASH_ON_DELIVERY" as const,

        giftMessage:
          giftMessage || undefined,
      };

      console.log("Commande envoyée au backend :", order);

      const result = await createOrder(order);

      console.log("Commande créée :", result);

      clearStoredCart();

      setStep("success");

    } catch (error) {
      console.error(
        "Erreur lors de la création de la commande :",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création de la commande."
      );
    }
  };
  const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value: string) => value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  if (!cartItems.length && step !== "success") {
    return <div className="min-h-screen bg-ivory text-ink"><header className="border-b border-ink/10 bg-ivory px-6 py-6 sm:px-12"><Link to="/" className="font-display text-2xl tracking-[0.2em]">CÔTE NOIRE</Link></header><main className="flex min-h-[70vh] items-center justify-center px-6 py-20 text-center"><div><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-gold"><Sparkles size={25} strokeWidth={1.2} /></div><p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Votre sélection</p><h1 className="mt-4 font-display text-5xl">Votre panier est vide</h1><p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-ink/55">Ajoutez une bougie ou une création parfumée avant de passer au paiement.</p><Link to="/catalogue" className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-gold">Découvrir la collection <ArrowRight size={15} strokeWidth={1.3} /></Link></div></main></div>;
  }

  if (step === "success") {
    return <div className="min-h-screen bg-ivory text-ink"><header className="border-b border-ink/10 bg-ivory px-6 py-6 sm:px-12"><Link to="/" className="font-display text-2xl tracking-[0.2em]">CÔTE NOIRE</Link></header><main className="flex min-h-[75vh] items-center justify-center px-6 py-20 text-center"><div className="max-w-xl"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d9e2d2] text-[#597455]"><Check size={27} strokeWidth={1.4} /></div><p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Commande confirmée</p><h1 className="mt-4 font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl">Merci, {firstName}.</h1><p className="mx-auto mt-6 max-w-md text-[14px] leading-7 text-ink/60">Votre sélection Côte Noire est en préparation avec le plus grand soin. Un e-mail de confirmation vient d'être envoyé à <strong className="font-medium text-ink">{email}</strong>.</p><div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 text-left"><div className="border border-ink/10 bg-white p-4"><Truck size={17} strokeWidth={1.3} className="text-gold" /><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em]">Expédition</p><p className="mt-1 text-[12px] text-ink/55">Sous 24 à 48h</p></div><div className="border border-ink/10 bg-white p-4"><ShieldCheck size={17} strokeWidth={1.3} className="text-gold" /><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em]">Paiement</p><p className="mt-1 text-[12px] text-ink/55">Sécurisé et protégé</p></div></div><Link to="/" className="mt-9 inline-flex items-center gap-3 border-b border-ink pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] hover:border-gold hover:text-gold">Retour à Côte Noire <ArrowRight size={15} strokeWidth={1.3} /></Link></div></main></div>;
  }

  return <div className="min-h-screen bg-[#f7f4ef] text-ink"><header className="border-b border-ink/10 bg-ivory px-5 py-5 sm:px-10 lg:px-12"><div className="mx-auto flex max-w-[1280px] items-center justify-between"><Link to="/" className="font-display text-2xl tracking-[0.2em]">CÔTE NOIRE</Link><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/45"><LockKeyhole size={14} strokeWidth={1.3} /> Paiement sécurisé</div></div></header><main className="mx-auto grid max-w-[1280px] gap-10 px-5 py-9 sm:px-10 lg:grid-cols-[1fr_380px] lg:gap-20 lg:px-12 lg:py-14"><div><Link to="/" className="mb-8 flex w-fit items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45 hover:text-ink"><ArrowLeft size={14} strokeWidth={1.3} /> Retour à la boutique</Link><div className="mb-10 flex items-center"><div className="flex flex-1 items-center gap-2 sm:gap-3">{stepLabels.map((label, index) => <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${index < stepIndex ? "bg-[#d9e2d2] text-[#597455]" : index === stepIndex ? "bg-ink text-white" : "border border-ink/20 text-ink/40"}`}>{index < stepIndex ? <Check size={13} strokeWidth={1.7} /> : index + 1}</span><span className={`hidden text-[10px] uppercase tracking-[0.12em] sm:block ${index === stepIndex ? "text-ink" : "text-ink/40"}`}>{label}</span>{index < 2 && <span className="h-px flex-1 bg-ink/10" />}</div>)}</div></div>
    {step === "information" && <section><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Étape 1</p><h1 className="mt-3 font-display text-5xl leading-none tracking-[-0.03em]">Vos coordonnées</h1><p className="mt-4 text-sm text-ink/55">Où pouvons-nous vous envoyer votre sélection ?</p><div className="mt-9 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2">
      <span className="checkout-label">Adresse e-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" className="checkout-input" />
    </label><label><span className="checkout-label">Prénom</span>
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="checkout-input" />
      </label>
      <label>
        <span className="checkout-label">Nom</span><input value={lastName} onChange={(event) => setLastName(event.target.value)} className="checkout-input" />
      </label>
      <label className="checkout-label sm:col-span-2">
        <span>Téléphone</span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+216 20 123 456"
          className="checkout-input"
          required
        />
      </label>
      <label className="sm:col-span-2"><span className="checkout-label">Adresse</span>
        <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="12 avenue Habib Bourguiba" className="checkout-input" />
      </label>
      <label>
        <span className="checkout-label">Code postal</span><input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="1000" className="checkout-input" />
      </label>
      <label>
        <span className="checkout-label">Ville</span>
        <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Tunis" className="checkout-input" />
      </label>
    </div>
      <button type="button" disabled={!contactReady} onClick={goNext} className="mt-9 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:bg-ink/20">Continuer vers la livraison <ArrowRight size={15} strokeWidth={1.3} /></button></section>}
    {step === "delivery" && <section><button type="button" onClick={() => setStep("information")} className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-ink/45 hover:text-ink"><ArrowLeft size={14} strokeWidth={1.3} /> Coordonnées</button><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Étape 2</p><h1 className="mt-3 font-display text-5xl leading-none tracking-[-0.03em]">Votre livraison</h1><p className="mt-4 text-sm text-ink/55">Choisissez le rythme qui vous convient.</p><div className="mt-9 grid gap-3"><label className={`flex cursor-pointer items-center gap-4 border p-5 ${shipping === "standard" ? "border-ink bg-white" : "border-ink/10"}`}><input type="radio" name="shipping" value="standard" checked={shipping === "standard"} onChange={(event) => setShipping(event.target.value)} className="accent-ink" /><span className="flex-1"><span className="block text-[12px] font-semibold">Livraison standard</span><span className="mt-1 block text-[12px] text-ink/45">2 à 4 jours ouvrés · offerte dès 90 TND</span></span><span className="text-[12px]">{subtotal >= 90 ? "Offerte" : formatPrice(6)}</span></label><label className={`flex cursor-pointer items-center gap-4 border p-5 ${shipping === "express" ? "border-ink bg-white" : "border-ink/10"}`}><input type="radio" name="shipping" value="express" checked={shipping === "express"} onChange={(event) => setShipping(event.target.value)} className="accent-ink" /><span className="flex-1"><span className="block text-[12px] font-semibold">Livraison express</span><span className="mt-1 block text-[12px] text-ink/45">1 à 2 jours ouvrés · suivi inclus</span></span><span className="text-[12px]">{formatPrice(12)}</span></label></div><div className="mt-8 border-t border-ink/10 pt-7"><label className="checkout-label">Un mot pour le destinataire <span className="font-normal normal-case tracking-normal text-ink/35">(facultatif)</span><textarea value={giftMessage} onChange={(event) => setGiftMessage(event.target.value)} rows={4} placeholder="Écrivez quelques mots doux..." className="checkout-input mt-3 resize-none" /></label></div><button type="button" onClick={goNext} className="mt-8 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-gold">Continuer vers le paiement <ArrowRight size={15} strokeWidth={1.3} /></button></section>}
    {step === "payment" && <form onSubmit={submitOrder}><button type="button" onClick={() => setStep("delivery")} className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-ink/45 hover:text-ink"><ArrowLeft size={14} strokeWidth={1.3} /> Livraison</button><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Étape 3</p><h1 className="mt-3 font-display text-5xl leading-none tracking-[-0.03em]">Votre paiement</h1><p className="mt-4 text-sm text-ink/55">Vos informations de paiement sont chiffrées et protégées.</p><div className="mt-9 flex gap-2"><button type="button" onClick={() => setPaymentMethod("card")} className={`flex-1 border px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] ${paymentMethod === "card" ? "border-ink bg-white" : "border-ink/10 text-ink/50"}`}>Carte bancaire</button><button type="button" onClick={() => setPaymentMethod("paypal")} className={`flex-1 border px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] ${paymentMethod === "paypal" ? "border-ink bg-white" : "border-ink/10 text-ink/50"}`}>PayPal</button></div>{paymentMethod === "card" ? <div className="mt-5 grid gap-4"><label className="sm:col-span-2"><span className="checkout-label">Numéro de carte</span><input value={cardNumber} onChange={(event) => setCardNumber(formatCardNumber(event.target.value))} placeholder="1234 5678 9012 3456" inputMode="numeric" className="checkout-input tracking-[0.12em]" /></label><label><span className="checkout-label">Expiration</span><input value={expiry} onChange={(event) => setExpiry(formatExpiry(event.target.value))} placeholder="MM / AA" inputMode="numeric" className="checkout-input" /></label><label><span className="checkout-label">Cryptogramme</span><input value={cvc} onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="CVC" inputMode="numeric" className="checkout-input" /></label></div> : <div className="mt-5 border border-ink/10 bg-white p-6 text-sm leading-6 text-ink/60">Vous serez redirigé vers PayPal après validation de votre commande pour finaliser le paiement en toute sécurité.</div>}<label className="mt-6 flex items-start gap-3 text-[11px] leading-5 text-ink/55"><input type="checkbox" defaultChecked className="mt-1 accent-ink" /> J'accepte les conditions générales de vente et la politique de confidentialité.</label><button type="submit" disabled={!paymentReady} className="mt-8 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-gold disabled:cursor-not-allowed disabled:bg-ink/20">Confirmer et payer {formatPrice(total)} <ArrowRight size={15} strokeWidth={1.3} /></button><div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.14em] text-ink/35"><LockKeyhole size={13} strokeWidth={1.3} /> Paiement 100 % sécurisé</div></form>}
  </div><aside className="h-fit border border-ink/10 bg-white p-5 sm:p-7 lg:sticky lg:top-8"><h2 className="font-display text-2xl">Votre commande <span className="text-ink/35">({cartItems.length})</span></h2><div className="mt-6 divide-y divide-ink/10">{cartItems.map((product) => <div key={product.id} className="flex gap-3 py-4 first:pt-0"><div className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand"><img src={product.image} alt="" className="h-full w-full object-cover" /><span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] text-white">1</span></div><div className="min-w-0 flex-1"><p className="font-display text-[17px] leading-tight">{product.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink/40">{product.scent}</p><button type="button" onClick={() => removeFromCart(product.id)} className="mt-2 text-[9px] uppercase tracking-[0.12em] text-ink/40 underline underline-offset-2">Retirer</button></div><span className="text-[12px]">{formatPrice(product.price)}</span></div>)}</div><div className="mt-4 space-y-3 border-t border-ink/10 pt-5 text-[12px]"><div className="flex justify-between text-ink/55"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-ink/55"><span>Livraison</span><span>{delivery === 0 ? "Offerte" : formatPrice(delivery)}</span></div><div className="flex justify-between border-t border-ink/10 pt-4 text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div></div><div className="mt-7 space-y-3 border-t border-ink/10 pt-5 text-[10px] uppercase tracking-[0.12em] text-ink/45"><p className="flex items-center gap-2"><ShieldCheck size={15} strokeWidth={1.3} className="text-gold" /> Paiement protégé</p><p className="flex items-center gap-2"><Truck size={15} strokeWidth={1.3} className="text-gold" /> Livraison suivie</p></div></aside></main></div>;
}
