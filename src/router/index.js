import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Vues Vitrine Publique
import HomeView from "@/views/HomeView.vue";
import CatalogView from "@/views/CatalogView.vue";
import CarDetailView from "@/views/CarDetailView.vue";
import BrandsView from "@/views/BrandsView.vue";
import ServicesView from "@/views/ServicesView.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";

// Vues Administration
import LoginView from "@/views/admin/LoginView.vue";
import AdminLayout from "@/views/admin/AdminLayout.vue";
import DashboardAdminView from "@/views/admin/DashboardAdminView.vue";
import CarsAdminView from "@/views/admin/CarsAdminView.vue";
import OrdersAdminView from "@/views/admin/OrdersAdminView.vue";
import SiteAdminView from "@/views/admin/SiteAdminView.vue";
import BrandsAdminView from "@/views/admin/BrandsAdminView.vue";
import TestimonialsAdminView from "@/views/admin/TestimonialsAdminView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Vitrine Publique
    { path: "/", component: HomeView },
    { path: "/voitures", component: CatalogView },
    { path: "/voitures/:id", component: CarDetailView },
    { path: "/marques", component: BrandsView },
    { path: "/services", component: ServicesView },
    { path: "/a-propos", component: AboutView },
    { path: "/contact", component: ContactView },

    // Espace Administration
    { path: "/admin/login", component: LoginView, meta: { admin: true } },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { admin: true, requiresAuth: true },
      redirect: "/admin/dashboard",
      children: [
        { path: "dashboard", component: DashboardAdminView },
        { path: "voitures", component: CarsAdminView },
        { path: "commandes", component: OrdersAdminView },
        { path: "accueil", component: SiteAdminView },
        { path: "marques", component: BrandsAdminView },
        { path: "temoignages", component: TestimonialsAdminView },
      ],
    },

    // Redirection par défaut si route inconnue
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
});

// Garde de navigation : protection de l'espace administration
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.user) return "/admin/login";
  if (to.path === "/admin/login" && auth.user) return "/admin";
});

export default router;
