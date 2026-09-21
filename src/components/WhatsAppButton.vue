<script setup>
import { useSiteStore } from "@/stores/site";
import { MessageCircle } from "lucide-vue-next";

const site = useSiteStore();
</script>

<template>
  <a
    :href="site.waLink('Bonjour China Automobile, je souhaite des informations sur l\'importation et la vente de véhicules.')"
    target="_blank"
    rel="noopener"
    class="wa-float"
    aria-label="Contacter China Automobile sur WhatsApp"
    title="Écrire à notre conseiller sur WhatsApp"
  >
    <div class="wa-icon-pulse">
      <MessageCircle :size="22" stroke-width="2.2" />
    </div>
    <div class="wa-text-content">
      <span class="wa-hint">Besoin d'un conseil ?</span>
      <span class="wa-action">WhatsApp direct</span>
    </div>
  </a>
</template>

<style scoped>
.wa-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-slate-900);
  color: var(--color-white);
  padding: 0.65rem 1.1rem 0.65rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-slate-700);
  box-shadow: var(--shadow-lg);
  text-decoration: none;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.wa-float:hover {
  transform: translateY(-2px);
  background-color: var(--color-slate-950);
  border-color: var(--color-wa);
  box-shadow: 0 12px 24px -6px rgba(22, 163, 74, 0.3);
}

.wa-icon-pulse {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--color-wa);
  color: var(--color-white);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.5);
  animation: pulse-ring 2.5s infinite;
}

.wa-text-content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.wa-hint {
  font-size: 0.7rem;
  color: var(--color-slate-300);
  font-weight: 500;
}

.wa-action {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-white);
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
  }
}

@media (max-width: 640px) {
  .wa-float {
    right: 16px;
    bottom: 16px;
    padding: 0.5rem;
  }
  .wa-text-content {
    display: none;
  }
  .wa-icon-pulse {
    width: 44px;
    height: 44px;
  }
}
</style>
