<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
} from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    const err = await auth.login(email.value, password.value);
    if (err) {
      error.value = "Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe.";
    } else {
      router.push("/admin");
    }
  } catch (e) {
    error.value = "Une erreur est survenue lors de la connexion.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- Logo et en-tête -->
      <div class="login-header">
        <div class="brand-emblem">
          <span class="emblem-slash slash-1"></span>
          <span class="emblem-slash slash-2"></span>
        </div>
        <h1 class="login-title">China Automobile</h1>
        <p class="login-subtitle">Espace d'administration interne</p>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label class="form-label">Adresse email administrateur</label>
          <div class="input-with-icon">
            <Mail :size="16" class="input-icon" />
            <input
              v-model="email"
              type="email"
              class="form-input"
              placeholder="admin@china-automobile.ci"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Mot de passe</label>
          <div class="input-with-icon">
            <KeyRound :size="16" class="input-icon" />
            <input
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••••••"
              required
              autocomplete="current-password"
            />
          </div>
        </div>

        <div v-if="error" class="login-error-box">
          <AlertCircle :size="16" class="flex-shrink-0" />
          <span>{{ error }}</span>
        </div>

        <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
          <Lock :size="16" />
          <span>{{ loading ? "Vérification des accès..." : "Se connecter à l'espace admin" }}</span>
        </button>
      </form>

      <!-- Pied de carte -->
      <div class="login-footer">
        <div class="security-badge">
          <ShieldCheck :size="14" class="text-success" />
          <span>Connexion chiffrée SSL / TLS</span>
        </div>

        <RouterLink to="/" class="back-link">
          <ArrowLeft :size="14" />
          <span>Retourner sur le site public</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-slate-950);
  padding: 1.5rem;
  background-image: radial-gradient(circle at top right, rgba(220, 38, 38, 0.08) 0%, transparent 60%);
}

.login-card {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 2.5rem 2.25rem;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-slate-800);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-emblem {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 32px;
  margin-bottom: 1rem;
}

.emblem-slash {
  display: block;
  width: 7px;
  height: 28px;
  background-color: var(--color-brand);
  transform: skewX(-18deg);
  border-radius: 1px;
}

.emblem-slash.slash-2 {
  background-color: var(--color-slate-900);
  height: 20px;
}

.login-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-slate-950);
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.85rem;
  color: var(--color-slate-500);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--color-slate-400);
  pointer-events: none;
}

.input-with-icon .form-input {
  padding-left: 2.4rem;
}

.login-error-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  color: var(--color-danger);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  line-height: 1.4;
}

.login-btn {
  width: 100%;
  padding: 0.85rem;
  margin-top: 0.5rem;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-slate-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  color: var(--color-slate-500);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.84rem;
  color: var(--color-slate-600);
  transition: color 0.15s ease;
}

.back-link:hover {
  color: var(--color-brand);
}

.text-success {
  color: var(--color-success);
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
