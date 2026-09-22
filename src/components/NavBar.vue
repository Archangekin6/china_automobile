<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useSiteStore } from "@/stores/site";
import {
  Phone,
  Menu,
  X,
  Car,
  Tag,
  Wrench,
  Info,
  ChevronRight,
  MessageCircle,
} from "lucide-vue-next";

const site = useSiteStore();
const route = useRoute();
const isMenuOpen = ref(false);
const isScrolled = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function closeMenu() {
  isMenuOpen.value = false;
  document.body.style.overflow = "";
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "";
});
</script>

<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <!-- Barre supérieure discrète -->

    <!-- Barre principale de navigation -->
    <div class="navbar-main">
      <div class="container bar">
        <!-- Logo de marque -->
        <RouterLink to="/" class="logo" @click="closeMenu">
          <div class="logo-symbol" aria-hidden="true">
            <span class="symbol-slash slash-1"></span>
            <span class="symbol-slash slash-2"></span>
          </div>
          <div class="logo-text">
            <span class="brand-title">CHINA AUTOMOBILE</span>
            <span class="brand-subtitle">ABIDJAN • IMPORT & VENTE</span>
          </div>
        </RouterLink>

        <!-- Liens Desktop -->
        <nav class="desktop-nav" aria-label="Navigation principale">
          <RouterLink
            to="/"
            class="nav-link"
            active-class="nav-link-active"
            exact
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/voitures"
            class="nav-link"
            active-class="nav-link-active"
          >
            Véhicules
          </RouterLink>
          <RouterLink
            to="/marques"
            class="nav-link"
            active-class="nav-link-active"
          >
            Marques
          </RouterLink>
          <RouterLink
            to="/services"
            class="nav-link"
            active-class="nav-link-active"
          >
            Services
          </RouterLink>
          <RouterLink
            to="/a-propos"
            class="nav-link"
            active-class="nav-link-active"
          >
            À propos
          </RouterLink>
          <RouterLink
            to="/contact"
            class="nav-link"
            active-class="nav-link-active"
          >
            Contact
          </RouterLink>
        </nav>

        <!-- Actions Desktop -->
        <div class="nav-actions">
          <a
            :href="site.phoneHref"
            class="phone-cta"
            title="Nous contacter par téléphone"
          >
            <div class="phone-icon-wrap">
              <Phone :size="16" />
            </div>
            <div class="phone-info">
              <span class="phone-label">Service commercial</span>
              <span class="phone-num">{{ site.settings.phone }}</span>
            </div>
          </a>

          <a
            :href="
              site.waLink(
                'Bonjour, je souhaite être conseillé pour l\'achat d\'un véhicule.',
              )
            "
            target="_blank"
            rel="noopener"
            class="btn btn-sm btn-whatsapp wa-quick-btn"
          >
            <MessageCircle :size="16" />
            <span>Devis Express</span>
          </a>

          <!-- Hamburger Button (Mobile) -->
          <button
            type="button"
            class="hamburger-btn"
            :aria-expanded="isMenuOpen"
            aria-label="Ouvrir le menu"
            @click="toggleMenu"
          >
            <Menu v-if="!isMenuOpen" :size="24" />
            <X v-else :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile Drawer -->
    <div
      v-if="isMenuOpen"
      class="mobile-backdrop"
      @click="closeMenu"
      aria-hidden="true"
    ></div>

    <transition name="drawer">
      <div
        v-if="isMenuOpen"
        class="mobile-drawer"
        role="dialog"
        aria-label="Menu principal"
      >
        <div class="drawer-header">
          <div class="logo">
            <div class="logo-symbol" aria-hidden="true">
              <span class="symbol-slash slash-1"></span>
              <span class="symbol-slash slash-2"></span>
            </div>
            <div class="logo-text">
              <span class="brand-title">CHINA AUTOMOBILE</span>
            </div>
          </div>
          <button
            type="button"
            class="drawer-close-btn"
            aria-label="Fermer le menu"
            @click="closeMenu"
          >
            <X :size="22" />
          </button>
        </div>

        <div class="drawer-content">
          <nav class="drawer-nav">
            <RouterLink to="/" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Car :size="18" />
                <span>Accueil</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>

            <RouterLink to="/voitures" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Car :size="18" />
                <span>Catalogue Véhicules</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>

            <RouterLink to="/marques" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Tag :size="18" />
                <span>Nos Marques</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>

            <RouterLink to="/services" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Wrench :size="18" />
                <span>Services & Import</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>

            <RouterLink to="/a-propos" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Info :size="18" />
                <span>À propos de l'entreprise</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>

            <RouterLink to="/contact" class="drawer-link" @click="closeMenu">
              <div class="link-label">
                <Phone :size="18" />
                <span>Contactez-nous</span>
              </div>
              <ChevronRight :size="16" class="link-arrow" />
            </RouterLink>
          </nav>

          <div class="drawer-footer">
            <a :href="site.phoneHref" class="drawer-contact-card">
              <Phone :size="18" class="text-brand" />
              <div>
                <span class="label">Appelez-nous directement</span>
                <span class="value">{{ site.settings.phone }}</span>
              </div>
            </a>

            <a
              :href="
                site.waLink(
                  'Bonjour, je souhaite des informations sur vos véhicules.',
                )
              "
              target="_blank"
              rel="noopener"
              class="btn btn-whatsapp w-full"
            >
              <MessageCircle :size="18" />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-slate-200);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.header.scrolled {
  box-shadow: var(--shadow-sm);
  border-bottom-color: var(--color-slate-300);
}

/* Bandeau discret tout en haut */
.top-announcement {
  background-color: var(--color-slate-950);
  color: var(--color-slate-300);
  font-size: 0.78rem;
  padding: 0.35rem 0;
  letter-spacing: 0.01em;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-brand);
}

.top-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.top-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-slate-200);
  font-weight: 500;
}

.top-link:hover {
  color: var(--color-white);
}

.icon-accent {
  color: var(--color-brand);
}

.top-divider {
  color: var(--color-slate-700);
}

.top-location {
  color: var(--color-slate-400);
}

/* Barre de navigation principale */
.navbar-main {
  background-color: var(--color-white);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1.5rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-symbol {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 28px;
}

.symbol-slash {
  display: block;
  width: 6px;
  height: 24px;
  background-color: var(--color-brand);
  transform: skewX(-18deg);
  border-radius: 1px;
}

.symbol-slash.slash-2 {
  background-color: var(--color-slate-900);
  height: 18px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-slate-950);
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--color-slate-500);
  margin-top: 1px;
}

/* Liens Desktop */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-left: 1rem;
}

.nav-link {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-slate-700);
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.15s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-brand);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.nav-link:hover {
  color: var(--color-slate-950);
}

.nav-link:hover::after,
.nav-link-active::after {
  transform: scaleX(1);
}

.nav-link-active {
  color: var(--color-slate-950);
  font-weight: 600;
}

/* Actions à droite */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.phone-cta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
}

.phone-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--color-slate-100);
  color: var(--color-brand);
  display: grid;
  place-items: center;
  transition: background-color 0.15s ease;
}

.phone-cta:hover .phone-icon-wrap {
  background-color: var(--color-brand-subtle);
}

.phone-info {
  display: flex;
  flex-direction: column;
}

.phone-label {
  font-size: 0.72rem;
  color: var(--color-slate-500);
  font-weight: 500;
}

.phone-num {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-slate-950);
  letter-spacing: -0.01em;
}

.wa-quick-btn {
  box-shadow: none;
}

.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-slate-800);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.hamburger-btn:hover {
  background-color: var(--color-slate-100);
}

/* Menu Mobile Off-Canvas */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 15, 21, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 85%;
  max-width: 380px;
  background-color: var(--color-white);
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-slate-200);
}

.drawer-close-btn {
  background: none;
  border: none;
  color: var(--color-slate-500);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.drawer-close-btn:hover {
  background-color: var(--color-slate-100);
  color: var(--color-slate-900);
}

.drawer-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-y: auto;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-radius: var(--radius);
  color: var(--color-slate-800);
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.15s ease;
}

.drawer-link:hover {
  background-color: var(--color-slate-100);
}

.link-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.link-arrow {
  color: var(--color-slate-400);
}

.drawer-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-slate-200);
}

.drawer-contact-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background-color: var(--color-slate-50);
  border: 1px solid var(--color-slate-200);
  border-radius: var(--radius);
}

.drawer-contact-card .label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-slate-500);
}

.drawer-contact-card .value {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-slate-900);
}

.w-full {
  width: 100%;
}

.text-brand {
  color: var(--color-brand);
}

/* Transitions Drawer */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

@media (max-width: 980px) {
  .top-announcement {
    display: none;
  }
  .desktop-nav {
    display: none;
  }
  .phone-cta {
    display: none;
  }
  .wa-quick-btn {
    display: none;
  }
  .hamburger-btn {
    display: flex;
  }
}
</style>
