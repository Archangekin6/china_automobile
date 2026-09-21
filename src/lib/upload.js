import { supabase } from "@/lib/supabase";

// Envoie une image dans Supabase Storage et renvoie son adresse publique
export async function uploadImage(file, folder = "site") {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("car-images")
    .upload(path, file);
  if (error) throw error;
  return supabase.storage.from("car-images").getPublicUrl(path).data.publicUrl;
}
