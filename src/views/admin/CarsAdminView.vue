<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import {
  Car,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Upload,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Fuel,
  Cog,
  Gauge,
  Calendar,
  DollarSign,
  Image as ImageIcon,
} from "lucide-vue-next";

const cars = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const statusFilter = ref("all"); // all, available, sold, featured

// Formulaire modale
const showForm = ref(false);
const editingId = ref(null);
const emptyForm = () => ({
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  fuel: "Essence",
  transmission: "Automatique",
  mileage: 0,
  description: "",
  image_url: "",
  available: true,
  featured: false,
});

const form = ref(emptyForm());
const file = ref(null);
const filePreview = ref("");
const saving = ref(false);
const formError = ref("");

const formatPrice = (n) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const formatNumber = (n) => new Intl.NumberFormat("fr-FR").format(n);

// Statistiques rapides
const totalCarsCount = computed(() => cars.value.length);
const availableCarsCount = computed(() => cars.value.filter((c) => c.available).length);
const soldCarsCount = computed(() => cars.value.filter((c) => !c.available).length);
const featuredCarsCount = computed(() => cars.value.filter((c) => c.featured).length);

// Liste filtrée
const filteredCars = computed(() => {
  return cars.value.filter((car) => {
    const q = searchQuery.value.trim().toLowerCase();
    const fullText = `${car.brand || ""} ${car.model || ""} ${car.year || ""}`.toLowerCase();
    const matchesSearch = !q || fullText.includes(q);

    let matchesStatus = true;
    if (statusFilter.value === "available") matchesStatus = car.available === true;
    else if (statusFilter.value === "sold") matchesStatus = car.available === false;
    else if (statusFilter.value === "featured") matchesStatus = car.featured === true;

    return matchesSearch && matchesStatus;
  });
});

async function loadCars() {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    cars.value = data || [];
  } catch (err) {
    console.error("Erreur de chargement des voitures :", err);
  } finally {
    loading.value = false;
  }
}

function openAdd() {
  editingId.value = null;
  form.value = emptyForm();
  file.value = null;
  filePreview.value = "";
  formError.value = "";
  showForm.value = true;
}

function openEdit(car) {
  editingId.value = car.id;
  form.value = { ...car };
  file.value = null;
  filePreview.value = car.image_url || "";
  formError.value = "";
  showForm.value = true;
}

function onFileSelected(e) {
  const selected = e.target.files[0] || null;
  file.value = selected;
  if (selected) {
    filePreview.value = URL.createObjectURL(selected);
  }
}

async function uploadImageFile() {
  const ext = file.value.name.split(".").pop();
  const path = `cars/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("car-images")
    .upload(path, file.value);

  if (upErr) throw upErr;
  return supabase.storage.from("car-images").getPublicUrl(path).data.publicUrl;
}

async function saveCar() {
  formError.value = "";
  if (!form.value.brand.trim() || !form.value.model.trim() || !form.value.price) {
    formError.value = "La marque, le modèle et le prix en FCFA sont obligatoires.";
    return;
  }

  saving.value = true;
  try {
    if (file.value) {
      form.value.image_url = await uploadImageFile();
    }

    const payload = {
      brand: form.value.brand.trim(),
      model: form.value.model.trim(),
      year: form.value.year ? Number(form.value.year) : null,
      price: Number(form.value.price),
      fuel: form.value.fuel,
      transmission: form.value.transmission,
      mileage: Number(form.value.mileage) || 0,
      description: form.value.description ? form.value.description.trim() : null,
      image_url: form.value.image_url,
      available: Boolean(form.value.available),
      featured: Boolean(form.value.featured),
    };

    const query = editingId.value
      ? supabase.from("cars").update(payload).eq("id", editingId.value)
      : supabase.from("cars").insert(payload);

    const { error: dbErr } = await query;
    if (dbErr) throw dbErr;

    showForm.value = false;
    await loadCars();
  } catch (e) {
    formError.value = "Erreur lors de l'enregistrement : " + e.message;
    console.error(e);
  } finally {
    saving.value = false;
  }
}

async function removeCar(car) {
  const confirmed = confirm(
    `Confirmez-vous la suppression définitive du véhicule ${car.brand} ${car.model} (${car.year || ""}) ?`,
  );
  if (!confirmed) return;

  try {
    const { error } = await supabase.from("cars").delete().eq("id", car.id);
    if (error) throw error;
    await loadCars();
  } catch (e) {
    alert("Impossible de supprimer le véhicule : " + e.message);
  }
}

async function toggleField(car, field) {
  const newValue = !car[field];
  try {
    const { error } = await supabase
      .from("cars")
      .update({ [field]: newValue })
      .eq("id", car.id);

    if (error) throw error;
    car[field] = newValue;
  } catch (e) {
    alert("Erreur lors de la mise à jour : " + e.message);
  }
}

onMounted(() => {
  loadCars();
});
</script>

<template>
  <div class="cars-admin">
    <!-- Barre KPI du parc -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon bg-slate">
          <Car :size="20" />
        </div>
        <div class="metric-body">
          <span class="metric-num">{{ totalCarsCount }}</span>
          <span class="metric-title">Total Véhicules</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon bg-green">
          <CheckCircle2 :size="20" />
        </div>
        <div class="metric-body">
          <span class="metric-num">{{ availableCarsCount }}</span>
          <span class="metric-title">Disponibles en vente</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon bg-amber">
          <XCircle :size="20" />
        </div>
        <div class="metric-body">
          <span class="metric-num">{{ soldCarsCount }}</span>
          <span class="metric-title">Vendus / Réservés</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon bg-red">
          <Star :size="20" />
        </div>
        <div class="metric-body">
          <span class="metric-num">{{ featuredCarsCount }}</span>
          <span class="metric-title">Mis à la une</span>
        </div>
      </div>
    </div>

    <!-- Barre d'outils et actions -->
    <div class="toolbar-card">
      <div class="toolbar-left">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par marque ou modèle..."
          />
        </div>

        <div class="filter-pills">
          <button
            type="button"
            class="filter-pill"
            :class="{ active: statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            Tous ({{ totalCarsCount }})
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ active: statusFilter === 'available' }"
            @click="statusFilter = 'available'"
          >
            Disponibles ({{ availableCarsCount }})
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ active: statusFilter === 'sold' }"
            @click="statusFilter = 'sold'"
          >
            Vendus ({{ soldCarsCount }})
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ active: statusFilter === 'featured' }"
            @click="statusFilter = 'featured'"
          >
            À la une ({{ featuredCarsCount }})
          </button>
        </div>
      </div>

      <button type="button" class="btn btn-primary" @click="openAdd">
        <Plus :size="16" />
        <span>Ajouter un véhicule</span>
      </button>
    </div>

    <!-- Tableau Professionnel -->
    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <Car :size="24" class="anim-spin" />
        <span>Chargement des données du parc...</span>
      </div>

      <div v-else-if="filteredCars.length === 0" class="table-empty">
        <AlertCircle :size="32" class="text-slate" />
        <p>Aucun véhicule ne correspond aux critères de recherche.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 80px">Visuel</th>
              <th>Véhicule</th>
              <th>Caractéristiques</th>
              <th>Tarif Commercial</th>
              <th style="text-align: center">Disponibilité</th>
              <th style="text-align: center">À la une</th>
              <th style="text-align: right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="car in filteredCars" :key="car.id">
              <td>
                <div class="car-thumb-wrap">
                  <img
                    v-if="car.image_url"
                    :src="car.image_url"
                    :alt="car.model"
                    class="car-thumb"
                  />
                  <div v-else class="no-thumb">
                    <Car :size="18" />
                  </div>
                </div>
              </td>

              <td>
                <div class="car-identity">
                  <span class="car-brand">{{ car.brand }}</span>
                  <strong class="car-model">{{ car.model }}</strong>
                  <span v-if="car.year" class="car-year">Année {{ car.year }}</span>
                </div>
              </td>

              <td>
                <div class="car-specs-tags">
                  <span class="spec-tag">{{ car.transmission || "Automatique" }}</span>
                  <span class="spec-tag">{{ car.fuel || "Essence" }}</span>
                  <span class="spec-tag" v-if="car.mileage">
                    {{ formatNumber(car.mileage) }} km
                  </span>
                </div>
              </td>

              <td>
                <div class="price-cell">
                  <span class="price-val">{{ formatPrice(car.price) }}</span>
                </div>
              </td>

              <!-- Switch Disponibilité -->
              <td style="text-align: center">
                <button
                  type="button"
                  class="status-toggle-btn"
                  :class="car.available ? 'is-active' : 'is-inactive'"
                  @click="toggleField(car, 'available')"
                  :title="car.available ? 'Marquer comme vendu' : 'Marquer comme disponible'"
                >
                  <span class="toggle-dot"></span>
                  <span class="toggle-text">{{ car.available ? "Disponible" : "Vendu" }}</span>
                </button>
              </td>

              <!-- Switch À la une -->
              <td style="text-align: center">
                <button
                  type="button"
                  class="star-toggle-btn"
                  :class="{ 'is-featured': car.featured }"
                  @click="toggleField(car, 'featured')"
                  :title="car.featured ? 'Retirer de la sélection' : 'Mettre en avant sur l\'accueil'"
                >
                  <Star :size="16" :fill="car.featured ? 'currentColor' : 'none'" />
                </button>
              </td>

              <!-- Boutons Actions -->
              <td style="text-align: right">
                <div class="row-actions">
                  <RouterLink
                    :to="`/voitures/${car.id}`"
                    target="_blank"
                    class="action-btn"
                    title="Voir la fiche publique"
                  >
                    <ExternalLink :size="15" />
                  </RouterLink>

                  <button
                    type="button"
                    class="action-btn edit-btn"
                    @click="openEdit(car)"
                    title="Modifier la fiche du véhicule"
                  >
                    <Pencil :size="15" />
                  </button>

                  <button
                    type="button"
                    class="action-btn delete-btn"
                    @click="removeCar(car)"
                    title="Supprimer définitivement"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modale d'Ajout / Modification Structurée par Sections -->
    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-header-text">
            <h2>{{ editingId ? "Modifier le Véhicule" : "Nouveau Véhicule au Catalogue" }}</h2>
            <p>Renseignez les spécifications précises du véhicule pour la vitrine.</p>
          </div>
          <button type="button" class="modal-close-btn" @click="showForm = false">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="saveCar" class="modal-form">
          <!-- Section 1 : Informations Générales -->
          <div class="form-section-card">
            <div class="form-section-title">
              <Car :size="16" class="title-icon" />
              <span>Informations Générales</span>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Marque *</label>
                <input
                  v-model="form.brand"
                  type="text"
                  class="form-input"
                  placeholder="Ex: BYD, Chery, Haval, Geely..."
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Modèle *</label>
                <input
                  v-model="form.model"
                  type="text"
                  class="form-input"
                  placeholder="Ex: Song Plus, Tiggo 8, H6..."
                  required
                />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Année Modèle</label>
                <input
                  v-model="form.year"
                  type="number"
                  min="2010"
                  max="2030"
                  class="form-input"
                  placeholder="Ex: 2024"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Prix Commercial (FCFA) *</label>
                <input
                  v-model="form.price"
                  type="number"
                  min="0"
                  step="100000"
                  class="form-input"
                  placeholder="Ex: 14500000"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Section 2 : Spécifications Mécaniques -->
          <div class="form-section-card">
            <div class="form-section-title">
              <Cog :size="16" class="title-icon" />
              <span>Caractéristiques & Motorisation</span>
            </div>

            <div class="grid-3">
              <div class="form-group">
                <label class="form-label">Carburant</label>
                <select v-model="form.fuel" class="form-select">
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Boîte de vitesses</label>
                <select v-model="form.transmission" class="form-select">
                  <option value="Automatique">Automatique</option>
                  <option value="Manuelle">Manuelle</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Kilométrage (km)</label>
                <input
                  v-model="form.mileage"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="0 si neuf"
                />
              </div>
            </div>
          </div>

          <!-- Section 3 : Photographie Principale -->
          <div class="form-section-card">
            <div class="form-section-title">
              <ImageIcon :size="16" class="title-icon" />
              <span>Photographie du Véhicule</span>
            </div>

            <div class="photo-upload-area">
              <div class="upload-preview-box">
                <img
                  v-if="filePreview"
                  :src="filePreview"
                  alt="Aperçu du véhicule"
                  class="preview-image"
                />
                <div v-else class="preview-placeholder">
                  <ImageIcon :size="32" />
                  <span>Aucune photo sélectionnée</span>
                </div>
              </div>

              <div class="upload-controls">
                <label class="btn btn-secondary upload-btn">
                  <Upload :size="16" />
                  <span>Choisir un fichier image</span>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileSelected"
                    class="hidden-file-input"
                  />
                </label>
                <span class="upload-hint">Format recommandé : JPG ou PNG de bonne qualité (1200x800 px).</span>

                <div class="form-group url-group">
                  <label class="form-label">Ou URL directe de l'image</label>
                  <input
                    v-model="form.image_url"
                    type="url"
                    class="form-input"
                    placeholder="https://..."
                    @input="filePreview = form.image_url"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4 : Description & Paramètres -->
          <div class="form-section-card">
            <div class="form-section-title">
              <Star :size="16" class="title-icon" />
              <span>Description & Visibilité</span>
            </div>

            <div class="form-group">
              <label class="form-label">Description commerciale du véhicule</label>
              <textarea
                v-model="form.description"
                class="form-textarea"
                rows="3"
                placeholder="Équipements notables, état du véhicule, options intérieures..."
              ></textarea>
            </div>

            <div class="switches-row">
              <label class="custom-checkbox">
                <input type="checkbox" v-model="form.available" />
                <span class="checkbox-box"></span>
                <span class="checkbox-text">Véhicule disponible à la vente</span>
              </label>

              <label class="custom-checkbox">
                <input type="checkbox" v-model="form.featured" />
                <span class="checkbox-box"></span>
                <span class="checkbox-text">Mettre en avant sur la page d'accueil</span>
              </label>
            </div>
          </div>

          <div v-if="formError" class="modal-error-banner">
            <AlertCircle :size="16" />
            <span>{{ formError }}</span>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showForm = false"
              :disabled="saving"
            >
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <CheckCircle2 :size="16" />
              <span>{{ saving ? "Enregistrement en cours..." : "Enregistrer le véhicule" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cars-admin {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* KPI Cards */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-xs);
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bg-slate {
  background-color: var(--color-slate-100);
  color: var(--color-slate-700);
}

.bg-green {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.bg-amber {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.bg-red {
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
}

.metric-body {
  display: flex;
  flex-direction: column;
}

.metric-num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-slate-950);
  line-height: 1.1;
}

.metric-title {
  font-size: 0.8rem;
  color: var(--color-slate-500);
  font-weight: 500;
}

/* Barre d'outils */
.toolbar-card {
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

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  padding: 0 0.75rem;
  min-width: 260px;
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

.filter-pills {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-pill {
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-slate-200);
  background-color: var(--color-slate-50);
  color: var(--color-slate-600);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  background-color: var(--color-slate-100);
}

.filter-pill.active {
  background-color: var(--color-slate-900);
  color: var(--color-white);
  border-color: var(--color-slate-900);
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
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--color-slate-200);
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: var(--color-slate-50);
}

/* Vignette */
.car-thumb-wrap {
  width: 64px;
  height: 44px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-slate-100);
  border: 1px solid var(--color-slate-200);
}

.car-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-thumb {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--color-slate-400);
}

/* Identité */
.car-identity {
  display: flex;
  flex-direction: column;
}

.car-brand {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-brand);
}

.car-model {
  font-size: 0.95rem;
  color: var(--color-slate-900);
}

.car-year {
  font-size: 0.76rem;
  color: var(--color-slate-500);
}

/* Puces */
.car-specs-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.spec-tag {
  font-size: 0.76rem;
  background-color: var(--color-slate-100);
  color: var(--color-slate-600);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
}

.price-cell {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-slate-950);
  font-variant-numeric: tabular-nums;
}

/* Toggle boutons */
.status-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.status-toggle-btn.is-active {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border-color: var(--color-success-border);
}

.status-toggle-btn.is-inactive {
  background-color: var(--color-slate-100);
  color: var(--color-slate-500);
  border-color: var(--color-slate-200);
}

.toggle-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.star-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-slate-300);
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.star-toggle-btn:hover {
  color: #f59e0b;
}

.star-toggle-btn.is-featured {
  color: #f59e0b;
}

/* Actions ligne */
.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
  background-color: var(--color-white);
  color: var(--color-slate-600);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

.edit-btn:hover {
  border-color: var(--color-slate-400);
}

.delete-btn:hover {
  border-color: var(--color-danger-border);
  color: var(--color-danger);
  background-color: var(--color-danger-bg);
}

/* Modale */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 15, 21, 0.65);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-dialog {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-slate-200);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-slate-200);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-slate-950);
}

.modal-header p {
  font-size: 0.8rem;
  color: var(--color-slate-500);
  margin-top: 0.2rem;
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--color-slate-400);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.modal-close-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

.modal-form {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-section-card {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.1rem;
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-slate-800);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.title-icon {
  color: var(--color-brand);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

/* Upload */
.photo-upload-area {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1.25rem;
  align-items: start;
}

.upload-preview-box {
  aspect-ratio: 4 / 3;
  background-color: var(--color-slate-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-slate-300);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--color-slate-400);
  font-size: 0.72rem;
  text-align: center;
  padding: 0.5rem;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.upload-btn {
  align-self: flex-start;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.hidden-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--color-slate-500);
}

.url-group {
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.switches-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox input {
  display: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}

.custom-checkbox input:checked + .checkbox-box {
  background-color: var(--color-brand);
  border-color: var(--color-brand);
}

.custom-checkbox input:checked + .checkbox-box::after {
  content: "";
  width: 5px;
  height: 9px;
  border: solid var(--color-white);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-text {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-slate-700);
}

.modal-error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger-border);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-slate-200);
}

.table-loading,
.table-empty {
  padding: 3.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-slate-500);
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }

  .photo-upload-area {
    grid-template-columns: 1fr;
  }
}
</style>
