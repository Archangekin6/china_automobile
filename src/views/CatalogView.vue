<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/stores/site";
import { useRoute, useRouter } from "vue-router";
import CarCard from "@/components/CarCard.vue";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Car,
  Filter,
  ArrowUpDown,
  Check,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const site = useSiteStore();

const cars = ref([]);
const loading = ref(true);
const errorMsg = ref("");

// Filtres
const search = ref(route.query.q || "");
const brand = ref("");
const fuel = ref("");
const transmission = ref("");
const maxPrice = ref("");
const sortBy = ref("newest"); // newest, price_asc, price_desc, year_desc

// Extraire la liste unique des marques disponibles
const availableBrands = computed(() => {
  const set = new Set(cars.value.map((c) => c.brand).filter(Boolean));
  return Array.from(set).sort();
});

// Chargement des voitures
async function loadCars() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    cars.value = data || [];
  } catch (err) {
    errorMsg.value =
      "Impossible de charger le catalogue de véhicules pour le moment.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Réinitialiser les filtres
function resetFilters() {
  search.value = "";
  brand.value = "";
  fuel.value = "";
  transmission.value = "";
  maxPrice.value = "";
  sortBy.value = "newest";
  router.replace({ path: "/voitures" });
}

// Filtrage & Tri
const filteredCars = computed(() => {
  let list = cars.value.filter((c) => {
    // Recherche textuelle
    const query = search.value.trim().toLowerCase();
    const fullText =
      `${c.brand || ""} ${c.model || ""} ${c.year || ""}`.toLowerCase();
    const matchSearch = !query || fullText.includes(query);

    // Marque
    const matchBrand = !brand.value || c.brand === brand.value;

    // Carburant
    const matchFuel = !fuel.value || c.fuel === fuel.value;

    // Transmission
    const matchTransmission =
      !transmission.value || c.transmission === transmission.value;

    // Prix max
    const matchPrice =
      !maxPrice.value || Number(c.price) <= Number(maxPrice.value);

    return (
      matchSearch && matchBrand && matchFuel && matchTransmission && matchPrice
    );
  });

  // Tri
  if (sortBy.value === "price_asc") {
    list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy.value === "price_desc") {
    list.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy.value === "year_desc") {
    list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  } else {
    // Par défaut : plus récents (id ou created_at)
    list.sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
    );
  }

  return list;
});

const isFiltered = computed(() => {
  return (
    !!search.value ||
    !!brand.value ||
    !!fuel.value ||
    !!transmission.value ||
    !!maxPrice.value ||
    sortBy.value !== "newest"
  );
});

onMounted(() => {
  loadCars();
});
</script>

<template>
  <div class="catalog-page">
    <!-- En-tête du catalogue -->
    <header class="catalog-header">
      <div class="container">
        <div class="header-breadcrumbs">
          <RouterLink to="/">Accueil</RouterLink>
          <span class="crumb-sep">/</span>
          <span class="crumb-active">Catalogue Véhicules</span>
        </div>
        <h1 class="catalog-title">Notre Parc de Véhicules</h1>
        <p class="catalog-desc">
          Découvrez notre sélection de véhicules neufs et d'occasion, avec leur
          prix et leur statut lorsqu'ils sont disponibles.
        </p>
      </div>
    </header>

    <div class="container catalog-body">
      <!-- Barre d'outils et filtres professionnels -->
      <div class="filters-panel">
        <div class="search-primary-row">
          <div class="search-field-box">
            <Search :size="18" class="field-icon" />
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par mot-clé (modèle, version, année...)"
              aria-label="Rechercher un véhicule"
            />
          </div>

          <!-- Tri -->
          <div class="sort-field-box">
            <ArrowUpDown :size="16" class="field-icon" />
            <select v-model="sortBy" aria-label="Trier les véhicules">
              <option value="newest">Plus récents</option>
              <option value="price_asc">Prix : croissant</option>
              <option value="price_desc">Prix : décroissant</option>
              <option value="year_desc">Année la plus récente</option>
            </select>
          </div>
        </div>

        <!-- Deuxième ligne : Sélecteurs de critères -->
        <div class="filters-secondary-row">
          <!-- Marque -->
          <div class="filter-select-wrapper">
            <select
              v-model="brand"
              aria-label="Filtrer les véhicules par marque"
            >
              <option value="">Toutes les marques</option>
              <option v-for="b in availableBrands" :key="b" :value="b">
                {{ b }}
              </option>
            </select>
          </div>

          <!-- Carburant -->
          <div class="filter-select-wrapper">
            <select
              v-model="fuel"
              aria-label="Filtrer les véhicules par énergie"
            >
              <option value="">Tous carburants</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Électrique">Électrique</option>
            </select>
          </div>

          <!-- Boîte de vitesses -->
          <div class="filter-select-wrapper">
            <select
              v-model="transmission"
              aria-label="Filtrer les véhicules par transmission"
            >
              <option value="">Toutes transmissions</option>
              <option value="Automatique">Automatique</option>
              <option value="Manuelle">Manuelle</option>
            </select>
          </div>

          <!-- Prix maximum -->
          <div class="filter-input-wrapper">
            <input
              v-model="maxPrice"
              type="number"
              placeholder="Budget max (FCFA)"
              min="0"
              step="500000"
              aria-label="Prix maximum en FCFA"
            />
          </div>

          <!-- Bouton de réinitialisation -->
          <button
            v-if="isFiltered"
            type="button"
            class="reset-btn"
            @click="resetFilters"
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw :size="14" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      <!-- Résumé des résultats -->
      <div class="results-meta-row">
        <div class="results-count">
          <span class="count-number">{{ filteredCars.length }}</span>
          <span class="count-label">
            {{
              filteredCars.length > 1 ? "véhicules trouvés" : "véhicule trouvé"
            }}
          </span>
        </div>

        <div v-if="loading" class="loading-indicator">
          <span>Actualisation du catalogue...</span>
        </div>
      </div>

      <!-- États d'affichage -->
      <div v-if="errorMsg" class="error-banner">
        <p>{{ errorMsg }}</p>
        <button class="btn btn-sm btn-outline" @click="loadCars">
          Réessayer
        </button>
      </div>

      <div
        v-else-if="loading"
        class="loading-state"
        role="status"
        aria-live="polite"
      >
        <Car :size="32" class="loading-icon" />
        <p>Chargement du catalogue en cours...</p>
      </div>

      <!-- Grille des voitures -->
      <div v-else-if="filteredCars.length > 0" class="catalog-grid">
        <CarCard v-for="car in filteredCars" :key="car.id" :car="car" />
      </div>

      <!-- État vide professionnel -->
      <div v-else-if="!loading" class="empty-state">
        <div class="empty-icon-wrap">
          <Car :size="48" stroke-width="1.5" />
        </div>
        <h3>Aucun véhicule ne correspond à vos critères</h3>
        <p>
          Nous n'avons pas trouvé de véhicule correspondant exactement à votre
          sélection. Essayez d'ajuster vos filtres de prix ou de motorisation.
        </p>
        <div class="empty-actions">
          <button type="button" class="btn btn-secondary" @click="resetFilters">
            <RotateCcw :size="16" />
            <span>Effacer les filtres</span>
          </button>
          <a
            :href="
              site.waLink(
                'Bonjour, je recherche un véhicule qui n\'est pas affiché dans votre catalogue.',
              )
            "
            target="_blank"
            rel="noopener"
            class="btn btn-whatsapp"
          >
            Demander des informations
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  background-color: var(--color-slate-50);
  min-height: 80vh;
  padding-bottom: 5rem;
}

/* En-tête */
.catalog-header {
  background-color: var(--color-slate-950);
  color: var(--color-white);
  padding: 3.5rem 0 3rem;
  border-bottom: 1px solid var(--color-slate-800);
}

.header-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: var(--color-slate-400);
  margin-bottom: 1rem;
}

.header-breadcrumbs a {
  color: var(--color-slate-300);
}

.header-breadcrumbs a:hover {
  color: var(--color-white);
}

.crumb-sep {
  color: var(--color-slate-600);
}

.crumb-active {
  color: var(--color-brand);
  font-weight: 600;
}

.catalog-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 0.65rem;
}

.catalog-desc {
  font-size: 1rem;
  color: var(--color-slate-300);
  max-width: 60ch;
  line-height: 1.55;
  margin: 0;
}

/* Corps */
.catalog-body {
  margin-top: -1.75rem;
}

/* Filtres */
.filters-panel {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.search-primary-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-field-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  padding: 0 0.85rem;
  transition: border-color 0.15s ease;
}

.search-field-box:focus-within {
  border-color: var(--color-slate-900);
  background-color: var(--color-white);
}

.search-field-box input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.75rem 0;
  font-size: 0.92rem;
  color: var(--color-slate-900);
}

.search-field-box input:focus {
  outline: none;
}

.field-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.sort-field-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  padding: 0 0.85rem;
  width: 240px;
}

.sort-field-box select {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0.75rem 0;
  font-size: 0.88rem;
  color: var(--color-slate-800);
  cursor: pointer;
}

.sort-field-box select:focus {
  outline: none;
}

/* Deuxième ligne filtres */
.filters-secondary-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-slate-100);
}

.filter-select-wrapper,
.filter-input-wrapper {
  flex: 1;
  min-width: 170px;
}

.filter-select-wrapper select,
.filter-input-wrapper input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--color-slate-800);
  background-color: var(--color-white);
}

.filter-select-wrapper select:focus,
.filter-input-wrapper input:focus {
  outline: none;
  border-color: var(--color-slate-900);
}

.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 0.95rem;
  background: none;
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-slate-600);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.reset-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

/* Résultats Méta */
.results-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 0.25rem;
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.count-number {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-slate-950);
}

.count-label {
  font-size: 0.92rem;
  color: var(--color-slate-500);
}

.loading-indicator {
  font-size: 0.85rem;
  color: var(--color-slate-500);
}

/* Grille */
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.75rem;
}

/* État vide */
.empty-state {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: var(--shadow-xs);
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-slate-100);
  color: var(--color-slate-400);
  display: grid;
  place-items: center;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: var(--color-slate-500);
  font-size: 0.92rem;
  line-height: 1.55;
  margin-bottom: 1.75rem;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.error-banner {
  background-color: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  color: var(--color-danger);
  text-align: center;
}

@media (max-width: 768px) {
  .search-primary-row {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-field-box {
    width: 100%;
  }

  .filters-secondary-row {
    flex-direction: column;
    align-items: stretch;
  }

  .reset-btn {
    justify-content: center;
  }
}
</style>
