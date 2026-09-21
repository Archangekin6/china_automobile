import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SiteAdminView from "@/views/admin/SiteAdminView.vue";
import BrandsAdminView from "@/views/admin/BrandsAdminView.vue";
import TestimonialsAdminView from "@/views/admin/TestimonialsAdminView.vue";

import HomeView from "@/views/HomeView.vue";
import CatalogView from "@/views/CatalogView.vue";
import CarDetailView from "@/views/CarDetailView.vue";
import LoginView from "@/views/admin/LoginView.vue";
import AdminLayout from "@/views/admin/AdminLayout.vue";
import CarsAdminView from "@/views/admin/CarsAdminView.vue";
import OrdersAdminView from "@/views/admin/OrdersAdminView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/voitures", component: CatalogView },
    { path: "/voitures/:id", component: CarDetailView },

    { path: "/admin/login", component: LoginView, meta: { admin: true } },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { admin: true, requiresAuth: true },
      redirect: "/admin/voitures",
      children: [
        { path: "voitures", component: CarsAdminView },
        { path: "commandes", component: OrdersAdminView },
        { path: "accueil", component: SiteAdminView },
        { path: "marques", component: BrandsAdminView },
        { path: "temoignages", component: TestimonialsAdminView },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

// "Garde de navigation" : s'exécute avant chaque changement de page
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.user) return "/admin/login";
  if (to.path === "/admin/login" && auth.user) return "/admin";
});

export default router;
