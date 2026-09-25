import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

export const defaultSettings = {
  phone: "",
  whatsapp: "", // sans + ni espaces
  address: "Abidjan, Côte d'Ivoire",

  hero_title: "Achetez votre voiture facilement",
  hero_subtitle:
    "Consultez le catalogue, envoyez votre demande, nous vous rappelons.",
  hero_image: "",

  show_latest: true,
  latest_title: "Les dernières voitures en vente",
  latest_subtitle: "Les véhicules récemment ajoutés au catalogue.",

  show_budget: true,
  budget_max: 8000000,

  show_brands: true,
  brands_title: "Rechercher par marque",

  show_steps: true,
  steps_title: "Comment commander",
  steps: [
    {
      title: "Choisissez un véhicule",
      text: "Parcourez le catalogue : le prix est affiché sur chaque fiche.",
    },
    {
      title: "Envoyez votre demande",
      text: "Votre nom et votre téléphone suffisent. Aucun paiement en ligne.",
    },
    {
      title: "Nous vous rappelons",
      text: "Notre équipe vous contacte pour finaliser l'achat avec vous.",
    },
  ],

  show_testimonials: true,
  testimonials_title: "Clients satisfaits",
  testimonials_subtitle: "",
  google_rating: "",
  facebook_rating: "",
};

export function normalizePhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("00")) return normalizePhoneNumber(digits.slice(2));
  if (digits.startsWith("225")) {
    const localNumber = digits.slice(3);
    return digits.length === 13 && isLocalPhoneNumber(localNumber)
      ? digits
      : "";
  }
  if (digits.length === 10 && isLocalPhoneNumber(digits)) {
    return `225${digits}`;
  }
  if (digits.length === 8 && /^[1-9]\d{7}$/.test(digits)) return `225${digits}`;
  return "";
}

function isLocalPhoneNumber(value) {
  return /^(?:01|05|07)\d{8}$/.test(value);
}

export function isValidPhoneNumber(value) {
  return Boolean(normalizePhoneNumber(value));
}

export const useSiteStore = defineStore("site", () => {
  const settings = ref({ ...defaultSettings });
  const loadError = ref("");

  async function load() {
    loadError.value = "";
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      loadError.value =
        "Les coordonnées configurées n'ont pas pu être chargées.";
      console.error("Erreur de chargement des paramètres du site :", error);
    }

    // Les valeurs enregistrées écrasent les valeurs par défaut
    settings.value = { ...defaultSettings, ...(data?.data || {}) };
  }

  const phoneHref = computed(() => {
    const phone = normalizePhoneNumber(settings.value.phone);
    return phone ? `tel:+${phone}` : "#";
  });
  const hasPhone = computed(() =>
    Boolean(normalizePhoneNumber(settings.value.phone)),
  );
  const hasWhatsApp = computed(() =>
    Boolean(normalizePhoneNumber(settings.value.whatsapp)),
  );
  const waLink = (text = "") => {
    const phone = normalizePhoneNumber(settings.value.whatsapp);
    if (!phone) return "#";
    return (
      `https://wa.me/${phone}` +
      (text ? `?text=${encodeURIComponent(text)}` : "")
    );
  };

  return {
    settings,
    load,
    loadError,
    phoneHref,
    hasPhone,
    hasWhatsApp,
    waLink,
    normalizePhoneNumber,
    isValidPhoneNumber,
  };
});
