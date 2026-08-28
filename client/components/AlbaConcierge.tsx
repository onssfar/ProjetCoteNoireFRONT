import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, MessageCircle, RefreshCw, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, Product, products } from "@/data/store";

interface Côte NoireConciergeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
}

type AssistantStep = "welcome" | "occasion" | "budget" | "mood" | "result";

type Answers = {
  occasion: string;
  budget: string;
  mood: string;
};

const defaultAnswers: Answers = { occasion: "", budget: "", mood: "" };

const questions = {
  occasion: {
    eyebrow: "01 · L'intention",
    title: "Pour quelle occasion cherchez-vous ?",
    options: [
      { value: "anniversaire", label: "Un anniversaire", icon: "✦" },
      { value: "merci", label: "Dire merci", icon: "♡" },
      { value: "maison", label: "Une nouvelle maison", icon: "⌂" },
      { value: "spontane", label: "Juste comme ça", icon: "✧" },
    ],
  },
  budget: {
    eyebrow: "02 · Le geste",
    title: "Quel budget souhaitez-vous garder ?",
    options: [
      { value: "doux", label: "Moins de 50 TND", icon: "01" },
      { value: "juste", label: "50 à 90 TND", icon: "02" },
      { value: "signature", label: "90 TND et plus", icon: "03" },
    ],
  },
  mood: {
    eyebrow: "03 · L'atmosphère",
    title: "Quelle émotion lui ressemble le plus ?",
    options: [
      { value: "fleuri", label: "Quelque chose de fleuri", icon: "❀" },
      { value: "parfume", label: "Un parfum enveloppant", icon: "◌" },
      { value: "mixte", label: "Un peu des deux", icon: "✦" },
    ],
  },
};

const scoreProduct = (product: Product, answers: Answers) => {
  let score = 0;
  if (answers.mood === "fleuri") score += product.category === "Fleurs" ? 6 : 0;
  if (answers.mood === "parfume") score += ["Bougies", "Diffuseurs"].includes(product.category) ? 6 : 0;
  if (answers.mood === "mixte") score += ["Cadeaux", "Fleurs"].includes(product.category) ? 4 : 2;
  if (answers.occasion === "anniversaire") score += ["Fleurs", "Cadeaux"].includes(product.category) ? 4 : 0;
  if (answers.occasion === "merci") score += ["Cadeaux", "Diffuseurs"].includes(product.category) ? 4 : 0;
  if (answers.occasion === "maison") score += ["Diffuseurs", "Bougies"].includes(product.category) ? 4 : 0;
  if (answers.budget === "doux") score += product.price < 50 ? 5 : product.price < 70 ? 2 : 0;
  if (answers.budget === "juste") score += product.price >= 50 && product.price <= 90 ? 5 : 2;
  if (answers.budget === "signature") score += product.price > 90 ? 6 : 1;
  return score;
};

const buildNote = (answers: Answers, recipient: string) => {
  const name = recipient.trim() || "toi";
  const occasionText = answers.occasion === "anniversaire" ? "pour célébrer cette belle journée" : answers.occasion === "merci" ? "pour te dire merci, simplement" : answers.occasion === "maison" ? "pour accompagner ce nouveau chez-toi" : "pour mettre un peu de douceur dans tes jours";
  return `Pour ${name}, ${occasionText}. Une attention choisie avec soin, à garder près de soi. Avec toute mon affection.`;
};

export default function Côte NoireConcierge({ open, onOpenChange, onAddToCart }: Côte NoireConciergeProps) {
  const [step, setStep] = useState<AssistantStep>("welcome");
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [recipient, setRecipient] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const recommendations = useMemo(() => [...products].sort((a, b) => scoreProduct(b, answers) - scoreProduct(a, answers)).slice(0, 2), [answers]);

  const reset = () => {
    setStep("welcome");
    setAnswers(defaultAnswers);
    setRecipient("");
    setGiftNote("");
  };

  const choose = (key: keyof Answers, value: string) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    setStep(key === "occasion" ? "budget" : key === "budget" ? "mood" : "result");
  };

  if (!open) {
    return <button type="button" onClick={() => onOpenChange(true)} className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-brown px-4 py-3 text-white shadow-[0_8px_30px_rgba(48,39,28,0.2)] transition-all hover:-translate-y-1 hover:bg-ink sm:bottom-7 sm:right-7"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 text-gold"><Sparkles size={15} strokeWidth={1.3} /></span><span className="pr-1 text-[10px] font-semibold uppercase tracking-[0.16em]">Le conseil Côte Noire</span></button>;
  }

  return <>
    <div className="fixed bottom-5 right-5 z-[70] flex w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-[2px] bg-ivory shadow-[0_20px_70px_rgba(48,39,28,0.25)] sm:bottom-7 sm:right-7">
      <div className="flex items-start justify-between bg-brown px-5 py-5 text-white"><div className="flex gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold"><Sparkles size={16} strokeWidth={1.3} /></span><div><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">Concierge intelligent</p><h2 className="mt-1 font-display text-[22px] leading-none">Le conseil Côte Noire</h2><p className="mt-2 text-[11px] text-white/55">Votre goût, notre intuition.</p></div></div><button type="button" aria-label="Fermer le conseil Côte Noire" onClick={() => onOpenChange(false)} className="text-white/55 transition-colors hover:text-white"><X size={18} strokeWidth={1.3} /></button></div>
      <div className="max-h-[min(70vh,570px)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
        {step === "welcome" && <div><div className="mb-6 flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand text-gold"><MessageCircle size={14} strokeWidth={1.4} /></span><p className="max-w-[270px] rounded-br-xl rounded-tl-xl bg-sand/55 px-4 py-3 text-[13px] leading-5 text-ink/70">Bonjour, je suis Côte Noire. Je peux vous aider à trouver une attention qui fera vraiment plaisir.</p></div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Un conseil personnalisé</p><h3 className="mt-3 max-w-[300px] font-display text-[31px] leading-[0.98] tracking-[-0.03em]">Trouvons le cadeau qui fera mouche.</h3><p className="mt-4 text-[12px] leading-6 text-ink/55">Trois questions, une sélection juste et un petit mot prêt à glisser dans votre paquet.</p><button type="button" onClick={() => setStep("occasion")} className="mt-6 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-gold">Commencer le conseil <ArrowRight size={15} strokeWidth={1.3} /></button><p className="mt-4 text-center text-[10px] uppercase tracking-[0.15em] text-ink/35">2 min · sans inscription</p></div>}
        {step !== "welcome" && step !== "result" && <div><div className="mb-6 flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">{questions[step].eyebrow}</p><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/30">{step === "occasion" ? "1" : step === "budget" ? "2" : "3"} / 3</span></div><h3 className="max-w-[300px] font-display text-[30px] leading-[0.98] tracking-[-0.03em]">{questions[step].title}</h3><div className="mt-7 grid gap-2">{questions[step].options.map((option) => <button key={option.value} type="button" onClick={() => choose(step as keyof Answers, option.value)} className="group flex items-center gap-4 border border-ink/10 px-4 py-3.5 text-left transition-colors hover:border-gold hover:bg-sand/35"><span className="flex h-8 w-8 items-center justify-center bg-sand/60 font-display text-base text-gold">{option.icon}</span><span className="flex-1 text-[12px] text-ink/75">{option.label}</span><ChevronRight size={15} strokeWidth={1.3} className="text-ink/25 transition-transform group-hover:translate-x-1 group-hover:text-gold" /></button>)}</div></div>}
        {step === "result" && <div><div className="mb-5 flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand text-gold"><Sparkles size={14} strokeWidth={1.4} /></span><div><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">Votre sélection Côte Noire</p><h3 className="mt-2 font-display text-[29px] leading-[0.98] tracking-[-0.03em]">Deux idées qui ont du sens.</h3></div></div><div className="grid gap-3">{recommendations.map((product) => <div key={product.id} className="flex gap-3 border border-ink/10 p-2.5"><img src={product.image} alt="" className="h-[76px] w-[64px] object-cover" /><div className="min-w-0 flex-1 py-0.5"><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gold">{product.category}</p><p className="mt-1 font-display text-[18px] leading-tight">{product.name}</p><div className="mt-2 flex items-center justify-between gap-2"><span className="text-[12px]">{formatPrice(product.price)}</span>{onAddToCart ? <button type="button" onClick={() => { onAddToCart(product); onOpenChange(false); }} className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/60 hover:text-gold">Ajouter <PlusIcon /></button> : <Link to={`/collections/${product.category.toLowerCase()}`} onClick={() => onOpenChange(false)} className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/60 hover:text-gold">Voir <ArrowRight size={12} strokeWidth={1.3} /></Link>}</div></div></div>)}</div><div className="mt-6 border-t border-ink/10 pt-5"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">Le mot qui accompagne</p><div className="mt-3 flex gap-2"><input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="Prénom (facultatif)" className="min-w-0 flex-1 border-b border-ink/15 bg-transparent px-0 py-2 text-[12px] outline-none placeholder:text-ink/30 focus:border-gold" /><button type="button" onClick={() => setGiftNote(buildNote(answers, recipient))} className="shrink-0 border-b border-ink py-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-ink hover:border-gold hover:text-gold">Générer</button></div>{giftNote && <textarea value={giftNote} onChange={(event) => setGiftNote(event.target.value)} rows={3} aria-label="Votre mot personnalisé" className="mt-3 w-full resize-none bg-sand/35 p-3 text-[12px] leading-5 text-ink/65 outline-none ring-0" />}</div><button type="button" onClick={reset} className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/40 hover:text-ink"><RefreshCw size={13} strokeWidth={1.3} /> Recommencer</button></div>}
      </div>
    </div>
  </>;
}

function PlusIcon() {
  return <span className="text-[13px] leading-none">+</span>;
}
