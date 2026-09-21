import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { useSiteStore } from "./stores/site";
import "./assets/main.css";

async function bootstrap() {
  const app = createApp(App);
  app.use(createPinia());

  // Initialisation de la session admin et des paramètres généraux
  try {
    await Promise.all([useAuthStore().init(), useSiteStore().load()]);
  } catch (err) {
    console.error("Erreur d'initialisation de l'application:", err);
  }

  app.use(router);
  app.mount("#app");
}

bootstrap();
