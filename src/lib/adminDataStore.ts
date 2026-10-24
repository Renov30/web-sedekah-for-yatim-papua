import {
  OrphanRecord,
  AVRecord,
  initialOrphans,
  initialAVs,
} from "@/data/admin/adminData";

export const STORAGE_KEY_ORPHANS = "sfy_registered_orphans";
export const STORAGE_KEY_AVS = "sfy_registered_avs";

export function getStoredOrphans(): OrphanRecord[] {
  if (typeof window === "undefined") {
    return initialOrphans;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORPHANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(initialOrphans));
      return initialOrphans;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(initialOrphans));
      return initialOrphans;
    }
    const existingIds = new Set(parsed.map((item: OrphanRecord) => item.id));
    const missing = initialOrphans.filter((o) => !existingIds.has(o.id));
    if (missing.length > 0) {
      const merged = [...parsed, ...missing];
      localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return initialOrphans;
  }
}

export function saveStoredOrphans(list: OrphanRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data anak yatim:", e);
  }
}

export function getStoredAVs(): AVRecord[] {
  if (typeof window === "undefined") {
    return initialAVs;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AVS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_AVS, JSON.stringify(initialAVs));
      return initialAVs;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_AVS, JSON.stringify(initialAVs));
      return initialAVs;
    }
    return parsed;
  } catch {
    return initialAVs;
  }
}

export function saveStoredAVs(list: AVRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_AVS, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data AV:", e);
  }
}
