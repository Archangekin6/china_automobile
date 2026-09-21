import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

export const defaultSettings = {
  phone: "+225 00 00 00 00 00",
  whatsapp: "2250000000000", // sans + ni espaces
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

export const useSiteStore = defineStore("site", () => {
  const settings = ref({ ...defaultSettings });

  async function load() {
    const { data } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    // Les valeurs enregistrées écrasent les valeurs par défaut
    settings.value = { ...defaultSettings, ...(data?.data || {}) };
  }

  const phoneHref = computed(
    () => "tel:" + settings.value.phone.replace(/\s/g, ""),
  );
  const waLink = (text = "") =>
    `https://wa.me/${settings.value.whatsapp}` +
    (text ? `?text=${encodeURIComponent(text)}` : "");

  return { settings, load, phoneHref, waLink };
});
