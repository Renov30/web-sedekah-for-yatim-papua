import {
  OrphanRecord,
  AVRecord,
  FinanceTransaction,
  VolunteerRecord,
  DonorRecord,
  RoleDefinition,
  initialOrphans,
  initialAVs,
  initialFinances,
  initialVolunteers,
  initialDonors,
  initialRoles,
} from "@/data/admin/adminData";

export const STORAGE_KEY_ORPHANS = "sfy_registered_orphans";
export const STORAGE_KEY_AVS = "sfy_registered_avs";
export const STORAGE_KEY_FINANCES = "sfy_registered_finances";
export const STORAGE_KEY_VOLUNTEERS = "sfy_registered_volunteers";
export const STORAGE_KEY_DONORS = "sfy_registered_donors";
export const STORAGE_KEY_ROLES = "sfy_registered_roles";

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

export function getStoredFinances(): FinanceTransaction[] {
  if (typeof window === "undefined") {
    return initialFinances;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FINANCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FINANCES, JSON.stringify(initialFinances));
      return initialFinances;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_FINANCES, JSON.stringify(initialFinances));
      return initialFinances;
    }
    return parsed;
  } catch {
    return initialFinances;
  }
}

export function saveStoredFinances(list: FinanceTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_FINANCES, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data keuangan:", e);
  }
}

export function getStoredVolunteers(): VolunteerRecord[] {
  if (typeof window === "undefined") {
    return initialVolunteers;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(initialVolunteers));
      return initialVolunteers;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(initialVolunteers));
      return initialVolunteers;
    }
    return parsed;
  } catch {
    return initialVolunteers;
  }
}

export function saveStoredVolunteers(list: VolunteerRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data relawan:", e);
  }
}

export function getStoredDonors(): DonorRecord[] {
  if (typeof window === "undefined") {
    return initialDonors;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(initialDonors));
      return initialDonors;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(initialDonors));
      return initialDonors;
    }
    return parsed;
  } catch {
    return initialDonors;
  }
}

export function saveStoredDonors(list: DonorRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_DONORS, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data donatur:", e);
  }
}

export function getStoredRoles(): RoleDefinition[] {
  if (typeof window === "undefined") {
    return initialRoles;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(initialRoles));
      return initialRoles;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(initialRoles));
      return initialRoles;
    }
    return parsed;
  } catch {
    return initialRoles;
  }
}

export function saveStoredRoles(list: RoleDefinition[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(list));
  } catch (e) {
    console.error("Gagal menyimpan data role:", e);
  }
}
