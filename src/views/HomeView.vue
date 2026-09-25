<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/stores/site";
import CarCard from "@/components/CarCard.vue";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Ship,
  FileCheck2,
  Headphones,
  CheckCircle2,
  Star,
  Car,
  ChevronRight,
  Sparkles,
} from "lucide-vue-next";

const router = useRouter();
const site = useSiteStore();
const s = computed(() => site.settings);

const query = ref("");
const latest = ref([]);
const budget = ref([]);
const brands = ref([]);
const reviews = ref([]);
const loading = ref(true);
const loadError = ref("");

const money = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

// Image de fond par défaut automobile premium si non configurée dans l'admin
const defaultHeroBg =
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=80";

const heroStyle = computed(() => {
  const bgImg = s.value.hero_image || defaultHeroBg;
  return {
    backgroundImage: `linear-gradient(90deg, rgba(11, 15, 21, 0.94) 0%, rgba(11, 15, 21, 0.82) 50%, rgba(11, 15, 21, 0.45) 100%), url('${bgImg}')`,
  };
});

function search(text = query.value) {
  if (text.trim()) {
    router.push({ path: "/voitures", query: { q: text.trim() } });
  } else {
    router.push({ path: "/voitures" });
  }
}

async function loadHomeData() {
  loading.value = true;
  loadError.value = "";
  try {
    const results = await Promise.all([
      supabase
        .from("cars")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("cars")
        .select("*")
        .eq("available", true)
        .lte("price", s.value.budget_max || 10000000)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("brands").select("*").order("name"),
      supabase
        .from("testimonials")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false }),
    ]);

    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;

    const [l, b, br, t] = results;
    latest.value = l.data || [];
    budget.value = b.data || [];
    brands.value = br.data || [];
    reviews.value = t.data || [];
  } catch (err) {
    console.error(
      "Erreur lors du chargement des données de la page d'accueil :",
      err,
    );
    loadError.value =
      "Les contenus de la page d'accueil ne sont pas disponibles pour le moment. Réessayez dans quelques instants.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadHomeData);
</script>

<template>
  <div class="home-page">
    <!-- Hero Section Professionnelle -->
    <section class="hero-section" :style="heroStyle">
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-pill">Vente automobile</span>
            <span class="hero-badge-text">Véhicules proposés • Abidjan</span>
          </div>

          <h1 class="hero-title">{{ s.hero_title }}</h1>
          <p class="hero-subtitle">{{ s.hero_subtitle }}</p>

          <!-- Barre de recherche rapide intégrée -->
          <form class="hero-search-box" @submit.prevent="search()">
            <div class="search-input-wrapper">
              <Search :size="18" class="search-icon" />
              <input
                v-model="query"
                type="text"
                placeholder="Marque ou modèle (ex: BYD Song, Haval H6, Chery Tiggo...)"
                aria-label="Rechercher un véhicule"
              />
            </div>
            <button type="submit" class="btn btn-primary search-btn">
              <span>Rechercher</span>
              <ArrowRight :size="16" />
            </button>
          </form>

          <!-- Raccourcis de recherche populaires -->
          <div class="quick-tags">
            <span class="quick-label">Rechercher par marque :</span>
            <button type="button" class="tag-btn" @click="search('BYD')">
              BYD
            </button>
            <button type="button" class="tag-btn" @click="search('Chery')">
              Chery
            </button>
            <button type="button" class="tag-btn" @click="search('Haval')">
              Haval
            </button>
            <button type="button" class="tag-btn" @click="search('Geely')">
              Geely
            </button>
          </div>
        </div>

        <!-- 3 Piliers de Confiance en bas de Hero -->
        <div class="hero-features-strip">
          <div class="hero-feature-item">
            <ShieldCheck :size="20" class="feature-icon" />
            <div>
              <strong>Véhicules Inspectés</strong>
              <span>Contrôle technique certifié</span>
            </div>
          </div>
          <div class="hero-feature-item">
            <Ship :size="20" class="feature-icon" />
            <div>
              <strong>Disponibilité claire</strong>
              <span>Statut réel des véhicules proposés</span>
            </div>
          </div>
          <div class="hero-feature-item">
            <FileCheck2 :size="20" class="feature-icon" />
            <div>
              <strong>Conseil direct</strong>
              <span>Une équipe pour vos questions commerciales</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="loadError" class="container home-error" role="alert">
      <p>{{ loadError }}</p>
      <button
        type="button"
        class="btn btn-sm btn-outline"
        @click="loadHomeData"
      >
        Réessayer
      </button>
    </div>

    <!-- Dernières Voitures Ajoutées -->
    <section v-if="s.show_latest && latest.length" class="section-block">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-tag">Véhicules récemment ajoutés</div>
            <h2 class="section-title">{{ s.latest_title }}</h2>
            <p v-if="s.latest_subtitle" class="section-sub">
              {{ s.latest_subtitle }}
            </p>
          </div>
          <RouterLink to="/voitures" class="section-link">
            <span>Consulter tout le catalogue</span>
            <ArrowRight :size="16" />
          </RouterLink>
        </div>

        <div class="cars-grid">
          <CarCard v-for="car in latest" :key="car.id" :car="car" />
        </div>
      </div>
    </section>

    <!-- Sélection Petits Budgets -->
    <section
      v-if="s.show_budget && budget.length"
      class="section-block section-alt"
    >
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-tag">Opportunités tarifaires</div>
            <h2 class="section-title">
              Véhicules à moins de {{ money(s.budget_max) }}
            </h2>
            <p class="section-sub">
              Sélection de véhicules économiques avec prix et disponibilité
              affichés lorsqu'ils sont renseignés.
            </p>
          </div>
          <RouterLink to="/voitures" class="section-link">
            <span>Tous les véhicules</span>
            <ArrowRight :size="16" />
          </RouterLink>
        </div>

        <div class="cars-grid">
          <CarCard v-for="car in budget" :key="car.id" :car="car" />
        </div>
      </div>
    </section>

    <!-- Section Marques Disponibles -->
    <section
      v-if="s.show_brands && brands.length"
      id="marques"
      class="section-block"
    >
      <div class="container">
        <div class="section-head-center">
          <div class="section-tag">Constructeurs Partenaires</div>
          <h2 class="section-title">{{ s.brands_title }}</h2>
          <p class="section-sub max-w-ch">
            Consultez les marques enregistrées dans notre catalogue et les
            véhicules qui leur sont associés.
          </p>
        </div>

        <div class="brands-grid">
          <button
            v-for="b in brands"
            :key="b.id"
            type="button"
            class="brand-card"
            @click="search(b.name)"
            :title="`Découvrir les véhicules ${b.name}`"
          >
            <div class="brand-logo-wrap">
              <img
                v-if="b.logo_url"
                :src="b.logo_url"
                :alt="`Logo ${b.name}`"
                loading="lazy"
              />
              <Car v-else :size="32" class="brand-placeholder-icon" />
            </div>
            <span class="brand-name-label">{{ b.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section Vente et Informations China Automobile -->
    <section id="services" class="section-block section-alt">
      <div class="container">
        <div class="section-head-center">
          <div class="section-tag">Vente automobile</div>
          <h2 class="section-title">Trouvez le véhicule qui vous correspond</h2>
          <p class="section-sub max-w-ch">
            Découvrez les modèles proposés, comparez leurs caractéristiques et
            contactez notre équipe pour obtenir les informations disponibles.
          </p>
        </div>

        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon-box">
              <Car :size="24" />
            </div>
            <h3 class="service-title">Vente de Véhicules en Stock</h3>
            <p class="service-desc">
              Consultez notre parc de véhicules déjà disponibles à Abidjan,
              prêts à partir avec visite et essai sur rendez-vous.
            </p>
          </div>

          <div class="service-card">
            <div class="service-icon-box">
              <Ship :size="24" />
            </div>
            <h3 class="service-title">Caractéristiques détaillées</h3>
            <p class="service-desc">
              Consultez les informations techniques disponibles pour chaque
              modèle avant de prendre contact.
            </p>
          </div>

          <div class="service-card">
            <div class="service-icon-box">
              <FileCheck2 :size="24" />
            </div>
            <h3 class="service-title">Prix et disponibilité</h3>
            <p class="service-desc">
              Vérifiez le prix lorsqu'il est renseigné et le statut réel du
              véhicule dans le catalogue.
            </p>
          </div>

          <div class="service-card">
            <div class="service-icon-box">
              <ShieldCheck :size="24" />
            </div>
            <h3 class="service-title">Conseil avant achat</h3>
            <p class="service-desc">
              Posez vos questions à China Automobile avant de choisir votre
              prochain véhicule.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Parcours d'achat (Comment ça marche) -->
    <section
      v-if="s.show_steps && s.steps && s.steps.length"
      id="comment-commander"
      class="section-block"
    >
      <div class="container">
        <div class="section-head-center">
          <div class="section-tag">Simplicité & Transparence</div>
          <h2 class="section-title">{{ s.steps_title }}</h2>
          <p class="section-sub max-w-ch">
            Une procédure claire et sécurisée sans aucun paiement en ligne :
            notre équipe vous guide étape par étape.
          </p>
        </div>

        <div class="steps-container">
          <div v-for="(step, i) in s.steps" :key="i" class="step-item">
            <div class="step-num-badge">0{{ i + 1 }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section À Propos & Présentation de l'Entreprise -->
    <section id="a-propos" class="section-block section-alt">
      <div class="container about-wrapper">
        <div class="about-text">
          <div class="section-tag">Qui sommes-nous ?</div>
          <h2 class="section-title">
            China Automobile, votre partenaire automobile à Abidjan
          </h2>
          <p class="about-lead">
            China Automobile vous aide à découvrir des véhicules et à comparer
            les informations disponibles avant votre achat.
          </p>
          <p class="about-body">
            Basé à Abidjan, <strong>China Automobile</strong> a été créé pour
            offrir aux automobilistes et professionnels ivoiriens une
            présentation claire des véhicules présents dans son catalogue.
          </p>
          <div class="about-checklist">
            <div class="check-entry">
              <CheckCircle2 :size="18" class="check-icon" />
              <span
                >Transparence tarifaire intégrale : prix affichés sans frais
                cachés</span
              >
            </div>
            <div class="check-entry">
              <CheckCircle2 :size="18" class="check-icon" />
              <span
                >Assistance pour les démarches d'immatriculation et carte
                grise</span
              >
            </div>
            <div class="check-entry">
              <CheckCircle2 :size="18" class="check-icon" />
              <span
                >Interlocuteurs professionnels à votre écoute à Abidjan</span
              >
            </div>
          </div>
        </div>

        <div class="about-card-box">
          <div class="about-stat-card">
            <div class="stat-header">
              <Sparkles :size="24" class="stat-icon" />
              <span class="stat-badge">Garantie & Clarté</span>
            </div>
            <h3>Commandez votre véhicule en toute sérénité</h3>
            <p>
              Prenez contact avec notre conseiller pour obtenir une fiche
              détaillée ou lancer une recherche personnalisée selon votre
              budget.
            </p>
            <a
              :href="
                site.waLink(
                  'Bonjour, je souhaite échanger avec un conseiller China Automobile.',
                )
              "
              target="_blank"
              rel="noopener"
              class="btn btn-whatsapp w-full"
            >
              Échanger avec notre conseiller
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Témoignages Clients Réels -->
    <section v-if="s.show_testimonials && reviews.length" class="section-block">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-tag">Retours d'expérience</div>
            <h2 class="section-title">{{ s.testimonials_title }}</h2>
            <p v-if="s.testimonials_subtitle" class="section-sub">
              {{ s.testimonials_subtitle }}
            </p>
          </div>

          <!-- Notes globales si renseignées -->
          <div
            v-if="s.google_rating || s.facebook_rating"
            class="ratings-pills"
          >
            <div v-if="s.google_rating" class="rating-pill">
              <Star :size="14" class="star-icon" fill="currentColor" />
              <span
                >Google : <strong>{{ s.google_rating }}/5</strong></span
              >
            </div>
            <div v-if="s.facebook_rating" class="rating-pill">
              <Star :size="14" class="star-icon" fill="currentColor" />
              <span
                >Facebook : <strong>{{ s.facebook_rating }}/5</strong></span
              >
            </div>
          </div>
        </div>

        <div class="reviews-grid">
          <div v-for="r in reviews" :key="r.id" class="review-card">
            <div class="review-stars">
              <Star
                v-for="n in 5"
                :key="n"
                :size="14"
                class="star-icon"
                fill="currentColor"
              />
            </div>
            <blockquote class="review-quote">"{{ r.content }}"</blockquote>
            <div class="review-author">
              <img
                v-if="r.photo_url"
                :src="r.photo_url"
                :alt="r.author"
                class="author-avatar"
                loading="lazy"
              />
              <div v-else class="author-avatar-fallback">
                {{ r.author ? r.author.charAt(0).toUpperCase() : "C" }}
              </div>
              <div>
                <span class="author-name">{{ r.author }}</span>
                <span class="author-badge">Client vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

/* Hero Section */
.hero-section {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: var(--color-white);
  padding: 5.5rem 0 3.5rem;
}

.hero-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero-content {
  max-width: 720px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background-color: rgba(17, 24, 39, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.35rem 0.85rem 0.35rem 0.45rem;
  border-radius: var(--radius-full);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
}

.hero-badge-pill {
  background-color: var(--color-brand);
  color: var(--color-white);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
}

.hero-badge-text {
  font-size: 0.82rem;
  color: var(--color-slate-200);
  font-weight: 500;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  color: var(--color-white);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
  text-wrap: balance;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-slate-300);
  line-height: 1.55;
  margin-bottom: 2rem;
  max-width: 54ch;
}

/* Barre de recherche intégrée */
.hero-search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-white);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  max-width: 650px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding-left: 0.75rem;
}

.search-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.search-input-wrapper input {
  width: 100%;
  border: none;
  font-size: 0.95rem;
  color: var(--color-slate-900);
  padding: 0.6rem 0;
}

.search-input-wrapper input:focus {
  outline: none;
}

.search-btn {
  flex-shrink: 0;
}

/* Tags de recherche rapide */
.quick-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.25rem;
  font-size: 0.82rem;
}

.quick-label {
  color: var(--color-slate-400);
}

.tag-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  backdrop-filter: blur(4px);
}

.tag-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: var(--color-white);
}

/* Bandeau des 3 fonctionnalités Hero */
.hero-features-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.feature-icon {
  color: var(--color-brand);
  flex-shrink: 0;
}

.hero-feature-item strong {
  display: block;
  font-size: 0.95rem;
  color: var(--color-white);
}

.hero-feature-item span {
  display: block;
  font-size: 0.8rem;
  color: var(--color-slate-400);
}

/* Blocs généraux */
.section-block {
  padding: 5rem 0;
}

.section-alt {
  background-color: var(--color-slate-50);
  border-top: 1px solid var(--color-slate-200);
  border-bottom: 1px solid var(--color-slate-200);
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.section-head-center {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-tag {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-brand);
  margin-bottom: 0.4rem;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--color-slate-950);
}

.section-sub {
  color: var(--color-slate-500);
  font-size: 0.98rem;
  margin-top: 0.4rem;
  margin-bottom: 0;
}

.max-w-ch {
  max-width: 58ch;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-brand);
  font-weight: 700;
  font-size: 0.92rem;
  white-space: nowrap;
  transition: gap 0.15s ease;
}

.section-link:hover {
  color: var(--color-brand-hover);
  gap: 0.75rem;
}

/* Grilles */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
}

/* Section Marques */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem;
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.brand-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-slate-400);
  box-shadow: var(--shadow-sm);
}

.brand-logo-wrap {
  width: 70px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.brand-logo-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(30%);
  transition: filter 0.2s ease;
}

.brand-card:hover .brand-logo-wrap img {
  filter: grayscale(0%);
}

.brand-placeholder-icon {
  color: var(--color-slate-400);
}

.brand-name-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-slate-800);
}

/* Services */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.75rem;
}

.service-card {
  background-color: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-slate-200);
  box-shadow: var(--shadow-xs);
  transition: all 0.2s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-slate-300);
  box-shadow: var(--shadow-md);
}

.service-icon-box {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
  display: grid;
  place-items: center;
  margin-bottom: 1.25rem;
  border: 1px solid var(--color-brand-border);
}

.service-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.65rem;
}

.service-desc {
  font-size: 0.9rem;
  color: var(--color-slate-600);
  line-height: 1.55;
  margin: 0;
}

/* Processus étapes */
.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.step-item {
  position: relative;
  background-color: var(--color-white);
  padding: 2.25rem 1.75rem 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-slate-200);
  border-top: 3px solid var(--color-brand);
  box-shadow: var(--shadow-xs);
}

.step-num-badge {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-brand);
  margin-bottom: 0.75rem;
}

.step-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.65rem;
}

.step-desc {
  font-size: 0.9rem;
  color: var(--color-slate-600);
  line-height: 1.55;
  margin: 0;
}

/* À propos */
.about-wrapper {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.about-lead {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-slate-800);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.about-body {
  font-size: 0.95rem;
  color: var(--color-slate-600);
  line-height: 1.65;
  margin-bottom: 1.5rem;
}

.about-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.check-entry {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.92rem;
  color: var(--color-slate-800);
  font-weight: 500;
}

.check-icon {
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 2px;
}

.about-card-box {
  background-color: var(--color-slate-900);
  color: var(--color-white);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-slate-800);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.stat-icon {
  color: var(--color-brand);
}

.stat-badge {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--color-slate-300);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
}

.about-stat-card h3 {
  color: var(--color-white);
  font-size: 1.35rem;
  margin-bottom: 0.85rem;
}

.about-stat-card p {
  color: var(--color-slate-300);
  font-size: 0.92rem;
  line-height: 1.55;
  margin-bottom: 1.75rem;
}

/* Témoignages */
.ratings-pills {
  display: flex;
  gap: 0.75rem;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--color-slate-100);
  border: 1px solid var(--color-slate-200);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: var(--color-slate-700);
}

.star-icon {
  color: #f59e0b;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
}

.review-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
}

.review-stars {
  display: flex;
  gap: 3px;
  margin-bottom: 1rem;
}

.review-quote {
  font-size: 0.92rem;
  color: var(--color-slate-700);
  line-height: 1.6;
  margin: 0 0 1.5rem;
  flex: 1;
  font-style: normal;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-slate-200);
}

.author-avatar-fallback {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-slate-800);
  color: var(--color-white);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1rem;
}

.author-name {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-slate-900);
}

.author-badge {
  display: block;
  font-size: 0.75rem;
  color: var(--color-success);
  font-weight: 600;
}

/* Responsiveness */
@media (max-width: 860px) {
  .hero-section {
    padding: 3.5rem 0 2.5rem;
  }

  .hero-search-box {
    flex-direction: column;
    padding: 0.75rem;
    align-items: stretch;
  }

  .search-btn {
    width: 100%;
  }

  .hero-features-strip {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .about-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
