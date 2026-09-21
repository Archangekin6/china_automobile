<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";
import {
  Tag,
  Plus,
  Upload,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Car,
} from "lucide-vue-next";

const brands = ref([]);
const name = ref("");
const file = ref(null);
const filePreview = ref("");
const fileInput = ref(null);
const saving = ref(false);
const error = ref("");
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const { data, error: err } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (err) throw err;
    brands.value = data || [];
  } catch (e) {
    console.error("Erreur chargement marques :", e);
  } finally {
    loading.value = false;
  }
}

function onFileChange(e) {
  const f = e.target.files[0] || null;
  file.value = f;
  if (f) {
    filePreview.value = URL.createObjectURL(f);
  } else {
    filePreview.value = "";
  }
}

async function add() {
  error.value = "";
  if (!name.value.trim()) {
    error.value = "Le nom de la marque automobile est obligatoire.";
    return;
  }

  saving.value = true;
  try {
    const logo_url = file.value
      ? await uploadImage(file.value, "brands")
      : null;

    const { error: err } = await supabase
      .from("brands")
      .insert({ name: name.value.trim(), logo_url });

    if (err) throw err;

    name.value = "";
    file.value = null;
    filePreview.value = "";
    if (fileInput.value) fileInput.value.value = "";
    await load();
  } catch (e) {
    error.value = "Erreur lors de l'enregistrement : " + e.message;
  } finally {
    saving.value = false;
  }
}

async function remove(b) {
  const confirmed = confirm(`Êtes-vous certain de vouloir supprimer la marque ${b.name} ?`);
  if (!confirmed) return;

  try {
    const { error: err } = await supabase.from("brands").delete().eq("id", b.id);
    if (err) throw err;
    await load();
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

onMounted(load);
</script>

<template>
  <div class="brands-admin">
    <!-- Formulaire d'ajout de marque -->
    <div class="card-box">
      <div class="card-header">
        <div class="card-title-group">
          <Tag :size="18" class="text-brand" />
          <h2>Ajouter une Marque Partenaire</h2>
        </div>
        <p class="card-desc">
          Les marques ajoutées ici apparaîtront sur la vitrine et permettront aux clients de filtrer le catalogue.
        </p>
      </div>

      <form @submit.prevent="add" class="add-brand-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nom du Constructeur *</label>
            <input
              v-model="name"
              type="text"
              class="form-input"
              placeholder="Ex: BYD, Chery, Haval, Geely, Zeekr..."
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Logo Officiel (PNG fond transparent recommandé)</label>
            <div class="file-upload-row">
              <label class="btn btn-secondary btn-sm upload-btn">
                <Upload :size="14" />
                <span>Sélectionner le logo</span>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden-file-input"
                  @change="onFileChange"
                />
              </label>

              <!-- Aperçu miniature -->
              <div v-if="filePreview" class="preview-box">
                <img :src="filePreview" alt="Aperçu" class="preview-img" />
              </div>
              <span v-else class="preview-empty-hint">Aucun fichier choisi</span>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-alert">
          <AlertCircle :size="16" />
          <span>{{ error }}</span>
        </div>

        <div class="form-submit-row">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <Plus :size="16" />
            <span>{{ saving ? "Enregistrement en cours..." : "Ajouter la marque" }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Grille des marques existantes -->
    <div class="card-box">
      <div class="card-header">
        <h2>Marques Répertoriées ({{ brands.length }})</h2>
      </div>

      <div v-if="loading" class="empty-state">
        <Car :size="24" class="anim-spin" />
        <p>Chargement des marques...</p>
      </div>

      <div v-else-if="brands.length === 0" class="empty-state">
        <Tag :size="32" class="text-slate" />
        <p>Aucune marque enregistrée pour le moment.</p>
      </div>

      <div v-else class="brands-grid">
        <div v-for="b in brands" :key="b.id" class="brand-item-card">
          <div class="logo-frame">
            <img v-if="b.logo_url" :src="b.logo_url" :alt="b.name" class="brand-logo" />
            <div v-else class="logo-placeholder">
              <Tag :size="24" />
            </div>
          </div>
          <strong class="brand-title">{{ b.name }}</strong>
          <button
            type="button"
            class="delete-brand-btn"
            @click="remove(b)"
            title="Supprimer la marque"
          >
            <Trash2 :size="14" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brands-admin {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.card-box {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-xs);
}

.card-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-slate-100);
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title-group h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-slate-950);
}

.card-header h2 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-slate-950);
}

.card-desc {
  font-size: 0.84rem;
  color: var(--color-slate-500);
  margin-top: 0.25rem;
}

.add-brand-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.file-upload-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}

.upload-btn {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.hidden-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.preview-box {
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  padding: 4px;
  background-color: var(--color-slate-50);
  display: grid;
  place-items: center;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-empty-hint {
  font-size: 0.8rem;
  color: var(--color-slate-400);
}

.error-alert {
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

.form-submit-row {
  display: flex;
  justify-content: flex-end;
}

/* Grille Marques */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 1.25rem;
}

.brand-item-card {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.15s ease;
}

.brand-item-card:hover {
  border-color: var(--color-slate-300);
  background-color: var(--color-white);
  box-shadow: var(--shadow-xs);
}

.logo-frame {
  width: 72px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  color: var(--color-slate-400);
}

.brand-title {
  font-size: 0.95rem;
  color: var(--color-slate-900);
  margin-bottom: 0.75rem;
}

.delete-brand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-danger-border);
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.delete-brand-btn:hover {
  background-color: var(--color-danger-bg);
}

.empty-state {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-slate-500);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
