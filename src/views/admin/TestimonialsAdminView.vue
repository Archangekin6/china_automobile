<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  User,
  ShieldCheck,
} from "lucide-vue-next";

const items = ref([]);
const author = ref("");
const content = ref("");
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
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) throw err;
    items.value = data || [];
  } catch (e) {
    console.error("Erreur chargement avis :", e);
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
  if (!author.value.trim() || !content.value.trim()) {
    error.value = "Le nom du client et son commentaire sont obligatoires.";
    return;
  }

  saving.value = true;
  try {
    const photo_url = file.value
      ? await uploadImage(file.value, "testimonials")
      : null;

    const { error: err } = await supabase.from("testimonials").insert({
      author: author.value.trim(),
      content: content.value.trim(),
      photo_url,
      visible: true,
    });

    if (err) throw err;

    author.value = "";
    content.value = "";
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

async function toggleVisible(t) {
  const newVisible = !t.visible;
  try {
    const { error: err } = await supabase
      .from("testimonials")
      .update({ visible: newVisible })
      .eq("id", t.id);

    if (err) throw err;
    t.visible = newVisible;
  } catch (e) {
    alert("Erreur lors de la mise à jour : " + e.message);
  }
}

async function remove(t) {
  const confirmed = confirm(`Supprimer le témoignage de ${t.author} ?`);
  if (!confirmed) return;

  try {
    const { error: err } = await supabase.from("testimonials").delete().eq("id", t.id);
    if (err) throw err;
    await load();
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

onMounted(load);
</script>

<template>
  <div class="testimonials-admin">
    <!-- Formulaire d'ajout -->
    <div class="card-box">
      <div class="card-header">
        <div class="card-title-group">
          <MessageSquareQuote :size="20" class="text-brand" />
          <h2>Publier un Témoignage Client Réel</h2>
        </div>
        <div class="reassurance-notice">
          <ShieldCheck :size="16" class="text-slate" />
          <span>Pour préserver la crédibilité de l'entreprise, publiez uniquement de vrais retours d'acheteurs vérifiés avec leur accord explicite.</span>
        </div>
      </div>

      <form @submit.prevent="add" class="add-testimonial-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nom complet ou fonction du client *</label>
            <input
              v-model="author"
              type="text"
              class="form-input"
              placeholder="Ex: M. Konan, Acheteur BYD Song Plus"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Photo du client (facultatif)</label>
            <div class="file-upload-row">
              <label class="btn btn-secondary btn-sm upload-btn">
                <Upload :size="14" />
                <span>Sélectionner une photo</span>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden-file-input"
                  @change="onFileChange"
                />
              </label>

              <div v-if="filePreview" class="avatar-preview-box">
                <img :src="filePreview" alt="Aperçu" class="preview-avatar" />
              </div>
              <span v-else class="preview-empty-hint">Aucun fichier sélectionné</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Commentaire / Témoignage *</label>
          <textarea
            v-model="content"
            class="form-textarea"
            rows="3"
            placeholder="Retour sur la livraison, la qualité du véhicule, l'accompagnement administratif..."
            required
          ></textarea>
        </div>

        <div v-if="error" class="error-alert">
          <AlertCircle :size="16" />
          <span>{{ error }}</span>
        </div>

        <div class="form-submit-row">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <Plus :size="16" />
            <span>{{ saving ? "Enregistrement en cours..." : "Enregistrer le témoignage" }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des avis -->
    <div class="card-box">
      <div class="card-header">
        <h2>Témoignages Enregistrés ({{ items.length }})</h2>
      </div>

      <div v-if="loading" class="empty-state">
        <p>Chargement des avis...</p>
      </div>

      <div v-else-if="items.length === 0" class="empty-state">
        <MessageSquareQuote :size="32" class="text-slate" />
        <p>Aucun témoignage client enregistré. La section restera masquée sur la vitrine.</p>
      </div>

      <div v-else class="testimonials-list">
        <div
          v-for="t in items"
          :key="t.id"
          class="testimonial-item-card"
          :class="{ 'is-hidden': !t.visible }"
        >
          <div class="item-avatar-col">
            <img v-if="t.photo_url" :src="t.photo_url" :alt="t.author" class="item-avatar" />
            <div v-else class="item-avatar-fallback">
              <User :size="18" />
            </div>
          </div>

          <div class="item-content-col">
            <div class="item-header-row">
              <strong class="item-author">{{ t.author }}</strong>
              <span class="status-badge" :class="t.visible ? 'visible' : 'hidden'">
                {{ t.visible ? "En ligne" : "Masqué" }}
              </span>
            </div>
            <p class="item-quote">"{{ t.content }}"</p>
          </div>

          <div class="item-actions-col">
            <button
              type="button"
              class="action-btn toggle-vis-btn"
              :class="{ 'is-off': !t.visible }"
              @click="toggleVisible(t)"
              :title="t.visible ? 'Masquer ce témoignage' : 'Afficher sur la vitrine'"
            >
              <Eye v-if="t.visible" :size="15" />
              <EyeOff v-else :size="15" />
              <span>{{ t.visible ? "Masquer" : "Afficher" }}</span>
            </button>

            <button
              type="button"
              class="action-btn delete-btn"
              @click="remove(t)"
              title="Supprimer définitivement"
            >
              <Trash2 :size="15" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.testimonials-admin {
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
  margin-bottom: 0.35rem;
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

.reassurance-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--color-slate-500);
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  margin-top: 0.5rem;
}

.add-testimonial-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.avatar-preview-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--color-slate-300);
}

.preview-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Liste */
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.testimonial-item-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  transition: all 0.15s ease;
}

.testimonial-item-card.is-hidden {
  opacity: 0.65;
  background-color: #fafafa;
}

.item-avatar-col {
  flex-shrink: 0;
}

.item-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-slate-300);
}

.item-avatar-fallback {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-slate-200);
  color: var(--color-slate-600);
  display: grid;
  place-items: center;
}

.item-content-col {
  flex: 1;
  min-width: 0;
}

.item-header-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.4rem;
}

.item-author {
  font-size: 0.95rem;
  color: var(--color-slate-900);
}

.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
}

.status-badge.visible {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.status-badge.hidden {
  background-color: var(--color-slate-200);
  color: var(--color-slate-600);
}

.item-quote {
  font-size: 0.88rem;
  color: var(--color-slate-700);
  line-height: 1.5;
  margin: 0;
}

.item-actions-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-300);
  border-radius: var(--radius-sm);
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-slate-700);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

.delete-btn {
  border-color: var(--color-danger-border);
  color: var(--color-danger);
}

.delete-btn:hover {
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

  .testimonial-item-card {
    flex-direction: column;
  }

  .item-actions-col {
    flex-direction: row;
  }
}
</style>
