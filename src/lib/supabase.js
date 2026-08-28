import { createClient } from "@supabase/supabase-js";

// As variáveis vêm do arquivo .env (nunca commite o .env!)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Aceita URL com espaco, barra ou "/rest/v1/" no fim e usa so o dominio
const match = rawUrl.match(/https:\/\/[a-z0-9-]+\.supabase\.(co|in)/i);
const url = match ? match[0] : rawUrl;

const urlValida = Boolean(match);

if (!urlValida || !anonKey) {
  // Mensagem clara em vez do erro cru "Invalid supabaseUrl"
  console.error(
    "[supabase] Configure o arquivo .env:\n" +
      "  VITE_SUPABASE_URL   -> Project Settings > Data API > Project URL (https://xxxx.supabase.co)\n" +
      "  VITE_SUPABASE_ANON_KEY -> Project Settings > API Keys > Publishable key (sb_publishable_...)\n" +
      "Depois de editar o .env, PARE e rode 'npm run dev' de novo.\n" +
      `Valor atual de VITE_SUPABASE_URL: ${JSON.stringify(url)}`
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Nome do bucket do Storage onde ficam as fotos dos produtos
export const BUCKET_PRODUTOS = "produtos";

/** Monta a URL pública de uma imagem do Storage a partir do "path" salvo no banco */
export function urlImagemProduto(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path; // já é uma URL completa
  return supabase.storage.from(BUCKET_PRODUTOS).getPublicUrl(path).data.publicUrl;
}
