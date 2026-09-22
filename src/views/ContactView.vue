<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useSiteStore } from "@/stores/site";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from "lucide-vue-next";

const site = useSiteStore();

const form = ref({
  name: "",
  phone: "",
  email: "",
  subject: "Demande générale",
  message: "",
});

const sending = ref(false);
const sent = ref(false);
const errorMsg = ref("");

async function submitMessage() {
  errorMsg.value = "";
  if (!form.value.name.trim() || !form.value.phone.trim() || !form.value.message.trim()) {
    errorMsg.value = "Veuillez renseigner votre nom, votre numéro de téléphone et votre message.";
    return;
  }

  sending.value = true;
  try {
    const fullMessage = `[Objet : ${form.value.subject}] ${form.value.message.trim()}`;
    const { error } = await supabase.from("orders").insert({
      customer_name: form.value.name.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email ? form.value.email.trim() : null,
      message: fullMessage,
      status: "nouveau",
    });

    if (error) throw error;
    sent.value = true;
  } catch (err) {
    console.error("Erreur lors de l'envoi du message :", err);
    errorMsg.value = "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous joindre sur WhatsApp.";
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="contact-page">
    <!-- En-tête -->
    <header class="page-header">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Fil d'Ariane">
          <RouterLink to="/">Accueil</RouterLink>
          <span class="crumb-sep">/</span>
          <span class="crumb-active">Contact</span>
        </nav>

        <div class="header-badge">
          <Phone :size="14" />
          <span>Service Commercial & Technique</span>
        </div>
        <h1 class="page-title">Contactez Notre Équipe à Abidjan</h1>
        <p class="page-lead">
          Une question sur un modèle, envie de visiter notre parc ou besoin d'un devis ferme pour une importation directe de Chine ? Nous vous répondons rapidement.
        </p>
      </div>
    </header>

    <div class="container page-body">
      <div class="contact-grid">
        <!-- Colonne Gauche : Coordonnées Directes & Showroom -->
        <div class="contact-info-col">
          <div class="info-card">
            <h3>Nos Canaux Directs</h3>
            <p class="info-subtitle">Échangez avec nos conseillers commerciaux pour un accompagnement personnalisé.</p>

            <div class="channels-list">
              <a :href="site.phoneHref" class="channel-item">
                <div class="channel-icon bg-brand">
                  <Phone :size="20" />
                </div>
                <div>
                  <span class="channel-label">Appel Téléphonique</span>
                  <strong class="channel-val">{{ site.settings.phone }}</strong>
                </div>
              </a>

              <a
                :href="site.waLink('Bonjour China Automobile, je souhaite entrer en contact avec un conseiller.')"
                target="_blank"
                rel="noopener"
                class="channel-item"
              >
                <div class="channel-icon bg-wa">
                  <MessageCircle :size="20" />
                </div>
                <div>
                  <span class="channel-label">Discussion WhatsApp Directe</span>
                  <strong class="channel-val">Messagerie instantanée</strong>
                </div>
              </a>

              <div class="channel-item non-link">
                <div class="channel-icon bg-slate">
                  <MapPin :size="20" />
                </div>
                <div>
                  <span class="channel-label">Showroom & Parc Automobile</span>
                  <strong class="channel-val">{{ site.settings.address }}</strong>
                  <span class="channel-hint">Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte Horaires & Disponibilité -->
          <div class="info-card hours-card">
            <div class="hours-header">
              <Clock :size="20" class="text-brand" />
              <h3>Horaires d'Ouverture</h3>
            </div>

            <div class="hours-table">
              <div class="hours-row">
                <span class="day">Lundi au Vendredi</span>
                <span class="time">08h30 - 18h30</span>
              </div>
              <div class="hours-row">
                <span class="day">Samedi</span>
                <span class="time">09h00 - 16h30</span>
              </div>
              <div class="hours-row closed">
                <span class="day">Dimanche & Jours fériés</span>
                <span class="time">Sur rendez-vous commercial</span>
              </div>
            </div>

            <div class="security-note">
              <ShieldCheck :size="16" class="text-success" />
              <span>Visites et essais de véhicules sur rendez-vous sécurisé.</span>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Formulaire de Contact -->
        <div class="contact-form-col">
          <div class="form-container-card">
            <div class="form-head">
              <h2>Envoyez-Nous un Message</h2>
              <p>Remplissez ce formulaire et notre équipe commerciale vous recontactera sous 24 heures ouvrées.</p>
            </div>

            <div v-if="sent" class="success-box">
              <div class="success-icon-wrap">
                <CheckCircle2 :size="36" class="text-success" />
              </div>
              <h3>Message transmis avec succès</h3>
              <p>
                Merci <strong>{{ form.name }}</strong>. Votre demande a bien été enregistrée. Notre conseiller commercial vous contactera rapidement au numéro <strong>{{ form.phone }}</strong>.
              </p>
              <button type="button" class="btn btn-secondary btn-sm" @click="sent = false">
                Envoyer un autre message
              </button>
            </div>

            <form v-else @submit.prevent="submitMessage" class="contact-form">
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Nom et prénom *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    placeholder="Ex: Kouamé Jean"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Numéro de téléphone *</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="Ex: +225 07 00 00 00 00"
                    required
                  />
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Adresse email (facultatif)</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    placeholder="jean.kouame@exemple.ci"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Objet de votre demande</label>
                  <select v-model="form.subject" class="form-select">
                    <option value="Achat véhicule en stock">Achat d'un véhicule en stock</option>
                    <option value="Devis d'importation de Chine">Demande d'importation sur-mesure</option>
                    <option value="Essai routier showroom">Rendez-vous pour visite / essai</option>
                    <option value="Pièces de rechange & SAV">Pièces de rechange & SAV</option>
                    <option value="Demande générale">Autre renseignement</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Votre message ou précisions sur le véhicule recherché *</label>
                <textarea
                  v-model="form.message"
                  class="form-textarea"
                  rows="4"
                  placeholder="Décrivez votre projet : marque souhaitée, modèle, motorisation, budget..."
                  required
                ></textarea>
              </div>

              <div v-if="errorMsg" class="error-alert">
                <AlertCircle :size="16" />
                <span>{{ errorMsg }}</span>
              </div>

              <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="sending">
                <Send :size="18" />
                <span>{{ sending ? "Envoi de votre message..." : "Envoyer mon message" }}</span>
              </button>

              <p class="form-privacy-note">
                Vos coordonnées sont strictement confidentielles et utilisées uniquement pour répondre à votre demande.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
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
  margin: 0;
}

/* Corps */
.page-body {
  margin-top: 3.5rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 2.5rem;
  align-items: start;
}

/* Colonne Gauche */
.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.info-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-xs);
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.35rem;
}

.info-subtitle {
  font-size: 0.88rem;
  color: var(--color-slate-500);
  margin-bottom: 1.5rem;
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-slate-900);
  transition: all 0.15s ease;
}

.channel-item:not(.non-link):hover {
  transform: translateY(-2px);
  border-color: var(--color-slate-300);
  box-shadow: var(--shadow-sm);
}

.channel-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.bg-brand {
  background-color: var(--color-brand-subtle);
  color: var(--color-brand);
  border: 1px solid var(--color-brand-border);
}

.bg-wa {
  background-color: #ecfdf5;
  color: var(--color-wa);
  border: 1px solid #a7f3d0;
}

.bg-slate {
  background-color: var(--color-slate-100);
  color: var(--color-slate-700);
  border: 1px solid var(--color-slate-200);
}

.channel-label {
  display: block;
  font-size: 0.76rem;
  color: var(--color-slate-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.channel-val {
  display: block;
  font-size: 0.98rem;
  color: var(--color-slate-950);
}

.channel-hint {
  display: block;
  font-size: 0.78rem;
  color: var(--color-slate-400);
}

/* Horaires */
.hours-card {
  border-top: 3px solid var(--color-brand);
}

.hours-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.hours-header h3 {
  margin: 0;
}

.hours-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-slate-100);
}

.hours-row .day {
  color: var(--color-slate-700);
  font-weight: 600;
}

.hours-row .time {
  color: var(--color-slate-900);
  font-weight: 700;
}

.hours-row.closed .time {
  color: var(--color-brand);
  font-size: 0.82rem;
}

.security-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-slate-600);
  background-color: var(--color-slate-50);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-slate-200);
}

/* Formulaire */
.form-container-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius-md);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.form-head {
  margin-bottom: 1.75rem;
}

.form-head h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-slate-950);
  margin-bottom: 0.35rem;
}

.form-head p {
  font-size: 0.9rem;
  color: var(--color-slate-500);
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.form-privacy-note {
  font-size: 0.78rem;
  color: var(--color-slate-400);
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 0;
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

.success-box {
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-sm);
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-box h3 {
  font-size: 1.25rem;
  color: var(--color-success);
  margin: 0;
}

.success-box p {
  font-size: 0.92rem;
  color: var(--color-slate-700);
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
