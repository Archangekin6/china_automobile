<script setup>
import { RouterLink } from "vue-router";
import { Gauge, Fuel, Cog, ArrowRight, ShieldCheck, Star } from "lucide-vue-next";

defineProps({
  car: { type: Object, required: true },
});

const formatNumber = (n) => new Intl.NumberFormat("fr-FR").format(n);
const formatPrice = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
</script>

<template>
  <div class="car-card" :class="{ 'is-sold': !car.available }">
    <!-- Conteneur Photo & Badges -->
    <div class="photo-container">
      <img
        v-if="car.image_url"
        :src="car.image_url"
        :alt="`${car.brand} ${car.model} ${car.year || ''}`"
        class="car-image"
        loading="lazy"
      />
      <div v-else class="no-photo">
        <span>Photo du véhicule en attente</span>
      </div>

      <!-- Badges Statuts -->
      <div class="badges-overlay">
        <span v-if="!car.available" class="badge badge-sold">
          Vendu
        </span>
        <span v-else class="badge badge-available">
          Disponible
        </span>

        <span v-if="car.featured" class="badge badge-featured">
          <Star :size="11" fill="currentColor" />
          À la une
        </span>
      </div>

      <!-- Tag Année si présent -->
      <span v-if="car.year" class="year-tag">{{ car.year }}</span>
    </div>

    <!-- Contenu & Informations -->
    <div class="card-body">
      <div class="brand-row">
        <span class="brand-name">{{ car.brand }}</span>
      </div>

      <h3 class="model-name">
        <RouterLink :to="`/voitures/${car.id}`" class="title-link">
          {{ car.model }}
        </RouterLink>
      </h3>

      <div class="price-row">
        <div class="price-value">{{ formatPrice(car.price) }}</div>
        <div class="price-note">Clé en main</div>
      </div>

      <!-- Spécifications techniques -->
      <div class="specs-grid">
        <div v-if="car.transmission" class="spec-item" title="Boîte de vitesses">
          <Cog :size="14" class="spec-icon" />
          <span>{{ car.transmission }}</span>
        </div>

        <div v-if="car.fuel" class="spec-item" title="Motorisation / Carburant">
          <Fuel :size="14" class="spec-icon" />
          <span>{{ car.fuel }}</span>
        </div>

        <div v-if="car.mileage !== undefined && car.mileage !== null" class="spec-item" title="Kilométrage">
          <Gauge :size="14" class="spec-icon" />
          <span>{{ formatNumber(car.mileage) }} km</span>
        </div>
      </div>

      <!-- Bouton d'action -->
      <div class="card-footer">
        <RouterLink :to="`/voitures/${car.id}`" class="details-btn">
          <span>Voir les détails</span>
          <ArrowRight :size="15" class="btn-arrow" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.car-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: var(--shadow-xs);
  height: 100%;
}

.car-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-slate-300);
  box-shadow: var(--shadow-md);
}

.car-card.is-sold {
  opacity: 0.85;
}

/* Zone Image */
.photo-container {
  position: relative;
  aspect-ratio: 16 / 10;
  background-color: var(--color-slate-100);
  overflow: hidden;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.car-card:hover .car-image {
  transform: scale(1.03);
}

.no-photo {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--color-slate-400);
  font-size: 0.85rem;
  font-weight: 500;
  background-color: var(--color-slate-100);
  text-align: center;
  padding: 1rem;
}

.badges-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  z-index: 2;
}

.badge-available {
  background-color: rgba(5, 150, 105, 0.92);
  color: var(--color-white);
  backdrop-filter: blur(4px);
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: none;
}

.badge-sold {
  background-color: rgba(17, 24, 39, 0.9);
  color: var(--color-white);
  backdrop-filter: blur(4px);
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: none;
}

.badge-featured {
  background-color: rgba(220, 38, 38, 0.92);
  color: var(--color-white);
  backdrop-filter: blur(4px);
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border: none;
}

.year-tag {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(11, 15, 21, 0.75);
  color: var(--color-white);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}

/* Corps de carte */
.card-body {
  padding: 1.25rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.brand-row {
  margin-bottom: 0.25rem;
}

.brand-name {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-brand);
}

.model-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-slate-950);
  line-height: 1.25;
  margin-bottom: 0.8rem;
}

.title-link {
  color: inherit;
  text-decoration: none;
}

.title-link:hover {
  color: var(--color-brand);
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-slate-100);
}

.price-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-slate-950);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.price-note {
  font-size: 0.75rem;
  color: var(--color-slate-400);
  font-weight: 500;
}

/* Puces techniques */
.specs-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
  margin-bottom: 1.25rem;
}

.spec-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--color-slate-600);
  font-weight: 500;
  background-color: var(--color-slate-50);
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
}

.spec-icon {
  color: var(--color-slate-500);
}

/* Pied de carte */
.card-footer {
  margin-top: auto;
  padding-top: 0.5rem;
}

.details-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.65rem 0.9rem;
  background-color: var(--color-slate-50);
  color: var(--color-slate-800);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  font-size: 0.86rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
}

.details-btn:hover {
  background-color: var(--color-slate-900);
  color: var(--color-white);
  border-color: var(--color-slate-900);
}

.btn-arrow {
  transition: transform 0.15s ease;
}

.details-btn:hover .btn-arrow {
  transform: translateX(3px);
}
</style>
