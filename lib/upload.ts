import { supabaseAdmin } from "./supabase";

export async function uploadPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin()
    .storage
    .from("photos")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabaseAdmin()
    .storage
    .from("photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
