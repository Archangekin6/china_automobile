import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const ready = ref(false); // true quand on a vérifié s'il y a une session

  // Appelé une fois au démarrage : récupère la session existante
  async function init() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    ready.value = true;

    // Se met à jour tout seul à chaque connexion / déconnexion
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return { user, ready, init, login, logout };
});
