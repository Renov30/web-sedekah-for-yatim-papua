import {
  OrphanRecord,
  AVRecord,
  FinanceTransaction,
  VolunteerRecord,
  DonorRecord,
  RoleDefinition,
  RolePermissionsMap,
  initialOrphans,
  initialAVs,
  initialFinances,
  initialVolunteers,
  initialDonors,
  initialRoles,
  initialPermissions,
  moduleList,
} from "@/data/admin/adminData";

export const STORAGE_KEY_ORPHANS = "sfy_registered_orphans";
export const STORAGE_KEY_AVS = "sfy_registered_avs";
export const STORAGE_KEY_FINANCES = "sfy_registered_finances";
export const STORAGE_KEY_VOLUNTEERS = "sfy_registered_volunteers";
export const STORAGE_KEY_DONORS = "sfy_registered_donors";
export const STORAGE_KEY_ROLES = "sfy_registered_roles";
export const STORAGE_KEY_PERMISSIONS = "sfy_registered_permissions_v2";

let pendingOrphansSave: Promise<void> | null = null;
let pendingAVsSave: Promise<void> | null = null;

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
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(initialOrphans));
      return initialOrphans;
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
    pendingOrphansSave = fetch("/api/admin/orphans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: list }),
    })
      .then(() => undefined)
      .catch((err) => {
        console.error("Gagal sinkronisasi anak yatim ke database:", err);
      })
      .finally(() => {
        pendingOrphansSave = null;
      });
  } catch (e) {
    console.error("Gagal menyimpan data anak yatim:", e);
  }
}

export async function fetchOrphansFromApi(): Promise<OrphanRecord[]> {
  try {
    if (pendingOrphansSave) {
      await pendingOrphansSave;
    }
    const res = await fetch("/api/admin/orphans", { cache: "no-store" });
    if (!res.ok) return getStoredOrphans();
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_ORPHANS, JSON.stringify(json.data));
      }
      return json.data;
    }
  } catch (e) {
    console.error("Gagal memuat data anak yatim dari API:", e);
  }
  return getStoredOrphans();
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
    if (!Array.isArray(parsed)) {
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
    pendingAVsSave = fetch("/api/admin/av", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: list }),
    })
      .then(() => undefined)
      .catch((err) => {
        console.error("Gagal sinkronisasi AV ke database:", err);
      })
      .finally(() => {
        pendingAVsSave = null;
      });
  } catch (e) {
    console.error("Gagal menyimpan data AV:", e);
  }
}

export async function fetchAVsFromApi(): Promise<AVRecord[]> {
  try {
    if (pendingAVsSave) {
      await pendingAVsSave;
    }
    const res = await fetch("/api/admin/av", { cache: "no-store" });
    if (!res.ok) return getStoredAVs();
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_AVS, JSON.stringify(json.data));
      }
      return json.data;
    }
  } catch (e) {
    console.error("Gagal memuat data AV dari API:", e);
  }
  return getStoredAVs();
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
    if (!Array.isArray(parsed)) {
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
    if (!Array.isArray(parsed)) {
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
    if (!Array.isArray(parsed)) {
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
    if (!Array.isArray(parsed)) {
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
    window.dispatchEvent(new Event("sfy-permissions-updated"));
  } catch (e) {
    console.error("Gagal menyimpan data role:", e);
  }
}

export function getStoredPermissions(): RolePermissionsMap {
  if (typeof window === "undefined") {
    return initialPermissions;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMISSIONS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY_PERMISSIONS,
        JSON.stringify(initialPermissions)
      );
      return initialPermissions;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      localStorage.setItem(
        STORAGE_KEY_PERMISSIONS,
        JSON.stringify(initialPermissions)
      );
      return initialPermissions;
    }
    return {
      ...initialPermissions,
      ...parsed,
      super_admin: initialPermissions.super_admin,
    };
  } catch {
    return initialPermissions;
  }
}

export function saveStoredPermissions(map: RolePermissionsMap): void {
  if (typeof window === "undefined") return;
  try {
    const safeMap: RolePermissionsMap = {
      ...map,
      super_admin: initialPermissions.super_admin,
    };
    localStorage.setItem(STORAGE_KEY_PERMISSIONS, JSON.stringify(safeMap));
    window.dispatchEvent(new Event("sfy-permissions-updated"));
    fetch("/api/admin/permissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions: safeMap }),
    }).catch(() => {});
  } catch (e) {
    console.error("Gagal menyimpan matriks hak akses:", e);
  }
}

export function getModuleFromPathname(pathname: string): string | null {
  if (!pathname || pathname === "/admin" || pathname === "/admin/login") {
    return null;
  }
  const clean = pathname.replace(/^\/admin\/?/, "").split("/")[0];
  if (!clean) return null;
  const known = moduleList.some((m) => m.id === clean);
  return known ? clean : null;
}

export function getRolePermissionsForModule(
  roleId: string | undefined,
  moduleId: string,
  permissionsMap?: RolePermissionsMap
): { create: boolean; read: boolean; update: boolean; delete: boolean } {
  const effectiveRole = roleId || "staf_lapangan";
  if (effectiveRole === "super_admin") {
    return { create: true, read: true, update: true, delete: true };
  }

  const map = permissionsMap || getStoredPermissions();
  const roleObj = map[effectiveRole] || initialPermissions[effectiveRole];
  if (!roleObj || !roleObj[moduleId]) {
    return { create: false, read: false, update: false, delete: false };
  }

  return {
    create: Boolean(roleObj[moduleId].create),
    read: Boolean(roleObj[moduleId].read),
    update: Boolean(roleObj[moduleId].update),
    delete: Boolean(roleObj[moduleId].delete),
  };
}

export function canRoleAccessPath(
  roleId: string | undefined,
  pathname: string,
  permissionsMap?: RolePermissionsMap
): boolean {
  const moduleId = getModuleFromPathname(pathname);
  if (!moduleId) return true; // /admin (Dashboard) & /admin/login
  const perms = getRolePermissionsForModule(roleId, moduleId, permissionsMap);
  return perms.read;
}
