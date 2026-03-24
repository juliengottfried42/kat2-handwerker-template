import { supabase, supabaseAdmin } from "./supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SiteConfig = {
  id: string;
  key: string;
  value: string;
  type: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_from: number | null;
  sort_order: number;
};

export type ChatStep = {
  id: string;
  step_order: number;
  question: string;
  options: { label: string; value: string }[];
  next_step: number | null;
  show_upload: boolean;
  show_calendar: boolean;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  answers: Record<string, string>;
  photos: string[];
  preferred_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  before_image: string;
  after_image: string;
  sort_order: number;
};

// ─── Public Queries ───────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("site_config")
    .select("key, value");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getChatFlow(): Promise<ChatStep[]> {
  const { data, error } = await supabase
    .from("chat_flow")
    .select("*")
    .order("step_order");
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// ─── Inquiry Queries ──────────────────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createInquiry(
  inquiry: Omit<Inquiry, "id" | "created_at" | "status" | "notes">
): Promise<Inquiry> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .insert(inquiry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInquiry(
  id: string,
  updates: Partial<Pick<Inquiry, "status" | "notes">>
): Promise<Inquiry> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("inquiries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function upsertService(
  service: Omit<Service, "id"> & { id?: string }
): Promise<Service> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("services")
    .upsert(service)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertChatStep(
  step: Omit<ChatStep, "id"> & { id?: string }
): Promise<ChatStep> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("chat_flow")
    .upsert(step)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChatStep(id: string): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.from("chat_flow").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertGalleryItem(
  item: Omit<GalleryItem, "id"> & { id?: string }
): Promise<GalleryItem> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("gallery_items")
    .upsert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const admin = supabaseAdmin();
  const { error } = await admin.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSiteConfig(
  key: string,
  value: string
): Promise<SiteConfig> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("site_config")
    .update({ value })
    .eq("key", key)
    .select()
    .single();
  if (error) throw error;
  return data;
}
