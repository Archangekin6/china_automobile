<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useSiteStore } from "@/stores/site";
import {
  Wrench,
  Car,
  Ship,
  FileCheck2,
  ShieldCheck,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calculator,
} from "lucide-vue-next";

const site = useSiteStore();

// Simulateur de devis express d'importation
const simBrand = ref("BYD");
const simType = ref("SUV");
const simBudget = ref("10-15m");
const simYear = ref("Neuf (2024)");

function getSimulationWhatsAppLink() {
  const text = `Bonjour China Automobile, je souhaite obtenir une estimation pour l'importation d'un véhicule :
- Type : ${simType.value}
- Marque souhaitée : ${simBrand.value}
- État : ${simYear.value}
- Budget indicatif : ${simBudget.value} FCFA.
Pouvez-vous me proposer les options correspondantes ?`;
  return site.waLink(text);
}
</script>

<template>
  <div class="services-page">
    <!-- En-tête -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
          <RouterLink to="/">Accueil</RouterLink>
          <span class="crumb-sep">/</span>
          <span class="crumb-active">Services & Importation</span>
        </nav>

        <div class="header-badge">
          <Wrench :size="14" />
          <span>Prestations Clé en Main</span>
        </div>
        <h1 class="page-title">Nos Solutions d'Importation & Vente Automobile</h1>
        <p class="page-lead">
          De la sélection de votre véhicule auprès des concessionnaires agréés en Chine jusqu'à la remise des clés et de la carte grise à Abidjan : nous prenons en charge l'intégralité du processus sans intermédiaire.
        </p>
      </div>
    </header>

    <div class="container page-body">
      <!-- Grille des 6 Services Principaux -->
      <section class="services-grid-section">
        <div class="section-intro">
          <span class="section-tag">Expertise Complète</span>
          <h2>Un Accompagnement Professionnel de A à Z</h2>
          <p class="section-desc">
            Chaque étape est sécurisée pour vous garantir un véhicule irréprochable au tarif le plus juste.
          </p>
        </div>

        <div class="services-cards-grid">
          <!-- Service 1 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <Car :size="24" />
            </div>
            <h3>Vente de Véhicules en Stock</h3>
            <p>
              Consultez notre parc de véhicules déjà arrivés à Abidjan. Disponibilité immédiate, visite physique sur notre showroom, essai routier et transaction rapide sans délai d'acheminement.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Disponibilité sous 24 à 48 heures</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Véhicules visibles et testables sur place</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Papiers et dédouanement déjà validés</li>
            </ul>
          </div>

          <!-- Service 2 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <Ship :size="24" />
            </div>
            <h3>Importation Directe Sur-Mesure</h3>
            <p>
              Vous souhaitez une finition spécifique, une couleur d'intérieur particulière ou le tout dernier modèle hybride rechargeable ? Nous passons commande directement auprès de nos partenaires en Chine.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Configuration personnalisée d'usine</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Accès à tous les constructeurs chinois</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Tarifs constructeurs sans marges abusives</li>
            </ul>
          </div>

          <!-- Service 3 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <FileCheck2 :size="24" />
            </div>
            <h3>Dédouanement Portuaire Intégral</h3>
            <p>
              Fini les tracasseries douanières et les mauvaises surprises au Port Autonome d'Abidjan. Nous nous chargeons de l'ensemble des taxes, droits de douane et déclarations officielles.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Transparence tarifaire totale dès le devis</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Aucune taxe supplémentaire imprévue</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Traitement rapide par nos transitaires agréés</li>
            </ul>
          </div>

          <!-- Service 4 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <ShieldCheck :size="24" />
            </div>
            <h3>Inspection Technique Pré-Départ</h3>
            <p>
              Avant tout embarquement maritime en Chine, nos experts mandatés réalisent un audit physique, mécanique et électronique complet avec rapport photos et vidéos haute résolution.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Contrôle moteur, batterie et carrosserie</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Dossier photographique remis à l'acheteur</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Validation client requise avant départ</li>
            </ul>
          </div>

          <!-- Service 5 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <Sparkles :size="24" />
            </div>
            <h3>Immatriculation & Clé en Main</h3>
            <p>
              Nous vous remettons votre véhicule prêt à circuler avec toutes les pièces administratives obligatoires en Côte d'Ivoire : carte grise, pose des plaques et certificat de conformité.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Démarches auprès du Ministère des Transports</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Préparation esthétique et lavage complet</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Remise des clés officielle en showroom</li>
            </ul>
          </div>

          <!-- Service 6 -->
          <div class="service-detail-card">
            <div class="service-icon-wrap">
              <Wrench :size="24" />
            </div>
            <h3>Conseil Technique & Pièces de Rechange</h3>
            <p>
              Nous accompagnons nos clients sur la durée : approvisionnement rapide en pièces d'origine (filtres, freins, optiques, électronique) et mise en relation avec des techniciens qualifiés.
            </p>
            <ul class="service-perks">
              <li><CheckCircle2 :size="15" class="perk-icon" /> Accès aux catalogues de pièces d'origine</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Conseils d'entretien préventif</li>
              <li><CheckCircle2 :size="15" class="perk-icon" /> Disponibilité de notre service après-vente</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Chronologie Logistique : Le parcours d'une commande -->
      <section class="timeline-section">
        <div class="section-intro text-center">
          <span class="section-tag">Transparence & Suivi</span>
          <h2>Le Parcours d'une Commande d'Importation</h2>
          <p class="section-desc">
            De la signature de votre bon de commande jusqu'à votre première virée sur les boulevards d'Abidjan.
          </p>
        </div>

        <div class="timeline-steps">
          <div class="timeline-step">
            <div class="step-badge">01</div>
            <h4>Sélection & Devis Ferme</h4>
            <p>Définition du modèle, validation du prix global clé en main et formalisation du contrat.</p>
          </div>

          <div class="timeline-step">
            <div class="step-badge">02</div>
            <h4>Acquisition & Contrôle</h4>
            <p>Achat du véhicule en Chine, audit technique certifié et rapport photographique remis au client.</p>
          </div>

          <div class="timeline-step">
            <div class="step-badge">03</div>
            <h4>Fret Maritime Sécurisé</h4>
            <p>Embarquement en conteneur sécurisé ou navire roulier (Ro-Ro) avec suivi régulier de la traversée.</p>
          </div>

          <div class="timeline-step">
            <div class="step-badge">04</div>
            <h4>Dédouanement Portuaire</h4>
            <p>Prise en charge au port d'Abidjan, dédouanement officiel et transfert sécurisé vers notre parc.</p>
          </div>

          <div class="timeline-step">
            <div class="step-badge">05</div>
            <h4>Livraison Clé en Main</h4>
            <p>Immatriculation, préparation esthétique finale et remise des clés avec tous les documents officiels.</p>
          </div>
        </div>
      </section>

      <!-- Module de Simulation de Devis Express -->
      <section class="simulation-section">
        <div class="sim-wrapper">
          <div class="sim-info">
            <div class="sim-badge">
              <Calculator :size="15" />
              <span>Estimation Rapide</span>
            </div>
            <h2>Configurez Votre Demande d'Importation</h2>
            <p>
              Sélectionnez vos critères de base et échangez instantanément avec l'un de nos conseillers commerciaux pour recevoir une sélection de modèles et une tarification détaillée.
            </p>
            <div class="sim-phone-call">
              <Phone :size="18" class="text-brand" />
              <span>Ou contactez-nous par téléphone : <strong>{{ site.settings.phone }}</strong></span>
            </div>
          </div>

          <div class="sim-form-card">
            <div class="form-group">
              <label class="form-label">Type de véhicule</label>
              <select v-model="simType" class="form-select">
                <option value="SUV Familial">SUV Familial (5 à 7 places)</option>
                <option value="SUV Compact">SUV Compact Urbain</option>
                <option value="Berline Élégante">Berline Routière</option>
                <option value="Véhicule 100% Électrique">100% Électrique (EV)</option>
                <option value="Pick-up Utilitaire">Pick-up / Utilitaire</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Constructeur préféré</label>
              <select v-model="simBrand" class="form-select">
                <option value="BYD">BYD (Leader mondial électrique & hybride)</option>
                <option value="Chery">Chery (Gamme Tiggo réputée)</option>
                <option value="Haval">Haval (Spécialiste SUV Great Wall)</option>
                <option value="Geely">Geely (Technologie groupe Volvo)</option>
                <option value="Changan">Changan (Design & confort)</option>
                <option value="Autre constructeur">Autre constructeur chinois</option>
              </select>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">État du véhicule</label>
                <select v-model="simYear" class="form-select">
                  <option value="Neuf (2024)">Neuf (Année en cours)</option>
                  <option value="Occasion récente (2021-2023)">Occasion récente certifiée</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Budget indicatif (FCFA)</label>
                <select v-model="simBudget" class="form-select">
                  <option value="Moins de 10 millions">Moins de 10 millions</option>
                  <option value="10 à 15 millions">10 à 15 millions</option>
                  <option value="15 à 22 millions">15 à 22 millions</option>
                  <option value="Plus de 22 millions">Plus de 22 millions</option>
                </select>
              </div>
            </div>

            <a
              :href="getSimulationWhatsAppLink()"
              target="_blank"
              rel="noopener"
              class="btn btn-whatsapp w-full btn-lg sim-btn"
            >
              <MessageCircle :size="18" />
              <span>Recevoir une proposition sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.services-page {
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

.section-intro {
  margin-bottom: 2.5rem;
}

.section-intro.text-center {
  text-align: center;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
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

.section-intro h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
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

/* Grille 6 cartes */
.services-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.service-detail-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.service-detail-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-slate-300);
  box-shadow: var(--shadow-md);
}

.service-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
  display: grid;
  place-items: center;
  margin-bottom: 1.25rem;
  border: 1px solid var(--color-brand-border);
}

.service-detail-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.75rem;
}

.service-detail-card p {
  font-size: 0.9rem;
  color: var(--color-slate-600);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.service-perks {
  list-style: none;
  padding: 0;
  margin: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-slate-100);
}

.service-perks li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: var(--color-slate-700);
  font-weight: 500;
}

.perk-icon {
  color: var(--color-success);
  flex-shrink: 0;
}

/* Timeline */
.timeline-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-lg);
  padding: 3.5rem 2.5rem;
  box-shadow: var(--shadow-xs);
}

.timeline-steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  position: relative;
}

.step-badge {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-brand);
  background-color: var(--color-slate-50);
  border: 2px solid var(--color-brand);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
}

.timeline-step h4 {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.4rem;
}

.timeline-step p {
  font-size: 0.84rem;
  color: var(--color-slate-500);
  line-height: 1.5;
  margin: 0;
}

/* Simulateur */
.simulation-section {
  background-color: var(--color-slate-950);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  color: var(--color-white);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-slate-800);
}

.sim-wrapper {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.sim-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(220, 38, 38, 0.2);
  color: var(--color-brand);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 700;
  margin-bottom: 0.85rem;
}

.sim-info h2 {
  color: var(--color-white);
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.sim-info p {
  color: var(--color-slate-300);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.75rem;
}

.sim-phone-call {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: var(--color-slate-300);
}

.sim-form-card {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 2rem;
  color: var(--color-slate-900);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  box-shadow: var(--shadow-lg);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.w-full {
  width: 100%;
}

.sim-btn {
  margin-top: 0.5rem;
}

@media (max-width: 980px) {
  .timeline-steps {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .sim-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .services-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
