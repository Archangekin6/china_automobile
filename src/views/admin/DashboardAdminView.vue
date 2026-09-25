<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Tag,
  Sliders,
  Plus,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Fuel,
  DollarSign,
  TrendingUp,
} from "lucide-vue-next";

const cars = ref([]);
const orders = ref([]);
const brands = ref([]);
const loading = ref(true);

const formatPrice = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Métriques
const totalCars = computed(() => cars.value.length);
const availableCars = computed(
  () => cars.value.filter((c) => c.available).length,
);
const soldCars = computed(() => cars.value.filter((c) => !c.available).length);
const pendingOrders = computed(
  () => orders.value.filter((o) => o.status === "nouveau" || !o.status).length,
);

// Répartition par carburant
const fuelBreakdown = computed(() => {
  const totals = { Essence: 0, Hybride: 0, Électrique: 0, Diesel: 0 };
  for (const c of cars.value) {
    if (c.fuel && totals[c.fuel] !== undefined) totals[c.fuel]++;
    else totals.Essence++;
  }
  const total = totalCars.value || 1;
  return [
    {
      label: "Essence",
      count: totals.Essence,
      pct: Math.round((totals.Essence / total) * 100),
      color: "#dc2626",
    },
    {
      label: "Hybride",
      count: totals.Hybride,
      pct: Math.round((totals.Hybride / total) * 100),
      color: "#059669",
    },
    {
      label: "Électrique",
      count: totals.Électrique,
      pct: Math.round((totals.Électrique / total) * 100),
      color: "#2563eb",
    },
    {
      label: "Diesel",
      count: totals.Diesel,
      pct: Math.round((totals.Diesel / total) * 100),
      color: "#6b7280",
    },
  ];
});

// Dernières commandes (top 5)
const recentOrders = computed(() => orders.value.slice(0, 5));

// Derniers véhicules ajoutés (top 4)
const recentCars = computed(() => cars.value.slice(0, 4));

async function loadDashboardData() {
  loading.value = true;
  try {
    const [cRes, oRes, bRes] = await Promise.all([
      supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*, cars(brand, model)")
        .order("created_at", { ascending: false }),
      supabase.from("brands").select("*"),
    ]);

    cars.value = cRes.data || [];
    orders.value = oRes.data || [];
    brands.value = bRes.data || [];
  } catch (err) {
    console.error("Erreur chargement dashboard :", err);
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboardData);
</script>

<template>
  <div class="dashboard-admin">
    <!-- En-tête KPI Grid -->
    <div class="kpi-grid">
      <!-- KPI 1 -->
      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-green">
          <Car :size="22" />
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Véhicules Disponibles</span>
          <strong class="kpi-val">{{ availableCars }}</strong>
          <span class="kpi-sub">{{ totalCars }} véhicules au total</span>
        </div>
      </div>

      <!-- KPI 2 -->
      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-amber">
          <Clock :size="22" />
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Demandes à Traiter</span>
          <strong class="kpi-val">{{ pendingOrders }}</strong>
          <span class="kpi-sub"
            >Sur {{ orders.length }} demandes enregistrées</span
          >
        </div>
      </div>

      <!-- KPI 3 -->
      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-slate">
          <CheckCircle2 :size="22" />
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Véhicules Vendus</span>
          <strong class="kpi-val">{{ soldCars }}</strong>
          <span class="kpi-sub">Parc commercial concrétisé</span>
        </div>
      </div>

      <!-- KPI 4 -->
      <div class="kpi-card">
        <div class="kpi-icon-wrap bg-red">
          <Tag :size="22" />
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Constructeurs Partenaires</span>
          <strong class="kpi-val">{{ brands.length }}</strong>
          <span class="kpi-sub">Marques enregistrées</span>
        </div>
      </div>
    </div>

    <!-- Actions Rapides -->
    <div class="quick-actions-bar">
      <span class="actions-label">Raccourcis Directs :</span>
      <RouterLink to="/admin/voitures" class="quick-action-btn primary">
        <Plus :size="16" />
        <span>Ajouter un Véhicule</span>
      </RouterLink>

      <RouterLink to="/admin/commandes" class="quick-action-btn">
        <ClipboardList :size="16" />
        <span>Gérer les Commandes ({{ pendingOrders }})</span>
      </RouterLink>

      <RouterLink to="/admin/marques" class="quick-action-btn">
        <Tag :size="16" />
        <span>Ajouter une Marque</span>
      </RouterLink>

      <RouterLink to="/admin/accueil" class="quick-action-btn">
        <Sliders :size="16" />
        <span>Réglages Vitrine</span>
      </RouterLink>
    </div>

    <!-- Grille Principale 2 Colonnes -->
    <div class="dashboard-main-grid">
      <!-- Colonne Gauche : Dernières Demandes Clients -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div>
            <h3>Dernières Demandes d'Achat & Import</h3>
            <p>
              Demandes soumises récemment par les clients sur le site vitrine.
            </p>
          </div>
          <RouterLink to="/admin/commandes" class="see-all-link">
            <span>Toutes les commandes</span>
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div v-if="recentOrders.length === 0" class="empty-dash">
          <ClipboardList :size="32" class="text-slate" />
          <p>Aucune demande client pour le moment.</p>
        </div>

        <div v-else class="orders-compact-list">
          <div v-for="o in recentOrders" :key="o.id" class="order-compact-item">
            <div class="order-client-info">
              <strong class="client-name">{{ o.customer_name }}</strong>
              <div class="client-phone-wrap">
                <a :href="`tel:${o.phone}`" class="client-phone">{{
                  o.phone
                }}</a>
                <a
                  :href="`https://wa.me/${o.phone.replace(/\\D/g, '')}`"
                  target="_blank"
                  rel="noopener"
                  class="wa-badge"
                  title="WhatsApp"
                >
                  <MessageCircle :size="12" />
                </a>
              </div>
            </div>

            <div class="order-car-info">
              <span class="car-label" v-if="o.cars"
                >{{ o.cars.brand }} {{ o.cars.model }}</span
              >
              <span class="car-label text-slate" v-else>Demande générale</span>
              <span class="order-date">{{ formatDate(o.created_at) }}</span>
            </div>

            <div class="order-status-tag">
              <span :class="`badge-status status-${o.status || 'nouveau'}`">
                {{ o.status || "Nouveau" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne Droite : Répartition du Parc & Nouveaux Véhicules -->
      <div class="dash-side-col">
        <!-- Répartition par motorisation -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <h3>Répartition du Parc par Motorisation</h3>
              <p>Typologie des motorisations en catalogue.</p>
            </div>
          </div>

          <div class="fuel-distribution-list">
            <div
              v-for="f in fuelBreakdown"
              :key="f.label"
              class="fuel-dist-item"
            >
              <div class="dist-row">
                <span class="dist-label">{{ f.label }}</span>
                <span class="dist-val">{{ f.count }} véh. ({{ f.pct }}%)</span>
              </div>
              <div class="dist-progress-track">
                <div
                  class="dist-progress-bar"
                  :style="{ width: `${f.pct}%`, backgroundColor: f.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Derniers Véhicules Ajoutés -->
        <div class="dash-card">
          <div class="dash-card-header">
            <div>
              <h3>Derniers Véhicules au Parc</h3>
              <p>Récemment enregistrés dans le catalogue.</p>
            </div>
            <RouterLink to="/admin/voitures" class="see-all-link">
              <span>Voir le parc</span>
              <ArrowRight :size="14" />
            </RouterLink>
          </div>

          <div class="recent-cars-list">
            <div
              v-for="car in recentCars"
              :key="car.id"
              class="recent-car-item"
            >
              <div class="car-mini-thumb">
                <img
                  v-if="car.image_url"
                  :src="car.image_url"
                  :alt="car.model"
                />
                <Car v-else :size="16" class="thumb-icon" />
              </div>

              <div class="car-mini-details">
                <span class="car-brand-name">{{ car.brand }}</span>
                <strong class="car-model-name"
                  >{{ car.model }} {{ car.year || "" }}</strong
                >
              </div>

              <div class="car-mini-price">
                <span class="price-amount">{{ formatPrice(car.price) }}</span>
                <span
                  class="status-dot"
                  :class="car.available ? 'available' : 'sold'"
                >
                  {{ car.available ? "Dispo" : "Vendu" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-admin {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.35rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-xs);
}

.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bg-green {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.bg-amber {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.bg-slate {
  background-color: var(--color-slate-100);
  color: var(--color-slate-700);
}

.bg-red {
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
}

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-label {
  font-size: 0.78rem;
  color: var(--color-slate-500);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kpi-val {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--color-slate-950);
  line-height: 1.1;
  margin: 0.15rem 0;
}

.kpi-sub {
  font-size: 0.75rem;
  color: var(--color-slate-400);
}

/* Quick actions */
.quick-actions-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 0.85rem 1.25rem;
  flex-wrap: wrap;
  box-shadow: var(--shadow-xs);
}

.actions-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-slate-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quick-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-300);
  color: var(--color-slate-700);
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease;
}

.quick-action-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

.quick-action-btn.primary {
  background-color: var(--color-brand);
  color: var(--color-white);
  border-color: var(--color-brand);
}

.quick-action-btn.primary:hover {
  background-color: var(--color-brand-hover);
}

/* Main Grid */
.dashboard-main-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 1.75rem;
}

.dash-side-col {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.dash-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-xs);
}

.dash-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-slate-100);
}

.dash-card-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.2rem;
}

.dash-card-header p {
  font-size: 0.78rem;
  color: var(--color-slate-500);
  margin: 0;
}

.see-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-brand);
  white-space: nowrap;
}

.see-all-link:hover {
  color: var(--color-brand-hover);
}

/* Liste des commandes */
.orders-compact-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.order-compact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
}

.order-client-info {
  display: flex;
  flex-direction: column;
  min-width: 140px;
}

.client-name {
  font-size: 0.9rem;
  color: var(--color-slate-900);
}

.client-phone-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
}

.client-phone {
  color: var(--color-slate-600);
}

.client-phone:hover {
  color: var(--color-brand);
}

.wa-badge {
  color: var(--color-wa);
  display: grid;
  place-items: center;
}

.order-car-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.car-label {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--color-slate-900);
}

.order-date {
  font-size: 0.75rem;
  color: var(--color-slate-400);
}

.badge-status {
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}

.badge-status.status-nouveau {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.badge-status.status-contacté,
.badge-status.status-contacte {
  background-color: var(--color-info-bg);
  color: var(--color-info);
}

.badge-status.status-confirmé,
.badge-status.status-confirme {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.badge-status.status-annulé,
.badge-status.status-annule {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

/* Répartition Carburant */
.fuel-distribution-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dist-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
}

.dist-label {
  font-weight: 600;
  color: var(--color-slate-800);
}

.dist-val {
  color: var(--color-slate-500);
  font-variant-numeric: tabular-nums;
}

.dist-progress-track {
  height: 6px;
  background-color: var(--color-slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.dist-progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

/* Récents Voitures */
.recent-cars-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-car-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
}

.car-mini-thumb {
  width: 48px;
  height: 36px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-slate-200);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.car-mini-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-icon {
  color: var(--color-slate-400);
}

.car-mini-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.car-brand-name {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-brand);
}

.car-model-name {
  font-size: 0.84rem;
  color: var(--color-slate-900);
}

.car-mini-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-amount {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-slate-950);
  font-variant-numeric: tabular-nums;
}

.status-dot {
  font-size: 0.7rem;
  font-weight: 600;
}

.status-dot.available {
  color: var(--color-success);
}

.status-dot.sold {
  color: var(--color-slate-400);
}

.empty-dash {
  padding: 2.5rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-slate-500);
}

@media (max-width: 980px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
