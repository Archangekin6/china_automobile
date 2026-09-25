<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/stores/site";
import {
  Tag,
  Car,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  MessageCircle,
  ExternalLink,
} from "lucide-vue-next";

const router = useRouter();
const site = useSiteStore();

const brands = ref([]);
const cars = ref([]);
const loading = ref(true);
const errorMsg = ref("");
const searchQuery = ref("");

async function loadData() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const results = await Promise.all([
      supabase.from("brands").select("*").order("name"),
      supabase.from("cars").select("id, brand, available"),
    ]);
    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;

    const [bRes, cRes] = results;
    brands.value = bRes.data || [];
    cars.value = cRes.data || [];
  } catch (err) {
    console.error("Erreur de chargement des marques :", err);
    errorMsg.value =
      "Les marques partenaires ne sont pas disponibles pour le moment. Réessayez dans quelques instants.";
  } finally {
    loading.value = false;
  }
}

// Calcul du nombre de véhicules en stock / catalogue pour chaque marque
function getCarCount(brandName) {
  if (!brandName) return 0;
  return cars.value.filter(
    (c) => c.brand && c.brand.toLowerCase() === brandName.toLowerCase(),
  ).length;
}

const filteredBrands = computed(() => {
  if (!searchQuery.value.trim()) return brands.value;
  const q = searchQuery.value.trim().toLowerCase();
  return brands.value.filter((b) => b.name.toLowerCase().includes(q));
});

function goToBrandCars(brandName) {
  router.push({ path: "/voitures", query: { q: brandName } });
}

onMounted(loadData);
</script>

<template>
  <div class="brands-page">
    <!-- En-tête de page -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
          <RouterLink to="/">Accueil</RouterLink>
          <span class="crumb-sep">/</span>
          <span class="crumb-active">Marques Partenaires</span>
        </nav>

        <div class="header-content">
          <div class="header-badge">
            <Tag :size="14" />
            <span>Constructeurs Automobiles</span>
          </div>
          <h1 class="page-title">Les Marques Automobiles Proposées</h1>
          <p class="page-lead">
            Découvrez les marques et les modèles présents dans le catalogue de
            China Automobile en Côte d'Ivoire.
          </p>

          <!-- Barre de recherche de constructeur -->
          <div class="brand-search-box">
            <Search :size="18" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une marque (BYD, Chery, Haval, Geely...)"
            />
          </div>
        </div>
      </div>
    </header>

    <div class="container page-body">
      <!-- État chargement -->
      <div v-if="loading" class="loading-state">
        <Car :size="32" class="anim-pulse text-brand" />
        <p>Chargement des marques partenaires...</p>
      </div>

      <div v-else-if="errorMsg" class="error-banner" role="alert">
        <p>{{ errorMsg }}</p>
        <button type="button" class="btn btn-sm btn-outline" @click="loadData">
          Réessayer
        </button>
      </div>

      <!-- Grille des marques -->
      <div v-else-if="filteredBrands.length > 0" class="brands-catalog-grid">
        <div
          v-for="b in filteredBrands"
          :key="b.id"
          class="brand-showcase-card"
        >
          <div class="card-top">
            <div class="brand-logo-frame">
              <img
                v-if="b.logo_url"
                :src="b.logo_url"
                :alt="`Logo officiel ${b.name}`"
                class="brand-logo-img"
              />
              <div v-else class="logo-fallback">
                <Tag :size="28" />
              </div>
            </div>

            <div class="brand-identifiers">
              <h2 class="brand-name">{{ b.name }}</h2>
            </div>
          </div>

          <div class="card-bottom">
            <div class="stock-indicator">
              <Car :size="16" class="stock-icon" />
              <span>
                <strong>{{ getCarCount(b.name) }}</strong>
                {{
                  getCarCount(b.name) > 1
                    ? "véhicules au catalogue"
                    : "véhicule au catalogue"
                }}
              </span>
            </div>

            <button
              type="button"
              class="btn btn-outline btn-sm see-cars-btn"
              @click="goToBrandCars(b.name)"
            >
              <span>Voir les modèles</span>
              <ArrowRight :size="15" />
            </button>
          </div>
        </div>
      </div>

      <!-- Aucun résultat de recherche -->
      <div v-else class="empty-search-state">
        <Tag :size="36" class="text-slate" />
        <h3>Aucun constructeur trouvé pour "{{ searchQuery }}"</h3>
        <p>Aucune marque ne correspond à votre recherche dans le catalogue.</p>
        <button class="btn btn-secondary btn-sm" @click="searchQuery = ''">
          Réinitialiser la recherche
        </button>
      </div>

      <!-- Section Explicative -->
      <section class="reasons-section">
        <div class="reasons-header">
          <span class="section-tag">Analyse du Marché</span>
          <h2>Pourquoi consulter notre catalogue automobile ?</h2>
          <p class="section-desc">
            Comparez les modèles présents dans notre catalogue et consultez les
            informations disponibles avant de contacter notre équipe.
          </p>
        </div>

        <div class="reasons-grid">
          <div class="reason-card">
            <div class="reason-icon-wrap">
              <Sparkles :size="22" />
            </div>
            <h3>Technologies Embarquées Supérieures</h3>
            <p>
              Écrans géants rotatifs, caméras 360° panoramiques, aides à la
              conduite autonome de niveau 2+, connectivité Apple CarPlay et
              Android Auto incluses d'origine.
            </p>
          </div>

          <div class="reason-card">
            <div class="reason-icon-wrap">
              <ShieldCheck :size="22" />
            </div>
            <h3>Rapport Qualité / Équipement Inégalé</h3>
            <p>
              Pour le tarif d'un véhicule d'occasion européen basique, accédez à
              un SUV flambant neuf, suréquipé, garanti et bénéficiant des
              dernières normes de sécurité Euro NCAP.
            </p>
          </div>

          <div class="reason-card">
            <div class="reason-icon-wrap">
              <Car :size="22" />
            </div>
            <h3>Adaptabilité aux Routes Ivoiriennes</h3>
            <p>
              Garde au sol surélevée, suspensions renforcées, climatisation
              tropicalisée de haute capacité et moteurs éprouvés compatibles
              avec les carburants locaux.
            </p>
          </div>
        </div>

        <!-- Bannière Demande d'informations -->
        <div class="custom-request-banner">
          <div class="banner-text">
            <h3>Vous recherchez une marque ou un modèle spécifique ?</h3>
            <p>
              Découvrez les marques et les modèles présentés par China
              Automobile, puis contactez-nous pour obtenir les informations
              commerciales disponibles.
            </p>
          </div>
          <a
            :href="
              site.waLink(
                'Bonjour, je souhaite obtenir des informations sur une marque ou un modèle présent dans votre catalogue.',
              )
            "
            target="_blank"
            rel="noopener"
            class="btn btn-whatsapp"
          >
            <MessageCircle :size="18" />
            <span>Demander des informations</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.brands-page {
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
  margin-bottom: 1.75rem;
}

.brand-search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 0.45rem 1rem;
  max-width: 480px;
  box-shadow: var(--shadow-md);
}

.search-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.brand-search-box input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 0.92rem;
  color: var(--color-slate-900);
}

.brand-search-box input:focus {
  outline: none;
}

/* Corps */
.page-body {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.brands-catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.brand-showcase-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.brand-showcase-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-slate-300);
  box-shadow: var(--shadow-md);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-slate-100);
}

.brand-logo-frame {
  width: 84px;
  height: 68px;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  flex-shrink: 0;
}

.brand-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-fallback {
  color: var(--color-slate-400);
}

.brand-identifiers {
  display: flex;
  flex-direction: column;
}

.brand-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-brand);
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
}

.brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-slate-950);
  line-height: 1.15;
}

.brand-origin {
  font-size: 0.78rem;
  color: var(--color-slate-400);
  font-weight: 500;
}

.brand-description {
  font-size: 0.88rem;
  color: var(--color-slate-600);
  line-height: 1.6;
  margin: 0 0 1.5rem;
  flex: 1;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--color-slate-100);
  margin-top: auto;
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: var(--color-slate-600);
}

.stock-icon {
  color: var(--color-slate-400);
}

.see-cars-btn {
  gap: 0.4rem;
}

/* Raisons */
.reasons-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  box-shadow: var(--shadow-xs);
}

.reasons-header {
  text-align: center;
  margin-bottom: 2.75rem;
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

.reasons-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.65rem;
}

.section-desc {
  font-size: 0.95rem;
  color: var(--color-slate-500);
  line-height: 1.55;
  margin: 0;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.reason-card {
  padding: 1.5rem;
  background-color: var(--color-slate-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-slate-200);
}

.reason-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
  border: 1px solid var(--color-brand-border);
}

.reason-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.5rem;
}

.reason-card p {
  font-size: 0.88rem;
  color: var(--color-slate-600);
  line-height: 1.55;
  margin: 0;
}

/* Bannière custom */
.custom-request-banner {
  background-color: var(--color-slate-950);
  color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  border: 1px solid var(--color-slate-800);
}

.banner-text h3 {
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.banner-text p {
  color: var(--color-slate-300);
  font-size: 0.9rem;
  margin: 0;
  max-width: 55ch;
  line-height: 1.5;
}

.loading-state,
.empty-search-state {
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  color: var(--color-slate-500);
}

@media (max-width: 900px) {
  .reasons-grid {
    grid-template-columns: 1fr;
  }

  .custom-request-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .brands-catalog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
