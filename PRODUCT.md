# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

L'utilisateur prioritaire est un acheteur particulier en Côte d'Ivoire. Il consulte les véhicules chinois proposés par China Automobile, compare les modèles et les prix disponibles, vérifie le statut d'un véhicule, puis contacte l'équipe pour obtenir des informations, un devis ou un rappel lorsqu'un tel parcours est proposé.

## Product Purpose

China Automobile est une entreprise automobile qui vend des véhicules de marques chinoises en Côte d'Ivoire. Le site permet de découvrir les véhicules disponibles, consulter leurs caractéristiques, voir les prix lorsqu'ils sont renseignés, comparer les modèles, vérifier leur statut réel et contacter directement l'entreprise. La réussite se mesure à la capacité d'un visiteur à trouver un véhicule pertinent et à demander rapidement des informations commerciales.

## Positioning

La proposition de valeur repose sur la vente de véhicules chinois, la transparence des informations disponibles, une présentation professionnelle des modèles et une relation directe avec le client en Côte d'Ivoire.

## Operating Context

- Le parcours principal se déroule sur mobile et en français.
- Le visiteur peut rechercher et filtrer le catalogue par mot-clé, marque, carburant, transmission, prix et tri.
- Le visiteur peut consulter les marques, les informations commerciales de l'entreprise et les coordonnées du showroom.
- Les demandes d'informations passent par un formulaire, le téléphone ou WhatsApp; l'équipe reprend ensuite contact avec le client.
- Lorsqu'il existe dans le parcours, le devis ou le rappel constitue une demande commerciale, sans paiement en ligne.
- L'administration authentifiée gère les véhicules, demandes commerciales, marques, réglages de la vitrine et témoignages.

## Capabilities and Constraints

- Application Vue 3 avec Vite, Vue Router, Pinia et Supabase.
- Routes publiques pour l'accueil, le catalogue, le détail d'un véhicule, les marques, les services, l'entreprise et le contact.
- Espace d'administration protégé par authentification.
- Aucun paiement en ligne n'est proposé actuellement; le contact humain reste le canal de finalisation commerciale.
- Le site doit présenter uniquement les activités et informations commerciales réellement proposées par China Automobile.
- Les données client et l'espace d'administration doivent rester protégés.
- Les évolutions doivent conserver un parcours simple, en français, responsive et utilisable sur téléphone.

## Brand Commitments

- Le nom China Automobile et l'ancrage à Abidjan, Côte d'Ivoire, sont à préserver.
- La communication doit rester professionnelle, claire et orientée vente automobile.
- Les informations affichées sur les véhicules, leurs prix et leur statut doivent être exactes et maintenues à jour.
- Les canaux de contact à préserver sont le téléphone, WhatsApp et le formulaire de demande commerciale.

## Evidence on Hand

- Catalogue et détails de véhicules connectés aux données Supabase: `src/views/CatalogView.vue`, `src/views/CarDetailView.vue`.
- Parcours de recherche et de demande depuis l'accueil: `src/views/HomeView.vue`.
- Formulaire de contact qui enregistre les demandes dans Supabase: `src/views/ContactView.vue`.
- Gestion de contenu et de demandes dans l'espace admin: `src/views/admin/`.
- Coordonnées et contenu de vitrine configurables via `src/stores/site.js`.
- Les témoignages, notes et éléments de preuve doivent rester fondés sur des données réelles; aucune preuve commerciale supplémentaire ne doit être inventée.

## Product Principles

- Rendre la recherche d'un véhicule rapide et compréhensible.
- Donner des informations claires avant de demander un contact.
- Maintenir une relation commerciale directe pour les décisions d'achat.
- Traiter les données client et l'administration avec discrétion.
- Concevoir d'abord pour un usage mobile en français.

## Accessibility & Inclusion

Les parcours publics doivent rester lisibles, navigables au clavier et utilisables sur mobile. Les formulaires, contrôles de recherche et filtres doivent conserver des libellés accessibles et des états d'erreur compréhensibles.
