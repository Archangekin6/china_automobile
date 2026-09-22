<script setup>
import { RouterLink } from "vue-router";
import { useSiteStore } from "@/stores/site";
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  Car,
  Ship,
  MessageCircle,
} from "lucide-vue-next";

const site = useSiteStore();
</script>

<template>
  <div class="about-page">
    <!-- En-tête -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
          <RouterLink to="/">Accueil</RouterLink>
          <span class="crumb-sep">/</span>
          <span class="crumb-active">À Propos</span>
        </nav>

        <div class="header-badge">
          <Building2 :size="14" />
          <span>Entreprise & Engagements</span>
        </div>
        <h1 class="page-title">China Automobile : Votre Concessionnaire Spécialisé à Abidjan</h1>
        <p class="page-lead">
          Nous connectons les particuliers et entreprises de Côte d'Ivoire aux constructeurs automobiles les plus innovants du monde, avec une exigence absolue de transparence et de fiabilité.
        </p>
      </div>
    </header>

    <div class="container page-body">
      <!-- Section Histoire & Vision -->
      <section class="story-section">
        <div class="story-grid">
          <div class="story-content">
            <span class="section-tag">Notre Histoire</span>
            <h2>Pionniers de la Mobilité Chinoise Moderne en Côte d'Ivoire</h2>
            <p class="lead-text">
              L'industrie automobile a connu un basculement historique. Aujourd'hui, les constructeurs chinois conçoivent les véhicules les plus technologiquement avancés, les plus sécurisés et les plus efficients du marché mondial.
            </p>
            <p>
              Face à ce constat, <strong>China Automobile</strong> a été fondée avec une mission claire : démocratiser l'accès aux véhicules neufs et occasions récentes haut de gamme des constructeurs chinois de référence (BYD, Chery, Haval, Geely, Changan, Jetour) pour les automobilistes et professionnels ivoiriens.
            </p>
            <p>
              Plutôt que d'acheter à l'aveugle ou de subir des démarches portuaires complexes, nous offrons une structure locale professionnelle basée à Abidjan qui prend en charge l'ensemble de la chaîne : sourcing usine, contrôle technique certifié, acheminement maritime sécurisé, dédouanement officiel et immatriculation.
            </p>
          </div>

          <div class="story-card-box">
            <div class="pillar-box">
              <div class="pillar-icon">
                <ShieldCheck :size="24" />
              </div>
              <div>
                <h4>Transparence Tarifaire Totale</h4>
                <p>Nos tarifs sont affichés clé en main. Aucun frais caché, aucune mauvaise surprise douanière à l'arrivée.</p>
              </div>
            </div>

            <div class="pillar-box">
              <div class="pillar-icon">
                <Award :size="24" />
              </div>
              <div>
                <h4>Qualité & Inspection Certifiée</h4>
                <p>Chaque véhicule fait l'objet d'un rapport de contrôle exhaustif avant embarquement en Chine.</p>
              </div>
            </div>

            <div class="pillar-box">
              <div class="pillar-icon">
                <Users :size="24" />
              </div>
              <div>
                <h4>Accompagnement Physique à Abidjan</h4>
                <p>Une équipe réactive, disponible par téléphone, WhatsApp et en personne pour vous conseiller.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Nos Valeurs et Engagements -->
      <section class="values-section">
        <div class="section-intro text-center">
          <span class="section-tag">Nos Engagements</span>
          <h2>Une Éthique Commerciale Sans Compromis</h2>
          <p class="section-desc">
            Ce qui fait la réputation de China Automobile auprès de nos clients particuliers et flottes d'entreprises.
          </p>
        </div>

        <div class="values-grid">
          <div class="value-card">
            <div class="value-number">01</div>
            <h3>Conformité Légale & Douanière</h3>
            <p>
              Tous nos véhicules sont dédouanés dans les règles strictes de la douane ivoirienne. Nous fournissons tous les reçus de dédouanement et certificats nécessaires à une immatriculation sereine.
            </p>
          </div>

          <div class="value-card">
            <div class="value-number">02</div>
            <h3>Sécurité & Standards Internationaux</h3>
            <p>
              Nous sélectionnons uniquement des modèles répondant aux normes de crash-tests les plus strictes (C-NCAP et Euro NCAP 5 étoiles), dotés d'airbags multiples et d'assistances à la conduite de série.
            </p>
          </div>

          <div class="value-card">
            <div class="value-number">03</div>
            <h3>Adaptation au Contexte Local</h3>
            <p>
              Nos conseillers vous orientent vers des modèles dont la garde au sol, la filtration et les motorisations correspondent exactement à vos trajets (urbains à Abidjan ou trajets intérieurs de la Côte d'Ivoire).
            </p>
          </div>

          <div class="value-card">
            <div class="value-number">04</div>
            <h3>Disponibilité des Pièces & Maintenance</h3>
            <p>
              L'achat d'un véhicule s'inscrit dans la durée. Nous facilitons l'approvisionnement en pièces de rechange d'origine et conseillons nos clients sur les centres de maintenance qualifiés.
            </p>
          </div>
        </div>
      </section>

      <!-- Section Showroom & Contact -->
      <section class="showroom-banner">
        <div class="banner-inner">
          <div class="banner-info">
            <span class="banner-tag">Rencontrez-Nous</span>
            <h2>Venez Découvrir Nos Véhicules à Abidjan</h2>
            <p>
              Vous souhaitez voir un véhicule en stock, échanger sur un projet d'importation sur-mesure ou obtenir une estimation détaillée ? Notre équipe vous accueille avec plaisir.
            </p>

            <div class="banner-contacts">
              <div class="contact-line">
                <MapPin :size="18" class="text-brand" />
                <span>{{ site.settings.address }}</span>
              </div>
              <div class="contact-line">
                <Phone :size="18" class="text-brand" />
                <span>{{ site.settings.phone }}</span>
              </div>
            </div>
          </div>

          <div class="banner-action-col">
            <a
              :href="site.waLink('Bonjour, je souhaite convenir d\'un rendez-vous pour visiter votre showroom à Abidjan.')"
              target="_blank"
              rel="noopener"
              class="btn btn-whatsapp btn-lg w-full"
            >
              <MessageCircle :size="18" />
              <span>Prendre rendez-vous sur WhatsApp</span>
            </a>

            <RouterLink to="/voitures" class="btn btn-outline-white btn-lg w-full">
              <span>Explorer le catalogue en ligne</span>
              <ArrowRight :size="16" />
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background-color: var(--color-slate-50);
  min-height: 85vh;
  padding-bottom: 5rem;
}

/* Header */
.page-header {
  background-color: var(--color-slate-950);
  color: var(--color-white);
  padding: 3.5rem 0 3rem;
  border-bottom: 1px solid var(--color-slate-800);
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-slate-400);
  margin-bottom: 1.25rem;
}

.breadcrumbs a {
  color: var(--color-slate-300);
}

.breadcrumbs a:hover {
  color: var(--color-white);
}

.crumb-sep {
  color: var(--color-slate-600);
}

.crumb-active {
  color: var(--color-brand);
  font-weight: 600;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(220, 38, 38, 0.15);
  color: var(--color-brand);
  border: 1px solid rgba(220, 38, 38, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.85rem;
}

.page-title {
  font-size: clamp(1.8rem, 3.5vw, 2.7rem);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 0.75rem;
}

.page-lead {
  font-size: 1.05rem;
  color: var(--color-slate-300);
  max-width: 64ch;
  line-height: 1.6;
  margin: 0;
}

/* Corps */
.page-body {
  margin-top: 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
}

.section-tag {
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-brand);
  display: block;
  margin-bottom: 0.4rem;
}

/* Histoire */
.story-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 3.5rem;
  align-items: start;
}

.story-content h2 {
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.lead-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-slate-800);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.story-content p {
  font-size: 0.95rem;
  color: var(--color-slate-600);
  line-height: 1.65;
  margin-bottom: 1rem;
}

.story-card-box {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pillar-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-xs);
}

.pillar-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
  border: 1px solid var(--color-brand-border);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.pillar-box h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.35rem;
}

.pillar-box p {
  font-size: 0.86rem;
  color: var(--color-slate-600);
  line-height: 1.5;
  margin: 0;
}

/* Valeurs */
.values-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-lg);
  padding: 3.5rem 2.5rem;
  box-shadow: var(--shadow-xs);
}

.section-intro.text-center {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 3rem;
}

.section-intro h2 {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.5rem;
}

.section-desc {
  font-size: 0.95rem;
  color: var(--color-slate-500);
  line-height: 1.55;
  margin: 0;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.value-card {
  padding: 1.75rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
}

.value-number {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-brand);
  margin-bottom: 0.75rem;
}

.value-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.65rem;
}

.value-card p {
  font-size: 0.88rem;
  color: var(--color-slate-600);
  line-height: 1.6;
  margin: 0;
}

/* Showroom Banner */
.showroom-banner {
  background-color: var(--color-slate-950);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 3.5rem 3rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-slate-800);
}

.banner-inner {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.banner-tag {
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-brand);
  display: block;
  margin-bottom: 0.4rem;
}

.banner-info h2 {
  color: var(--color-white);
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 0.85rem;
  line-height: 1.2;
}

.banner-info p {
  color: var(--color-slate-300);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.75rem;
}

.banner-contacts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-line {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.92rem;
  color: var(--color-slate-200);
}

.banner-action-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.w-full {
  width: 100%;
}

@media (max-width: 980px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .banner-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
