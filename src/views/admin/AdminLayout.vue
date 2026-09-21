<script setup>
import { ref, computed } from "vue";
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  Car,
  ClipboardList,
  Sliders,
  Tag,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

async function logout() {
  await auth.logout();
  router.push("/admin/login");
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

const pageTitle = computed(() => {
  const path = route.path;
  if (path.includes("/admin/voitures")) return "Gestion du Parc Automobile";
  if (path.includes("/admin/commandes")) return "Suivi des Commandes & Demandes";
  if (path.includes("/admin/accueil")) return "Paramètres du Site & Coordonnées";
  if (path.includes("/admin/marques")) return "Gestion des Marques Partenaires";
  if (path.includes("/admin/temoignages")) return "Avis & Témoignages Clients";
  return "Administration";
});
</script>

<template>
  <div class="admin-layout">
    <!-- Overlay Mobile -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-backdrop"
      @click="closeSidebar"
      aria-hidden="true"
    ></div>

    <!-- Sidebar Latérale SaaS -->
    <aside class="admin-sidebar" :class="{ 'is-open': isSidebarOpen }">
      <!-- Logo Administration -->
      <div class="sidebar-brand">
        <div class="brand-logo-wrap">
          <span class="brand-mark slash-1"></span>
          <span class="brand-mark slash-2"></span>
        </div>
        <div class="brand-details">
          <span class="brand-name">CHINA AUTO</span>
          <span class="brand-role">Gestionnaire de Parc</span>
        </div>
      </div>

      <!-- Navigation Principale Admin -->
      <nav class="sidebar-nav" aria-label="Menu administration">
        <div class="nav-section-label">Véhicules & Ventes</div>

        <RouterLink
          to="/admin/voitures"
          class="nav-item"
          active-class="nav-item-active"
          @click="closeSidebar"
        >
          <Car :size="18" class="item-icon" />
          <span>Véhicules</span>
        </RouterLink>

        <RouterLink
          to="/admin/commandes"
          class="nav-item"
          active-class="nav-item-active"
          @click="closeSidebar"
        >
          <ClipboardList :size="18" class="item-icon" />
          <span>Commandes & Demandes</span>
        </RouterLink>

        <RouterLink
          to="/admin/marques"
          class="nav-item"
          active-class="nav-item-active"
          @click="closeSidebar"
        >
          <Tag :size="18" class="item-icon" />
          <span>Marques</span>
        </RouterLink>

        <div class="nav-section-label">Vitrine & Contenu</div>

        <RouterLink
          to="/admin/accueil"
          class="nav-item"
          active-class="nav-item-active"
          @click="closeSidebar"
        >
          <Sliders :size="18" class="item-icon" />
          <span>Accueil & Réglages</span>
        </RouterLink>

        <RouterLink
          to="/admin/temoignages"
          class="nav-item"
          active-class="nav-item-active"
          @click="closeSidebar"
        >
          <MessageSquareQuote :size="18" class="item-icon" />
          <span>Témoignages</span>
        </RouterLink>
      </nav>

      <!-- Pied de Sidebar : Lien Site & Déconnexion -->
      <div class="sidebar-footer">
        <RouterLink to="/" target="_blank" class="view-storefront-btn">
          <ExternalLink :size="16" />
          <span>Ouvrir le site public</span>
        </RouterLink>

        <div class="user-profile-strip">
          <div class="user-avatar">
            <User :size="16" />
          </div>
          <div class="user-info">
            <span class="user-role">Administrateur</span>
            <span class="user-email" :title="auth.user?.email">
              {{ auth.user?.email || "Connecté" }}
            </span>
          </div>
          <button
            type="button"
            class="logout-icon-btn"
            @click="logout"
            title="Se déconnecter de l'administration"
          >
            <LogOut :size="18" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Zone de Contenu Principal -->
    <div class="admin-main-wrap">
      <!-- Barre Supérieure Header -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <button
            type="button"
            class="mobile-toggle-btn"
            @click="toggleSidebar"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu v-if="!isSidebarOpen" :size="22" />
            <X v-else :size="22" />
          </button>
          <div class="topbar-title-wrap">
            <h1 class="topbar-title">{{ pageTitle }}</h1>
            <span class="topbar-subtitle">Plateforme interne de gestion China Automobile</span>
          </div>
        </div>

        <div class="topbar-right">
          <div class="admin-status-badge">
            <ShieldCheck :size="14" class="text-success" />
            <span>Session sécurisée</span>
          </div>
          <RouterLink to="/" target="_blank" class="btn btn-sm btn-outline topbar-site-link">
            <ExternalLink :size="14" />
            <span>Voir la vitrine</span>
          </RouterLink>
        </div>
      </header>

      <!-- Corps de page router -->
      <main class="admin-content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-slate-100);
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background-color: var(--color-slate-950);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid var(--color-slate-800);
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 40;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--color-slate-850);
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 3px;
}

.brand-mark {
  display: block;
  width: 5px;
  height: 22px;
  background-color: var(--color-brand);
  transform: skewX(-18deg);
  border-radius: 1px;
}

.brand-mark.slash-2 {
  background-color: var(--color-white);
  height: 16px;
}

.brand-name {
  display: block;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--color-white);
  line-height: 1.1;
}

.brand-role {
  display: block;
  font-size: 0.7rem;
  color: var(--color-slate-400);
  font-weight: 500;
  margin-top: 2px;
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem 1rem;
  flex: 1;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-slate-500);
  padding: 0.75rem 0.5rem 0.35rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-sm);
  color: var(--color-slate-300);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background-color: var(--color-slate-900);
  color: var(--color-white);
}

.nav-item-active {
  background-color: var(--color-brand);
  color: var(--color-white);
  font-weight: 600;
}

.nav-item-active:hover {
  background-color: var(--color-brand-hover);
}

.item-icon {
  flex-shrink: 0;
}

/* Footer Sidebar */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-slate-850);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--color-slate-950);
}

.view-storefront-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background-color: var(--color-slate-900);
  color: var(--color-slate-300);
  border: 1px solid var(--color-slate-800);
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.15s ease;
}

.view-storefront-btn:hover {
  background-color: var(--color-slate-850);
  color: var(--color-white);
  border-color: var(--color-slate-700);
}

.user-profile-strip {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.25rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-slate-800);
  color: var(--color-slate-300);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.user-role {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-white);
}

.user-email {
  font-size: 0.7rem;
  color: var(--color-slate-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-icon-btn {
  background: none;
  border: none;
  color: var(--color-slate-400);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}

.logout-icon-btn:hover {
  background-color: rgba(220, 38, 38, 0.15);
  color: var(--color-brand);
}

/* Contenu Principal */
.admin-main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-slate-200);
  position: sticky;
  top: 0;
  z-index: 30;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-toggle-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-slate-700);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.topbar-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-slate-950);
  line-height: 1.15;
}

.topbar-subtitle {
  font-size: 0.78rem;
  color: var(--color-slate-500);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-status-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-slate-600);
  background-color: var(--color-slate-50);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-slate-200);
}

.text-success {
  color: var(--color-success);
}

.admin-content-area {
  padding: 2rem;
  flex: 1;
}

/* Responsiveness Admin */
@media (max-width: 900px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(11, 15, 21, 0.6);
    backdrop-filter: blur(4px);
    z-index: 35;
  }

  .mobile-toggle-btn {
    display: block;
  }

  .admin-topbar {
    padding: 0.85rem 1.25rem;
  }

  .topbar-subtitle {
    display: none;
  }

  .admin-content-area {
    padding: 1.25rem;
  }

  .topbar-site-link {
    display: none;
  }
}
</style>
