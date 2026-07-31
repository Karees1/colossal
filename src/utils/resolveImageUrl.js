import { supabase } from '../lib/supabaseClient';

const BUCKET = 'products';

// Resolves a product image field (a Supabase Storage object path) to a
// displayable URL. Falls back to `placeholder` when there's nothing to
// resolve, and passes already-absolute URLs through untouched (defensive,
// in case of stray old data).
export function resolveImageUrl(path, placeholder = null) {
  if (!path || typeof path !== 'string') return placeholder;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl || placeholder;
}
