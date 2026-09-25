<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";
import { useSiteStore } from "@/stores/site";
import {
  Sliders,
  Phone,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Car,
  Tag,
  Star,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Layers,
  Sparkles,
} from "lucide-vue-next";

const site = useSiteStore();

// Copie profonde du store pour le formulaire
const form = ref(JSON.parse(JSON.stringify(site.settings)));
const companyLogoFile = ref(null);
const companyLogoPreview = ref(form.value.company_logo_url || "");
const heroFile = ref(null);
const heroPreview = ref(form.value.hero_image || "");
const saving = ref(false);
const message = ref("");
const error = ref("");

function onHeroFileChange(e) {
  const f = e.target.files[0] || null;
  heroFile.value = f;
  if (f) {
    heroPreview.value = URL.createObjectURL(f);
  }
}

function onCompanyLogoFileChange(e) {
  const f = e.target.files[0] || null;
  companyLogoFile.value = f;
  if (f) {
    companyLogoPreview.value = URL.createObjectURL(f);
  }
}

async function save() {
  message.value = "";
  error.value = "";
  saving.value = true;
  try {
    if (companyLogoFile.value) {
      form.value.company_logo_url = await uploadImage(
        companyLogoFile.value,
        "company",
      );
      companyLogoFile.value = null;
    }

    if (heroFile.value) {
      form.value.hero_image = await uploadImage(heroFile.value, "site");
      heroFile.value = null;
    }

    form.value.budget_max = Number(form.value.budget_max) || 0;
    form.value.whatsapp = String(form.value.whatsapp).replace(/\D/g, "");

    const { error: err } = await supabase
      .from("site_settings")
      .update({ data: form.value })
      .eq("id", 1);

    if (err) throw err;

    await site.load();
    message.value =
      "Réglages enregistrés et appliqués avec succès sur la vitrine.";
  } catch (e) {
    error.value = "Erreur lors de l'enregistrement : " + e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form class="site-admin" @submit.prevent="save">
    <!-- En-tête -->
    <div class="header-intro">
      <p class="intro-desc">
        Personnalisez les coordonnées commerciales de China Automobile, le
        bandeau d'accueil et les sections visibles sur la vitrine publique.
      </p>
    </div>

    <!-- Section 1 : Contact & Coordonnées -->
    <section class="admin-card-section">
      <div class="card-section-head">
        <div class="head-icon-wrap">
          <Phone :size="18" />
        </div>
        <div>
          <h3>Coordonnées Commerciales & Contact</h3>
          <p>
            Ces numéros et adresses s'affichent dans la barre de navigation et
            dans le pied de page.
          </p>
        </div>
      </div>

      <div class="card-section-body">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Téléphone affiché</label>
            <input
              v-model="form.phone"
              type="text"
              class="form-input"
              placeholder="+225 07 00 00 00 00"
            />
            <span class="field-hint"
              >Format avec indicatif pays pour lisibilité client.</span
            >
          </div>

          <div class="form-group">
            <label class="form-label">Numéro WhatsApp direct</label>
            <input
              v-model="form.whatsapp"
              type="text"
              class="form-input"
              placeholder="2250700000000"
            />
            <span class="field-hint"
              >Chiffres uniquement avec indicatif (ex: 2250700000000).</span
            >
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Adresse commerciale / Showroom</label>
          <input
            v-model="form.address"
            type="text"
            class="form-input"
            placeholder="Abidjan, Côte d'Ivoire"
          />
        </div>
      </div>
    </section>

    <!-- Section 2 : Logo officiel -->
    <section class="admin-card-section">
      <div class="card-section-head">
        <div class="head-icon-wrap">
          <ImageIcon :size="18" />
        </div>
        <div>
          <h3>Logo officiel de China Automobile</h3>
          <p>
            Ce logo sera utilisé dans le header et le footer de la vitrine
            publique.
          </p>
        </div>
      </div>

      <div class="card-section-body">
        <div class="company-logo-config">
          <div class="company-logo-preview-frame">
            <img
              v-if="companyLogoPreview"
              :src="companyLogoPreview"
              alt="Aperçu du logo de China Automobile"
              class="company-logo-preview"
            />
            <div v-else class="company-logo-empty">
              <ImageIcon :size="30" />
              <span>Aucun logo configuré</span>
            </div>
          </div>

          <div class="company-logo-upload-col">
            <label class="form-label">Logo actuel / nouveau logo</label>
            <label class="btn btn-secondary btn-sm upload-btn">
              <Upload :size="15" />
              <span>Choisir le logo officiel</span>
              <input
                type="file"
                accept="image/*"
                class="hidden-file-input"
                @change="onCompanyLogoFileChange"
              />
            </label>
            <span class="field-hint">
              Format PNG ou SVG recommandé, avec fond transparent si nécessaire.
              Le changement est appliqué après l'enregistrement.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3 : Bandeau d'Accueil (Hero) -->
    <section class="admin-card-section">
      <div class="card-section-head">
        <div class="head-icon-wrap">
          <ImageIcon :size="18" />
        </div>
        <div>
          <h3>Bandeau d'Accueil Principal (Hero)</h3>
          <p>
            Titre accrocheur et photographie de couverture pour la première
            impression des visiteurs.
          </p>
        </div>
      </div>

      <div class="card-section-body">
        <div class="form-group">
          <label class="form-label">Titre principal (H1)</label>
          <input v-model="form.hero_title" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">Sous-titre explicatif</label>
          <textarea
            v-model="form.hero_subtitle"
            rows="2"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="hero-photo-config">
          <div class="hero-preview-col">
            <div class="hero-preview-frame">
              <img
                v-if="heroPreview"
                :src="heroPreview"
                alt="Aperçu bandeau"
                class="hero-img"
              />
              <div v-else class="hero-no-img">
                <ImageIcon :size="32" />
                <span>Image par défaut du thème</span>
              </div>
            </div>
          </div>

          <div class="hero-upload-col">
            <label class="form-label">Remplacer l'image de fond</label>
            <label class="btn btn-secondary btn-sm upload-btn">
              <Upload :size="15" />
              <span>Choisir une image haute résolution</span>
              <input
                type="file"
                accept="image/*"
                class="hidden-file-input"
                @change="onHeroFileChange"
              />
            </label>
            <span class="field-hint">
              Format paysage recommandé (1920x1080 px). Une superposition sombre
              automatique garantit la lisibilité des textes.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4 : Modules de la Vitrine -->
    <section class="admin-card-section">
      <div class="card-section-head">
        <div class="head-icon-wrap">
          <Layers :size="18" />
        </div>
        <div>
          <h3>Paramètres des Sections Vitrine</h3>
          <p>
            Contrôlez l'affichage et les titres des blocs de véhicules sur la
            page d'accueil.
          </p>
        </div>
      </div>

      <div class="card-section-body modules-list">
        <!-- Arrivages récents -->
        <div class="module-config-box">
          <div class="module-header-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.show_latest" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text"
                >Afficher la section "Arrivages récents"</span
              >
            </label>
          </div>

          <div v-if="form.show_latest" class="grid-2 module-fields">
            <div class="form-group">
              <label class="form-label">Titre du bloc</label>
              <input
                v-model="form.latest_title"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Sous-titre</label>
              <input
                v-model="form.latest_subtitle"
                type="text"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Petit budget -->
        <div class="module-config-box">
          <div class="module-header-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.show_budget" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text"
                >Afficher la sélection "Petits budgets"</span
              >
            </label>
          </div>

          <div v-if="form.show_budget" class="module-fields">
            <div class="form-group">
              <label class="form-label">Plafond tarifaire (FCFA)</label>
              <input
                v-model="form.budget_max"
                type="number"
                step="500000"
                class="form-input"
              />
              <span class="field-hint">
                Les véhicules en vente sous ce montant s'afficheront
                automatiquement dans ce bloc.
              </span>
            </div>
          </div>
        </div>

        <!-- Marques -->
        <div class="module-config-box">
          <div class="module-header-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.show_brands" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text"
                >Afficher la section des marques partenaires</span
              >
            </label>
          </div>

          <div v-if="form.show_brands" class="module-fields">
            <div class="form-group">
              <label class="form-label">Titre du bloc marques</label>
              <input
                v-model="form.brands_title"
                type="text"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Témoignages & Avis -->
        <div class="module-config-box">
          <div class="module-header-row">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="form.show_testimonials" />
              <span class="checkbox-box"></span>
              <span class="checkbox-text"
                >Afficher les avis clients sur l'accueil</span
              >
            </label>
          </div>

          <div v-if="form.show_testimonials" class="module-fields">
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Titre du bloc</label>
                <input
                  v-model="form.testimonials_title"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Sous-titre</label>
                <input
                  v-model="form.testimonials_subtitle"
                  type="text"
                  class="form-input"
                />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Note Google (ex: 4,8)</label>
                <input
                  v-model="form.google_rating"
                  type="text"
                  class="form-input"
                  placeholder="Laisser vide si non disponible"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Note Facebook (ex: 4,7)</label>
                <input
                  v-model="form.facebook_rating"
                  type="text"
                  class="form-input"
                  placeholder="Laisser vide si non disponible"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5 : Parcours d'achat (Étapes) -->
    <section class="admin-card-section">
      <div class="card-section-head">
        <div class="head-icon-wrap">
          <Sparkles :size="18" />
        </div>
        <div>
          <h3>Parcours d'achat (Étapes)</h3>
          <p>
            Détaillez les étapes de découverte, de demande d'informations et
            d'achat.
          </p>
        </div>
      </div>

      <div class="card-section-body">
        <div class="form-group">
          <label class="form-label">Titre général de la section</label>
          <input v-model="form.steps_title" type="text" class="form-input" />
        </div>

        <div class="steps-grid-config">
          <div v-for="(step, i) in form.steps" :key="i" class="step-edit-card">
            <div class="step-index-tag">Étape {{ i + 1 }}</div>
            <div class="form-group">
              <label class="form-label">Intitulé de l'étape</label>
              <input v-model="step.title" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Explication</label>
              <textarea
                v-model="step.text"
                rows="2"
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Barre d'enregistrement persistante -->
    <div class="sticky-savebar">
      <div class="savebar-inner">
        <div class="savebar-feedback">
          <div v-if="message" class="alert-inline success">
            <CheckCircle2 :size="16" />
            <span>{{ message }}</span>
          </div>
          <div v-if="error" class="alert-inline danger">
            <AlertCircle :size="16" />
            <span>{{ error }}</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="saving">
          <Save :size="16" />
          <span>{{
            saving
              ? "Enregistrement en cours..."
              : "Enregistrer les modifications"
          }}</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.site-admin {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding-bottom: 5rem;
}

.header-intro {
  margin-bottom: 0.5rem;
}

.intro-desc {
  font-size: 0.95rem;
  color: var(--color-slate-600);
  margin: 0;
}

/* Cartes Sections */
.admin-card-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.card-section-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--color-slate-50);
  border-bottom: 1px solid var(--color-slate-200);
}

.head-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  color: var(--color-brand);
  border: 1px solid var(--color-slate-200);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.card-section-head h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 0.2rem;
}

.card-section-head p {
  font-size: 0.82rem;
  color: var(--color-slate-500);
  margin: 0;
}

.card-section-body {
  padding: 1.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.field-hint {
  display: block;
  font-size: 0.76rem;
  color: var(--color-slate-400);
  margin-top: 0.35rem;
}

/* Hero photo config */
.company-logo-config {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: center;
}

.company-logo-preview-frame {
  min-height: 120px;
  padding: 1rem;
  display: grid;
  place-items: center;
  background-color: var(--color-slate-900);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-300);
}

.company-logo-preview {
  display: block;
  max-width: 100%;
  max-height: 96px;
  object-fit: contain;
}

.company-logo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-slate-400);
  font-size: 0.78rem;
}

.company-logo-upload-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hero-photo-config {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-slate-100);
  align-items: center;
}

.hero-preview-frame {
  aspect-ratio: 16 / 9;
  background-color: var(--color-slate-900);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-slate-300);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-no-img {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-slate-500);
  font-size: 0.78rem;
}

.hero-upload-col {
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

/* Modules */
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.module-config-box {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1rem 1.25rem;
}

.module-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.module-fields {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-slate-200);
}

/* Checkbox custom */
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.65rem;
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
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-slate-800);
}

/* Étapes config */
.steps-grid-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}

.step-edit-card {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  position: relative;
}

.step-index-tag {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-brand);
  margin-bottom: 0.75rem;
}

/* Sticky savebar */
.sticky-savebar {
  position: fixed;
  bottom: 0;
  left: 260px;
  right: 0;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-slate-200);
  padding: 1rem 2rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 35;
}

.savebar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1240px;
  margin: 0 auto;
}

.alert-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.alert-inline.success {
  color: var(--color-success);
}

.alert-inline.danger {
  color: var(--color-danger);
}

@media (max-width: 900px) {
  .company-logo-config {
    grid-template-columns: 1fr;
  }

  .sticky-savebar {
    left: 0;
    padding: 1rem 1.25rem;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .hero-photo-config {
    grid-template-columns: 1fr;
  }
}
</style>
