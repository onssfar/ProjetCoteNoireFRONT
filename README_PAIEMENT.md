# Intégration du paiement — Côte Noire

La page de paiement du projet de référence a été intégrée au projet Côte Noire.

## Fonctionnalités ajoutées

- Page `/paiement` en 3 étapes : Coordonnées → Livraison → Paiement.
- Livraison standard et express.
- Message cadeau facultatif.
- Paiement par carte bancaire (interface de saisie et validation frontend).
- Option Paiement à la livraison  (interface frontend).
- Résumé de commande avec sous-total, livraison et total.
- Page de confirmation de commande.
- Persistance du panier via `localStorage` afin que le panier soit disponible sur la page de paiement après navigation.
- Devise TND et seuil de livraison offerte à 90 TND.

## Fichiers principaux

- `client/pages/Checkout.tsx` — nouvelle page de paiement.
- `client/lib/cartStorage.ts` — stockage partagé du panier.
- `client/App.tsx` — route `/paiement`.
- `client/pages/Index.tsx` — synchronisation du panier avec le stockage.
- `client/pages/Catalog.tsx` — synchronisation du panier avec le stockage.
- `client/components/StorefrontLayout.tsx` — lien vers le checkout et texte de livraison.
- `client/global.css` — styles des champs du checkout.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir `/paiement` après avoir ajouté un produit au panier.

> Le paiement intégré ici est celui du projet de référence sous forme de checkout frontend. Il ne traite pas encore une transaction bancaire réelle via Stripe, Paiement à la livraison ou une passerelle tunisienne.
