<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/stores/site";
import {
  ClipboardList,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-vue-next";

const site = useSiteStore();
const orders = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedStatus = ref("all");

const statuses = [
  { id: "nouveau", label: "Nouveau", class: "status-nouveau" },
  { id: "contacté", label: "Contacté", class: "status-contacte" },
  { id: "confirmé", label: "Confirmé", class: "status-confirme" },
  { id: "annulé", label: "Annulé", class: "status-annule" },
];

async function loadOrders() {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, cars(brand, model, year, price)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    orders.value = data || [];
  } catch (err) {
    console.error("Erreur de chargement des commandes :", err);
  } finally {
    loading.value = false;
  }
}

async function updateStatus(order, newStatus) {
  const oldStatus = order.status;
  order.status = newStatus;
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) throw error;
  } catch (err) {
    order.status = oldStatus;
    alert("Impossible de mettre à jour le statut : " + err.message);
  }
}

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (n) => (n ? new Intl.NumberFormat("fr-FR").format(n) + " FCFA" : "");

// Compteurs de statuts
const statusCounts = computed(() => {
  const counts = { all: orders.value.length, nouveau: 0, contacté: 0, confirmé: 0, annulé: 0 };
  for (const o of orders.value) {
    if (counts[o.status] !== undefined) {
      counts[o.status]++;
    }
  }
  return counts;
});

// Liste filtrée
const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const q = searchQuery.value.trim().toLowerCase();
    const customer = (o.customer_name || "").toLowerCase();
    const phone = (o.phone || "").toLowerCase();
    const carText = o.cars ? `${o.cars.brand} ${o.cars.model}`.toLowerCase() : "";

    const matchesSearch = !q || customer.includes(q) || phone.includes(q) || carText.includes(q);
    const matchesStatus = selectedStatus.value === "all" || o.status === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

function getWhatsAppCustomerLink(order) {
  const cleanPhone = (order.phone || "").replace(/\D/g, "");
  const text = `Bonjour ${order.customer_name}, je vous contacte depuis China Automobile suite à votre demande pour le véhicule ${order.cars ? `${order.cars.brand} ${order.cars.model}` : ""}.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="orders-admin">
    <!-- Barre de filtres par statut -->
    <div class="filters-toolbar">
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un client, téléphone, véhicule..."
        />
      </div>

      <div class="status-pills">
        <button
          type="button"
          class="status-pill"
          :class="{ active: selectedStatus === 'all' }"
          @click="selectedStatus = 'all'"
        >
          <span>Toutes</span>
          <span class="count-badge">{{ statusCounts.all }}</span>
        </button>

        <button
          type="button"
          class="status-pill pill-nouveau"
          :class="{ active: selectedStatus === 'nouveau' }"
          @click="selectedStatus = 'nouveau'"
        >
          <span>Nouveau</span>
          <span class="count-badge">{{ statusCounts.nouveau }}</span>
        </button>

        <button
          type="button"
          class="status-pill pill-contacte"
          :class="{ active: selectedStatus === 'contacté' }"
          @click="selectedStatus = 'contacté'"
        >
          <span>Contacté</span>
          <span class="count-badge">{{ statusCounts.contacté }}</span>
        </button>

        <button
          type="button"
          class="status-pill pill-confirme"
          :class="{ active: selectedStatus === 'confirmé' }"
          @click="selectedStatus = 'confirmé'"
        >
          <span>Confirmé</span>
          <span class="count-badge">{{ statusCounts.confirmé }}</span>
        </button>

        <button
          type="button"
          class="status-pill pill-annule"
          :class="{ active: selectedStatus === 'annulé' }"
          @click="selectedStatus = 'annulé'"
        >
          <span>Annulé</span>
          <span class="count-badge">{{ statusCounts.annulé }}</span>
        </button>
      </div>
    </div>

    <!-- Tableau des commandes -->
    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <Clock :size="24" class="anim-spin" />
        <span>Chargement des commandes en cours...</span>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="table-empty">
        <ClipboardList :size="36" class="text-slate" />
        <h3>Aucune demande enregistrée</h3>
        <p>Les demandes d'achat soumises sur la vitrine apparaîtront ici avec les coordonnées complètes.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 140px">Date</th>
              <th>Client</th>
              <th>Coordonnées</th>
              <th>Véhicule Demandé</th>
              <th>Message du Client</th>
              <th style="width: 150px">Statut Traitement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in filteredOrders" :key="o.id">
              <td>
                <div class="date-cell">
                  <Calendar :size="13" class="cell-icon" />
                  <span>{{ formatDate(o.created_at) }}</span>
                </div>
              </td>

              <td>
                <div class="customer-cell">
                  <strong class="customer-name">{{ o.customer_name }}</strong>
                </div>
              </td>

              <td>
                <div class="contacts-cell">
                  <div class="phone-link-wrap">
                    <a :href="`tel:${o.phone}`" class="contact-phone" title="Appeler directement">
                      <Phone :size="13" />
                      <span>{{ o.phone }}</span>
                    </a>
                    <a
                      :href="getWhatsAppCustomerLink(o)"
                      target="_blank"
                      rel="noopener"
                      class="wa-shortcut"
                      title="Ouvrir la discussion WhatsApp"
                    >
                      <MessageCircle :size="13" />
                    </a>
                  </div>

                  <div v-if="o.email" class="contact-email">
                    <Mail :size="12" />
                    <span>{{ o.email }}</span>
                  </div>
                </div>
              </td>

              <td>
                <div v-if="o.cars" class="car-demand-cell">
                  <Car :size="14" class="cell-icon" />
                  <div>
                    <strong class="car-demand-name">
                      {{ o.cars.brand }} {{ o.cars.model }} {{ o.cars.year || "" }}
                    </strong>
                    <span v-if="o.cars.price" class="car-demand-price">
                      {{ formatPrice(o.cars.price) }}
                    </span>
                  </div>
                </div>
                <div v-else class="car-removed-tag">
                  Véhicule retiré du catalogue
                </div>
              </td>

              <td>
                <div class="message-cell">
                  <p v-if="o.message">{{ o.message }}</p>
                  <span v-else class="no-msg">Aucun message additionnel</span>
                </div>
              </td>

              <td>
                <div class="status-selector-wrap">
                  <select
                    :value="o.status"
                    :class="`status-select status-${o.status}`"
                    @change="updateStatus(o, $event.target.value)"
                  >
                    <option v-for="s in statuses" :key="s.id" :value="s.id">
                      {{ s.label }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-admin {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Barre d'outils */
.filters-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-xs);
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  padding: 0 0.75rem;
  min-width: 280px;
}

.search-box input {
  border: none;
  background: transparent;
  padding: 0.6rem 0;
  font-size: 0.88rem;
  color: var(--color-slate-900);
  width: 100%;
}

.search-box input:focus {
  outline: none;
}

.search-icon {
  color: var(--color-slate-400);
}

.status-pills {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-slate-200);
  background-color: var(--color-slate-50);
  color: var(--color-slate-600);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.status-pill:hover {
  background-color: var(--color-slate-100);
}

.status-pill.active {
  background-color: var(--color-slate-900);
  color: var(--color-white);
  border-color: var(--color-slate-900);
}

.count-badge {
  background-color: rgba(0, 0, 0, 0.08);
  font-size: 0.72rem;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-full);
}

.status-pill.active .count-badge {
  background-color: rgba(255, 255, 255, 0.25);
  color: var(--color-white);
}

/* Tableau */
.table-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.data-table th {
  background-color: var(--color-slate-50);
  color: var(--color-slate-600);
  font-weight: 700;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-slate-200);
}

.data-table td {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid var(--color-slate-200);
  vertical-align: top;
}

.data-table tbody tr:hover {
  background-color: var(--color-slate-50);
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-slate-500);
  white-space: nowrap;
}

.cell-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.customer-name {
  font-size: 0.95rem;
  color: var(--color-slate-950);
}

.contacts-cell {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.phone-link-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-phone {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  color: var(--color-slate-900);
}

.contact-phone:hover {
  color: var(--color-brand);
}

.wa-shortcut {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--color-wa);
  color: var(--color-white);
  transition: transform 0.15s ease;
}

.wa-shortcut:hover {
  transform: scale(1.15);
}

.contact-email {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--color-slate-500);
}

.car-demand-cell {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.car-demand-name {
  display: block;
  font-size: 0.92rem;
  color: var(--color-slate-900);
}

.car-demand-price {
  display: block;
  font-size: 0.78rem;
  color: var(--color-slate-500);
}

.car-removed-tag {
  font-size: 0.8rem;
  color: var(--color-slate-400);
  font-style: italic;
}

.message-cell p {
  font-size: 0.85rem;
  color: var(--color-slate-700);
  line-height: 1.45;
  margin: 0;
  max-width: 32ch;
}

.no-msg {
  font-size: 0.8rem;
  color: var(--color-slate-400);
}

/* Sélecteur de statut stylisé */
.status-select {
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  width: 100%;
}

.status-select:focus {
  outline: none;
}

.status-select.status-nouveau {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
  border-color: var(--color-warning-border);
}

.status-select.status-contacte,
.status-select.status-contacté {
  background-color: var(--color-info-bg);
  color: var(--color-info);
  border-color: var(--color-info-border);
}

.status-select.status-confirme,
.status-select.status-confirmé {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border-color: var(--color-success-border);
}

.status-select.status-annule,
.status-select.status-annulé {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
  border-color: var(--color-danger-border);
}

.table-loading,
.table-empty {
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-slate-500);
  text-align: center;
}

.table-empty h3 {
  font-size: 1.15rem;
  color: var(--color-slate-800);
}

.table-empty p {
  font-size: 0.88rem;
  color: var(--color-slate-500);
  max-width: 44ch;
}
</style>
