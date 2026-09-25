<script setup>
import { computed } from "vue";
import { RouterView, RouterLink, useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import WhatsAppButton from "@/components/WhatsAppButton.vue";
import { useSiteStore } from "@/stores/site";
import {
  Phone,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Car,
  Lock,
} from "lucide-vue-next";

const site = useSiteStore();
const route = useRoute();
const isAdmin = computed(() => route.meta.admin === true);
</script>

<template>
  <div class="site-wrapper">
    <NavBar v-if="!isAdmin" />

    <main :class="{ 'admin-main': isAdmin }">
      <RouterView />
    </main>

    <!-- Footer Vitrine Professionnel -->
    <footer v-if="!isAdmin" class="site-footer" id="contact">
      <!-- Section Réassurance Pré-Footer -->
      <div class="pre-footer">
        <div class="container pre-footer-grid">
          <div class="reassurance-item">
            <div class="reassurance-icon">
              <ShieldCheck :size="24" />
            </div>
            <div>
              <h4 class="reassurance-title">Inspection Certifiée</h4>
              <p class="reassurance-desc">
                Informations claires sur les modèles proposés.
              </p>
            </div>
          </div>

          <div class="reassurance-item">
            <div class="reassurance-icon">
              <Car :size="24" />
            </div>
            <div>
              <h4 class="reassurance-title">Vente en Côte d'Ivoire</h4>
              <p class="reassurance-desc">
                Découvrez les véhicules proposés par China Automobile.
              </p>
            </div>
          </div>

          <div class="reassurance-item">
            <div class="reassurance-icon">
              <Clock :size="24" />
            </div>
            <div>
              <h4 class="reassurance-title">Accompagnement Dédié</h4>
              <p class="reassurance-desc">
                Une équipe disponible pour vos questions commerciales.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonnes principales du Footer -->
      <div class="container footer-main">
        <div class="footer-cols">
          <!-- Col 1: Identité & Vision -->
          <div class="footer-col brand-col">
            <div class="logo">
              <div class="logo-symbol" aria-hidden="true">
                <span class="symbol-slash slash-1"></span>
                <span class="symbol-slash slash-2"></span>
              </div>
              <span class="brand-title">CHINA AUTOMOBILE</span>
            </div>
            <p class="brand-desc">
              Votre partenaire automobile pour découvrir et acheter les
              véhicules proposés en Côte d'Ivoire.
            </p>
            <div class="badges-row">
              <span class="country-badge">Abidjan, Côte d'Ivoire</span>
            </div>
          </div>

          <!-- Col 2: Navigation Rapide -->
          <div class="footer-col">
            <h4 class="col-title">Navigation</h4>
            <ul class="footer-nav">
              <li><RouterLink to="/">Accueil</RouterLink></li>
              <li>
                <RouterLink to="/voitures">Tous les véhicules</RouterLink>
              </li>
              <li>
                <RouterLink to="/marques">Marques partenaires</RouterLink>
              </li>
              <li>
                <RouterLink to="/services">Véhicules & Informations</RouterLink>
              </li>
              <li>
                <RouterLink to="/a-propos">À propos de l'entreprise</RouterLink>
              </li>
              <li><RouterLink to="/contact">Contact & Showroom</RouterLink></li>
            </ul>
          </div>

          <!-- Col 3: Services & Savoir-faire -->
          <div class="footer-col">
            <h4 class="col-title">Nos Services</h4>
            <ul class="footer-nav">
              <li>
                <RouterLink to="/voitures"
                  >Vente de véhicules en stock</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/services"
                  >Caractéristiques des modèles</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/services">Prix et disponibilités</RouterLink>
              </li>
              <li>
                <RouterLink to="/services">Conseil avant achat</RouterLink>
              </li>
              <li>
                <RouterLink to="/services"
                  >Visite et contact commercial</RouterLink
                >
              </li>
            </ul>
          </div>

          <!-- Col 4: Contact & Horaires -->
          <div class="footer-col contact-col">
            <h4 class="col-title">Coordonnées</h4>
            <div class="contact-entries">
              <a
                v-if="site.hasPhone"
                :href="site.phoneHref"
                class="contact-entry"
              >
                <Phone :size="16" class="contact-icon" />
                <span>{{ site.settings.phone }}</span>
              </a>

              <a
                v-if="site.hasWhatsApp"
                :href="
                  site.waLink(
                    'Bonjour, je souhaite contacter China Automobile.',
                  )
                "
                target="_blank"
                rel="noopener"
                class="contact-entry"
              >
                <MessageCircle :size="16" class="contact-icon text-wa" />
                <span>Discussion WhatsApp</span>
              </a>

              <div
                v-if="!site.hasPhone && !site.hasWhatsApp"
                class="contact-entry"
              >
                <span>Coordonnées commerciales en cours de configuration.</span>
              </div>

              <div class="contact-entry address-entry">
                <MapPin :size="16" class="contact-icon" />
                <span>{{ site.settings.address }}</span>
              </div>

              <div class="opening-hours">
                <Clock :size="14" class="hours-icon" />
                <span>Du Lundi au Samedi : 08h30 - 18h00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ligne basse : copyright & lien admin sobre -->
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p class="copyright">
            © {{ new Date().getFullYear() }} China Automobile. Tous droits
            réservés.
          </p>
          <div class="bottom-links">
            <span class="legal-mention"
              >Conformité commerciale & automobile Côte d'Ivoire</span
            >
            <RouterLink
              to="/admin/login"
              class="admin-link"
              title="Espace d'administration"
            >
              <Lock :size="12" />
              <span>Accès réservé</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </footer>

    <WhatsAppButton v-if="!isAdmin" />
  </div>
</template>

<style scoped>
.site-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

.admin-main {
  min-height: 100vh;
}

/* Footer Global */
.site-footer {
  background-color: var(--color-slate-950);
  color: var(--color-slate-300);
  border-top: 1px solid var(--color-slate-800);
  margin-top: auto;
}

/* Réassurance */
.pre-footer {
  background-color: var(--color-slate-900);
  border-bottom: 1px solid var(--color-slate-800);
  padding: 2.25rem 0;
}

.pre-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.reassurance-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.reassurance-icon {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  background-color: rgba(220, 38, 38, 0.12);
  color: var(--color-brand);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid rgba(220, 38, 38, 0.25);
}

.reassurance-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 0.25rem;
}

.reassurance-desc {
  font-size: 0.84rem;
  color: var(--color-slate-400);
  line-height: 1.45;
  margin: 0;
}

/* Corps Footer */
.footer-main {
  padding: 4rem 1.5rem 3rem;
}

.footer-cols {
  display: grid;
  grid-template-columns: 2fr 1.1fr 1.2fr 1.5fr;
  gap: 3rem;
}

/* Logo & Marque */
.brand-col .logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.2rem;
}

.logo-symbol {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 24px;
}

.symbol-slash {
  display: block;
  width: 5px;
  height: 22px;
  background-color: var(--color-brand);
  transform: skewX(-18deg);
  border-radius: 1px;
}

.symbol-slash.slash-2 {
  background-color: var(--color-white);
  height: 16px;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-white);
}

.brand-desc {
  font-size: 0.88rem;
  color: var(--color-slate-400);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  max-width: 38ch;
}

.country-badge {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-slate-300);
  background-color: var(--color-slate-850);
  border: 1px solid var(--color-slate-700);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
}

/* Colonnes liens */
.col-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-white);
  letter-spacing: 0.02em;
  margin-bottom: 1.2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.col-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 24px;
  height: 2px;
  background-color: var(--color-brand);
}

.footer-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav a {
  font-size: 0.88rem;
  color: var(--color-slate-400);
  text-decoration: none;
  transition: all 0.15s ease;
  display: inline-block;
}

.footer-nav a:hover {
  color: var(--color-white);
  transform: translateX(3px);
}

/* Entrées contact */
.contact-entries {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-slate-300);
  font-size: 0.88rem;
  text-decoration: none;
  transition: color 0.15s ease;
}

.contact-entry:hover {
  color: var(--color-white);
}

.contact-icon {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.text-wa {
  color: var(--color-wa);
}

.address-entry span {
  line-height: 1.4;
}

.opening-hours {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-slate-400);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-slate-850);
}

.hours-icon {
  color: var(--color-slate-500);
}

/* Bas de page */
.footer-bottom {
  border-top: 1px solid var(--color-slate-850);
  padding: 1.5rem 0;
  font-size: 0.82rem;
  color: var(--color-slate-500);
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  margin: 0;
}

.bottom-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-slate-500);
  font-size: 0.78rem;
  text-decoration: none;
  transition: color 0.15s ease;
}

.admin-link:hover {
  color: var(--color-slate-300);
}

@media (max-width: 980px) {
  .pre-footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-cols {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .footer-cols {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
