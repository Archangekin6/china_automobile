<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { supabase } from "@/lib/supabase";
import {
  isValidPhoneNumber,
  normalizePhoneNumber,
  useSiteStore,
} from "@/stores/site";
import {
  Car,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Cog,
  Gauge,
  Calendar,
  Phone,
  MessageCircle,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Send,
  Ship,
  Sparkles,
  ArrowLeft,
} from "lucide-vue-next";

const site = useSiteStore();
const route = useRoute();

const car = ref(null);
const loading = ref(true);
const loadError = ref("");

// Formulaire de contact / commande
const showForm = ref(false);
const form = ref({ customer_name: "", phone: "", email: "", message: "" });
const sending = ref(false);
const sent = ref(false);
const formError = ref("");

const formatNumber = (n) => new Intl.NumberFormat("fr-FR").format(n);
const formatPrice = (n) =>
  n === null || n === undefined || n === ""
    ? "Prix sur demande"
    : new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

// Lien WhatsApp personnalisé
const whatsappLink = computed(() => {
  if (!car.value) return "#";
  return site.waLink(
    `Bonjour China Automobile, je suis intéressé par le véhicule ${car.value.brand} ${car.value.model} (${car.value.year || "Récent"}). Est-il toujours disponible pour une visite ou une commande ?`,
  );
});

async function loadCar() {
  loading.value = true;
  loadError.value = "";
  car.value = null;
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", route.params.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    car.value = data;
  } catch (err) {
    console.error("Erreur de chargement du véhicule :", err);
    loadError.value =
      "Impossible de charger ce véhicule pour le moment. Vérifiez votre connexion puis réessayez.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadCar);

async function submitOrder() {
  formError.value = "";
  if (!car.value?.available) {
    formError.value =
      "Ce véhicule n'est plus disponible. Utilisez WhatsApp pour demander un modèle équivalent.";
    return;
  }
  if (!form.value.customer_name.trim() || !form.value.phone.trim()) {
    formError.value =
      "Veuillez renseigner votre nom et votre numéro de téléphone.";
    return;
  }
  if (!isValidPhoneNumber(form.value.phone)) {
    formError.value =
      "Veuillez saisir un numéro ivoirien valide, par exemple +225 07 00 00 00 00.";
    return;
  }

  sending.value = true;
  try {
    const { error } = await supabase.from("orders").insert({
      car_id: car.value.id,
      customer_name: form.value.customer_name.trim(),
      phone: normalizePhoneNumber(form.value.phone),
      email: form.value.email ? form.value.email.trim() : null,
      message: form.value.message ? form.value.message.trim() : null,
    });

    if (error) throw error;
    sent.value = true;
  } catch (err) {
    formError.value =
      "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous joindre sur WhatsApp.";
    console.error(err);
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="detail-page">
    <!-- Fil d'Ariane & En-tête -->
    <div class="detail-header">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
          <RouterLink to="/">Accueil</RouterLink>
          <ChevronRight :size="14" class="crumb-sep" />
          <RouterLink to="/voitures">Catalogue</RouterLink>
          <ChevronRight :size="14" class="crumb-sep" />
          <span v-if="car" class="crumb-active"
            >{{ car.brand }} {{ car.model }}</span
          >
          <span v-else class="crumb-active">Détail du véhicule</span>
        </nav>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="container loading-container">
      <div class="loading-box">
        <Car :size="36" class="loading-icon" />
        <p>Chargement des caractéristiques du véhicule...</p>
      </div>
    </div>

    <!-- Véhicule Introuvable -->
    <div v-else-if="loadError" class="container not-found-container">
      <div class="not-found-card">
        <AlertCircle :size="48" class="text-danger" />
        <h2>Le véhicule ne peut pas être chargé</h2>
        <p>{{ loadError }}</p>
        <button type="button" class="btn btn-primary" @click="loadCar">
          <ArrowLeft :size="16" />
          <span>Réessayer</span>
        </button>
      </div>
    </div>

    <div v-else-if="!car" class="container not-found-container">
      <div class="not-found-card">
        <AlertCircle :size="48" class="text-danger" />
        <h2>Véhicule introuvable ou retiré</h2>
        <p>Ce véhicule n'est plus répertorié dans notre catalogue actif.</p>
        <RouterLink to="/voitures" class="btn btn-primary">
          <ArrowLeft :size="16" />
          <span>Retourner au catalogue complet</span>
        </RouterLink>
      </div>
    </div>

    <!-- Fiche Véhicule Principale -->
    <div v-else class="container detail-content">
      <div class="detail-grid">
        <!-- Colonne Gauche : Visuel & Description & Fiche Technique -->
        <div class="main-column">
          <!-- Carte Photo HD -->
          <div class="photo-showcase">
            <div class="image-wrapper">
              <img
                v-if="car.image_url"
                :src="car.image_url"
                :alt="`${car.brand} ${car.model}`"
                class="main-car-photo"
              />
              <div v-else class="no-photo-box">
                <Car :size="48" stroke-width="1.5" />
                <span>Photographie en cours de préparation</span>
              </div>

              <!-- Badges de statut sur l'image -->
              <div class="image-badges">
                <span v-if="car.available" class="badge badge-available">
                  Disponible
                </span>
                <span v-else class="badge badge-sold"> Vendu </span>
                <span v-if="car.featured" class="badge badge-featured">
                  <Sparkles :size="12" />
                  Sélection du mois
                </span>
              </div>
            </div>
          </div>

          <!-- Spécifications Techniques Concessionnaire -->
          <section class="specs-section">
            <h2 class="section-heading">Caractéristiques Techniques</h2>
            <div class="specs-table-grid">
              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <Car :size="18" />
                </div>
                <div>
                  <span class="spec-label">Constructeur</span>
                  <strong class="spec-val">{{ car.brand }}</strong>
                </div>
              </div>

              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <Calendar :size="18" />
                </div>
                <div>
                  <span class="spec-label">Année modèle</span>
                  <strong class="spec-val">{{
                    car.year || "Non précisée"
                  }}</strong>
                </div>
              </div>

              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <Cog :size="18" />
                </div>
                <div>
                  <span class="spec-label">Transmission</span>
                  <strong class="spec-val">{{
                    car.transmission || "Automatique"
                  }}</strong>
                </div>
              </div>

              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <Fuel :size="18" />
                </div>
                <div>
                  <span class="spec-label">Énergie / Moteur</span>
                  <strong class="spec-val">{{ car.fuel || "Essence" }}</strong>
                </div>
              </div>

              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <Gauge :size="18" />
                </div>
                <div>
                  <span class="spec-label">Kilométrage</span>
                  <strong class="spec-val">
                    {{
                      car.mileage
                        ? `${formatNumber(car.mileage)} km`
                        : "0 km (Neuf)"
                    }}
                  </strong>
                </div>
              </div>

              <div class="spec-cell">
                <div class="spec-cell-icon">
                  <CheckCircle2 :size="18" />
                </div>
                <div>
                  <span class="spec-label">Statut</span>
                  <strong
                    class="spec-val"
                    :class="car.available ? 'text-success' : 'text-slate'"
                  >
                    {{ car.available ? "Disponible" : "Vendu / indisponible" }}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <!-- Description Détaillée -->
          <section v-if="car.description" class="description-section">
            <h2 class="section-heading">Présentation du Véhicule</h2>
            <div class="description-text">
              <p>{{ car.description }}</p>
            </div>
          </section>

          <!-- Piliers de Confiance Achat Sécurisé -->
          <section class="guarantees-section">
            <h2 class="section-heading">Engagements China Automobile</h2>
            <div class="guarantees-grid">
              <div class="guarantee-box">
                <ShieldCheck :size="20" class="guarantee-icon" />
                <div>
                  <h4>Informations disponibles</h4>
                  <p>
                    Consultez les caractéristiques et les éléments affichés sur
                    cette fiche.
                  </p>
                </div>
              </div>

              <div class="guarantee-box">
                <FileCheck2 :size="20" class="guarantee-icon" />
                <div>
                  <h4>Prix et statut affichés</h4>
                  <p>
                    Le prix et la disponibilité sont présentés lorsqu'ils sont
                    renseignés.
                  </p>
                </div>
              </div>

              <div class="guarantee-box">
                <Ship :size="20" class="guarantee-icon" />
                <div>
                  <h4>Relation directe</h4>
                  <p>
                    Notre équipe répond à vos questions sur le véhicule et son
                    achat.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Colonne Droite : Panneau Commercial d'Achat -->
        <aside class="sidebar-column">
          <div class="commercial-panel">
            <div class="panel-brand-tag">{{ car.brand }}</div>
            <h1 class="panel-title">{{ car.model }}</h1>
            <div class="panel-year-pill" v-if="car.year">
              Modèle {{ car.year }}
            </div>

            <!-- Prix -->
            <div class="panel-price-box">
              <div class="price-label">Prix commercial</div>
              <div class="price-amount">{{ formatPrice(car.price) }}</div>
              <div class="price-note">Prix affiché à titre commercial</div>
            </div>

            <!-- Statut d'indisponibilité si vendu -->
            <div v-if="!car.available" class="sold-notice">
              <AlertCircle :size="18" />
              <span
                >Ce véhicule n'est plus disponible. Contactez-nous pour obtenir
                des informations sur les véhicules actuellement proposés.</span
              >
            </div>

            <!-- Boutons d'action immédiats -->
            <div class="panel-actions">
              <button
                v-if="car.available"
                type="button"
                class="btn btn-primary btn-lg w-full"
                @click="showForm = !showForm"
              >
                <Send :size="18" />
                <span>{{
                  showForm
                    ? "Masquer le formulaire"
                    : "Demander des informations"
                }}</span>
              </button>

              <a
                v-else
                :href="whatsappLink"
                target="_blank"
                rel="noopener"
                class="btn btn-primary btn-lg w-full"
              >
                <MessageCircle :size="18" />
                <span>Demander un modèle équivalent</span>
              </a>

              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener"
                class="btn btn-whatsapp btn-lg w-full"
              >
                <MessageCircle :size="18" />
                <span>Échanger sur WhatsApp</span>
              </a>

              <a
                :href="site.phoneHref"
                class="btn btn-outline btn-lg w-full call-direct-btn"
              >
                <Phone :size="18" />
                <span>Appeler : {{ site.settings.phone }}</span>
              </a>
            </div>

            <!-- Formulaire de demande sans paiement en ligne -->
            <transition name="expand">
              <div v-if="showForm && !sent" class="order-form-container">
                <div class="form-header">
                  <h3>Formulaire de Demande</h3>
                  <p>
                    Aucun paiement en ligne requis. Notre équipe vous recontacte
                    sous 24h.
                  </p>
                </div>

                <form @submit.prevent="submitOrder" class="order-form">
                  <div class="form-group">
                    <label class="form-label" for="order-name"
                      >Nom et prénom *</label
                    >
                    <input
                      id="order-name"
                      v-model="form.customer_name"
                      type="text"
                      class="form-input"
                      placeholder="Ex: Kouassi Emmanuel"
                      autocomplete="name"
                      maxlength="120"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="order-phone"
                      >Numéro de téléphone *</label
                    >
                    <input
                      id="order-phone"
                      v-model="form.phone"
                      type="tel"
                      class="form-input"
                      placeholder="Ex: +225 07 00 00 00 00"
                      autocomplete="tel"
                      inputmode="tel"
                      maxlength="20"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="order-email"
                      >Email (facultatif)</label
                    >
                    <input
                      id="order-email"
                      v-model="form.email"
                      type="email"
                      class="form-input"
                      placeholder="votre.email@exemple.ci"
                      autocomplete="email"
                      maxlength="160"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="order-message"
                      >Précisions ou questions (facultatif)</label
                    >
                    <textarea
                      id="order-message"
                      v-model="form.message"
                      class="form-textarea"
                      rows="3"
                      placeholder="Ex: disponibilité, caractéristiques ou prix..."
                      maxlength="2000"
                    ></textarea>
                  </div>

                  <div v-if="formError" class="form-error-alert">
                    <AlertCircle :size="16" />
                    <span>{{ formError }}</span>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-full"
                    :disabled="sending"
                  >
                    <Send :size="16" />
                    <span>{{
                      sending
                        ? "Transmission de votre demande..."
                        : "Envoyer ma demande"
                    }}</span>
                  </button>
                </form>
              </div>
            </transition>

            <!-- Message de succès professionnel (ZÉRO EMOJI) -->
            <div v-if="sent" class="order-success-card">
              <div class="success-icon-wrap">
                <CheckCircle2 :size="32" class="text-success" />
              </div>
              <h3>Demande transmise avec succès</h3>
              <p>
                Votre intérêt pour le véhicule
                <strong>{{ car.brand }} {{ car.model }}</strong> a bien été
                enregistré. Notre conseiller commercial vous contactera
                rapidement au <strong>{{ form.phone }}</strong
                >.
              </p>
              <div class="success-actions">
                <a
                  :href="whatsappLink"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-whatsapp"
                >
                  Poursuivre sur WhatsApp
                </a>
              </div>
            </div>

            <!-- Rappel informations -->
            <div class="commercial-footer-notes">
              <div class="note-item">
                <ShieldCheck :size="16" class="note-icon" />
                <span
                  >Informations commerciales présentées selon les données
                  disponibles.</span
                >
              </div>
              <div class="note-item">
                <FileCheck2 :size="16" class="note-icon" />
                <span
                  >Facturation proforma officielle délivrée sur demande.</span
                >
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  background-color: var(--color-slate-50);
  min-height: 85vh;
  padding-bottom: 5rem;
}

/* En-tête */
.detail-header {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-slate-200);
  padding: 1rem 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-slate-500);
}

.breadcrumbs a {
  color: var(--color-slate-600);
}

.breadcrumbs a:hover {
  color: var(--color-brand);
}

.crumb-sep {
  color: var(--color-slate-400);
}

.crumb-active {
  color: var(--color-slate-900);
  font-weight: 600;
}

/* Corps */
.detail-content {
  padding-top: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* Colonne Gauche */
.main-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.photo-showcase {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.image-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  background-color: var(--color-slate-100);
}

.main-car-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-photo-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-slate-400);
  font-size: 0.95rem;
}

.image-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 0.5rem;
}

.badge-available {
  background-color: rgba(5, 150, 105, 0.94);
  color: var(--color-white);
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  backdrop-filter: blur(4px);
}

.badge-sold {
  background-color: rgba(17, 24, 39, 0.92);
  color: var(--color-white);
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  backdrop-filter: blur(4px);
}

.badge-featured {
  background-color: rgba(220, 38, 38, 0.94);
  color: var(--color-white);
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  backdrop-filter: blur(4px);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

/* Sections */
.specs-section,
.description-section,
.guarantees-section {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  box-shadow: var(--shadow-xs);
}

.section-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-slate-950);
  margin-bottom: 1.25rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--color-slate-100);
}

/* Grille Fiche Technique */
.specs-table-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.spec-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background-color: var(--color-slate-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
}

.spec-cell-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  color: var(--color-slate-600);
  display: grid;
  place-items: center;
  border: 1px solid var(--color-slate-200);
  flex-shrink: 0;
}

.spec-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-slate-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.spec-val {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-slate-900);
}

.text-success {
  color: var(--color-success);
}

.text-slate {
  color: var(--color-slate-500);
}

/* Description */
.description-text {
  font-size: 0.95rem;
  color: var(--color-slate-700);
  line-height: 1.7;
}

/* Garanties */
.guarantees-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guarantee-box {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background-color: var(--color-slate-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
}

.guarantee-icon {
  color: var(--color-brand);
  flex-shrink: 0;
  margin-top: 2px;
}

.guarantee-box h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-slate-900);
  margin-bottom: 0.2rem;
}

.guarantee-box p {
  font-size: 0.84rem;
  color: var(--color-slate-600);
  margin: 0;
}

/* Colonne Droite - Panneau Commercial */
.commercial-panel {
  position: sticky;
  top: 90px;
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 1.75rem;
  box-shadow: var(--shadow-md);
}

.panel-brand-tag {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-brand);
  margin-bottom: 0.25rem;
}

.panel-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-slate-950);
  line-height: 1.2;
  margin-bottom: 0.4rem;
}

.panel-year-pill {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-slate-600);
  background-color: var(--color-slate-100);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.25rem;
}

.panel-price-box {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.1rem;
  margin-bottom: 1.25rem;
}

.price-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-slate-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.2rem;
}

.price-amount {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--color-slate-950);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.price-note {
  font-size: 0.78rem;
  color: var(--color-slate-500);
  margin-top: 0.35rem;
}

.sold-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  background-color: var(--color-warning-bg);
  border: 1px solid var(--color-warning-border);
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-sm);
  color: var(--color-warning);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.w-full {
  width: 100%;
}

.call-direct-btn {
  font-size: 0.9rem;
}

/* Formulaire */
.order-form-container {
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-slate-900);
  margin-bottom: 0.25rem;
}

.form-header p {
  font-size: 0.8rem;
  color: var(--color-slate-500);
  margin-bottom: 1rem;
}

.form-error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger-border);
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  margin-bottom: 1rem;
}

/* Message de succès */
.order-success-card {
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  padding: 1.5rem;
  border-radius: var(--radius-sm);
  text-align: center;
  margin-bottom: 1.5rem;
}

.success-icon-wrap {
  margin-bottom: 0.75rem;
}

.order-success-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-success);
  margin-bottom: 0.5rem;
}

.order-success-card p {
  font-size: 0.88rem;
  color: var(--color-slate-700);
  line-height: 1.5;
  margin-bottom: 1.2rem;
}

.commercial-footer-notes {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-slate-100);
}

.note-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--color-slate-500);
}

.note-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

/* Chargement et introuvable */
.loading-container,
.not-found-container {
  padding: 4rem 1.5rem;
  display: flex;
  justify-content: center;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-slate-500);
}

.loading-icon {
  animation: pulse 1.5s infinite;
  color: var(--color-brand);
}

.not-found-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  padding: 3rem 2rem;
  border-radius: var(--radius-md);
  text-align: center;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.not-found-card h2 {
  font-size: 1.4rem;
  color: var(--color-slate-900);
}

.not-found-card p {
  color: var(--color-slate-500);
  margin-bottom: 1rem;
}

.text-danger {
  color: var(--color-danger);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
}

@media (max-width: 960px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .commercial-panel {
    position: static;
  }

  .specs-table-grid {
    grid-template-columns: 1fr;
  }
}
</style>
