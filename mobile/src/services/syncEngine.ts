import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import {
  AuthSession,
  AVRecord,
  DistrikRecord,
  initialAVs,
  initialDistriks,
  initialKampungs,
  initialOrphans,
  KampungRecord,
  OrphanRecord,
  SyncQueueItem,
} from "../types/admin";

const KEY_ORPHANS = "sfy_mobile_orphans";
const KEY_AVS = "sfy_mobile_avs";
const KEY_DISTRIKS = "sfy_mobile_distriks";
const KEY_KAMPUNGS = "sfy_mobile_kampungs";
const KEY_SYNC_QUEUE = "sfy_mobile_sync_queue";
const KEY_LAST_SYNC = "sfy_mobile_last_sync";
const KEY_SESSION = "sfy_mobile_session";
const KEY_CACHED_AUTH = "sfy_mobile_cached_auth";
const KEY_SERVER_URL = "sfy_mobile_server_url";

interface CachedCredential {
  email: string;
  password: string;
  session: AuthSession;
}

const DEFAULT_OFFLINE_CREDENTIAL: CachedCredential = {
  email: "admin@sfypapua.org",
  password: "AdminSFY2025!",
  session: {
    user: {
      id: "USR-001",
      nama: "Master Administrator SFY",
      email: "admin@sfypapua.org",
      roleId: "super_admin",
      status: "Aktif",
      terakhirLogin: "Mode Offline",
      wilayahTugas: "Sekretariat Pusat Merauke (Papua Selatan)",
    },
    roleName: "Super Admin Lembaga",
    token: "sfy_offline_master_token",
  },
};

export const PRODUCTION_SERVER_URL = "https://web-sfy.vercel.app";

export function detectDefaultServerUrl(): string {
  // 1. Check EXPO_PUBLIC_API_URL environment variable (used in Production APK build or .env)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  // 2. Default to production server so the mobile app works immediately like a normal app anywhere
  return PRODUCTION_SERVER_URL;
}

export async function getServerUrl(): Promise<string> {
  const detected = detectDefaultServerUrl();
  try {
    const saved = await AsyncStorage.getItem(KEY_SERVER_URL);
    if (saved && saved.trim()) {
      const cleanSaved = saved.trim().replace(/\/+$/, "");
      // Auto-heal old unreachable hosts (e.g. inactive sfypapua.org or stale local LAN IP) to production
      if (
        cleanSaved === "https://sfypapua.org" ||
        cleanSaved.includes("192.168.1.15") ||
        cleanSaved.includes("10.145.210.220") ||
        cleanSaved === "http://localhost:3000"
      ) {
        await AsyncStorage.setItem(KEY_SERVER_URL, detected);
        return detected;
      }
      return cleanSaved;
    }
  } catch {
    // ignore
  }
  return detected;
}

export async function saveServerUrl(url: string): Promise<string> {
  const clean = url.trim().replace(/\/+$/, "") || detectDefaultServerUrl();
  await AsyncStorage.setItem(KEY_SERVER_URL, clean);
  return clean;
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 4500
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export function formatNowIndonesian(): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function formatDateIndonesian(): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export async function loadLocalData(): Promise<{
  orphans: OrphanRecord[];
  avs: AVRecord[];
  distriks: DistrikRecord[];
  kampungs: KampungRecord[];
  syncQueue: SyncQueueItem[];
  lastSyncTime: string | null;
}> {
  try {
    const [
      rawOrphans,
      rawAvs,
      rawDistriks,
      rawKampungs,
      rawQueue,
      lastSyncTime,
    ] = await Promise.all([
      AsyncStorage.getItem(KEY_ORPHANS),
      AsyncStorage.getItem(KEY_AVS),
      AsyncStorage.getItem(KEY_DISTRIKS),
      AsyncStorage.getItem(KEY_KAMPUNGS),
      AsyncStorage.getItem(KEY_SYNC_QUEUE),
      AsyncStorage.getItem(KEY_LAST_SYNC),
    ]);

    const orphans: OrphanRecord[] = rawOrphans
      ? JSON.parse(rawOrphans)
      : initialOrphans;
    const avs: AVRecord[] = rawAvs ? JSON.parse(rawAvs) : initialAVs;
    const distriks: DistrikRecord[] = rawDistriks
      ? JSON.parse(rawDistriks)
      : initialDistriks;
    const kampungs: KampungRecord[] = rawKampungs
      ? JSON.parse(rawKampungs)
      : initialKampungs;
    const syncQueue: SyncQueueItem[] = rawQueue ? JSON.parse(rawQueue) : [];

    // Seed AsyncStorage if first run
    if (!rawOrphans) {
      await AsyncStorage.setItem(KEY_ORPHANS, JSON.stringify(orphans));
    }
    if (!rawAvs) {
      await AsyncStorage.setItem(KEY_AVS, JSON.stringify(avs));
    }
    if (!rawDistriks) {
      await AsyncStorage.setItem(KEY_DISTRIKS, JSON.stringify(distriks));
    }
    if (!rawKampungs) {
      await AsyncStorage.setItem(KEY_KAMPUNGS, JSON.stringify(kampungs));
    }

    return {
      orphans,
      avs,
      distriks,
      kampungs,
      syncQueue,
      lastSyncTime,
    };
  } catch {
    return {
      orphans: initialOrphans,
      avs: initialAVs,
      distriks: initialDistriks,
      kampungs: initialKampungs,
      syncQueue: [],
      lastSyncTime: null,
    };
  }
}

export async function saveLocalCollections(data: {
  orphans?: OrphanRecord[];
  avs?: AVRecord[];
  distriks?: DistrikRecord[];
  kampungs?: KampungRecord[];
}): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (data.orphans) {
    tasks.push(
      AsyncStorage.setItem(KEY_ORPHANS, JSON.stringify(data.orphans))
    );
  }
  if (data.avs) {
    tasks.push(AsyncStorage.setItem(KEY_AVS, JSON.stringify(data.avs)));
  }
  if (data.distriks) {
    tasks.push(
      AsyncStorage.setItem(KEY_DISTRIKS, JSON.stringify(data.distriks))
    );
  }
  if (data.kampungs) {
    tasks.push(
      AsyncStorage.setItem(KEY_KAMPUNGS, JSON.stringify(data.kampungs))
    );
  }
  await Promise.all(tasks);
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSyncQueue(queue: SyncQueueItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY_SYNC_QUEUE, JSON.stringify(queue));
}

export async function enqueueSyncOperation(
  op: Omit<SyncQueueItem, "opId" | "timestamp">
): Promise<SyncQueueItem[]> {
  const queue = await getSyncQueue();
  const item: SyncQueueItem = {
    ...op,
    opId: `OP_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };
  const updated = [...queue, item];
  await saveSyncQueue(updated);
  return updated;
}

function applyPendingQueueLocally(
  data: {
    orphans: OrphanRecord[];
    avs: AVRecord[];
    distriks: DistrikRecord[];
    kampungs: KampungRecord[];
  },
  queue: SyncQueueItem[]
) {
  let { orphans, avs, distriks, kampungs } = data;

  for (const op of queue) {
    const id = op.recordId;
    const p = (op.payload || {}) as Record<string, unknown>;

    if (op.entity === "orphan") {
      if (op.action === "soft_delete") {
        orphans = orphans.map((o) =>
          o.id === id
            ? {
                ...o,
                isDeleted: true,
                deletedAt: (p.deletedAt as string) || o.deletedAt,
              }
            : o
        );
      } else if (op.action === "restore") {
        orphans = orphans.map((o) =>
          o.id === id ? { ...o, isDeleted: false, deletedAt: undefined } : o
        );
      } else if (op.action === "delete") {
        orphans = orphans.filter((o) => o.id !== id);
      } else if (op.action === "create") {
        if (!orphans.some((o) => o.id === id)) {
          orphans = [p as unknown as OrphanRecord, ...orphans];
        }
      } else if (op.action === "update") {
        orphans = orphans.map((o) =>
          o.id === id ? ({ ...o, ...p } as OrphanRecord) : o
        );
      }
    } else if (op.entity === "av") {
      if (op.action === "soft_delete") {
        avs = avs.map((a) =>
          a.id === id
            ? {
                ...a,
                isDeleted: true,
                deletedAt: (p.deletedAt as string) || a.deletedAt,
              }
            : a
        );
      } else if (op.action === "restore") {
        avs = avs.map((a) =>
          a.id === id ? { ...a, isDeleted: false, deletedAt: undefined } : a
        );
      } else if (op.action === "delete") {
        avs = avs.filter((a) => a.id !== id);
      } else if (op.action === "create") {
        if (!avs.some((a) => a.id === id)) {
          avs = [p as unknown as AVRecord, ...avs];
        }
      } else if (op.action === "update") {
        avs = avs.map((a) =>
          a.id === id ? ({ ...a, ...p } as AVRecord) : a
        );
      }
    } else if (op.entity === "distrik") {
      if (op.action === "soft_delete") {
        distriks = distriks.map((d) =>
          d.id === id
            ? {
                ...d,
                isDeleted: true,
                deletedAt: (p.deletedAt as string) || d.deletedAt,
              }
            : d
        );
      } else if (op.action === "restore") {
        distriks = distriks.map((d) =>
          d.id === id ? { ...d, isDeleted: false, deletedAt: undefined } : d
        );
      } else if (op.action === "delete") {
        distriks = distriks.filter((d) => d.id !== id);
      }
    } else if (op.entity === "kampung") {
      if (op.action === "soft_delete") {
        kampungs = kampungs.map((k) =>
          k.id === id
            ? {
                ...k,
                isDeleted: true,
                deletedAt: (p.deletedAt as string) || k.deletedAt,
              }
            : k
        );
      } else if (op.action === "restore") {
        kampungs = kampungs.map((k) =>
          k.id === id ? { ...k, isDeleted: false, deletedAt: undefined } : k
        );
      } else if (op.action === "delete") {
        kampungs = kampungs.filter((k) => k.id !== id);
      }
    }
  }

  return { orphans, avs, distriks, kampungs };
}

/**
 * Two-Way Synchronization (Upload pending local changes + Download latest server database)
 */
export async function performTwoWaySync(): Promise<{
  success: boolean;
  isOnline: boolean;
  uploadedCount: number;
  remainingQueue: SyncQueueItem[];
  lastSyncTime: string | null;
  data?: {
    orphans: OrphanRecord[];
    avs: AVRecord[];
    distriks: DistrikRecord[];
    kampungs: KampungRecord[];
  };
  errorMessage?: string;
}> {
  const baseUrl = await getServerUrl();
  const detectedUrl = detectDefaultServerUrl();
  const queueBefore = await getSyncQueue();

  const trySyncWithUrl = async (targetUrl: string) => {
    const response = await fetchWithTimeout(
      `${targetUrl}/api/admin/sync`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue: queueBefore }),
      },
      5000
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || "Respons server tidak valid");
    }
    return json;
  };

  try {
    let json;
    try {
      json = await trySyncWithUrl(baseUrl);
    } catch (firstErr) {
      if (detectedUrl && detectedUrl !== baseUrl) {
        json = await trySyncWithUrl(detectedUrl);
        await AsyncStorage.setItem(KEY_SERVER_URL, detectedUrl);
      } else {
        throw firstErr;
      }
    }

    const processedIds = new Set<string>(
      Array.isArray(json.processedOpIds)
        ? json.processedOpIds
        : queueBefore.map((q) => q.opId)
    );

    // Check current queue in case user added new items while sync was in-flight
    const currentQueue = await getSyncQueue();
    const remainingQueue = currentQueue.filter(
      (q) => !processedIds.has(q.opId)
    );
    await saveSyncQueue(remainingQueue);

    const syncTimestamp = json.serverTime || formatNowIndonesian();
    await AsyncStorage.setItem(KEY_LAST_SYNC, syncTimestamp);

    const rawServerData = {
      orphans: json.data.orphans as OrphanRecord[],
      avs: json.data.avs as AVRecord[],
      distriks: json.data.distriks as DistrikRecord[],
      kampungs: json.data.kampungs as KampungRecord[],
    };

    const serverData =
      remainingQueue.length > 0
        ? applyPendingQueueLocally(rawServerData, remainingQueue)
        : rawServerData;

    await saveLocalCollections(serverData);

    return {
      success: true,
      isOnline: true,
      uploadedCount: processedIds.size,
      remainingQueue,
      lastSyncTime: syncTimestamp,
      data: serverData,
    };
  } catch (err) {
    const lastSyncTime = await AsyncStorage.getItem(KEY_LAST_SYNC);
    return {
      success: false,
      isOnline: false,
      uploadedCount: 0,
      remainingQueue: queueBefore,
      lastSyncTime,
      errorMessage:
        err instanceof Error
          ? err.message
          : "Tidak dapat terhubung ke server. Menggunakan penyimpanan lokal (Offline Mode).",
    };
  }
}

export async function getStoredSessionMobile(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function clearStoredSessionMobile(): Promise<void> {
  await AsyncStorage.removeItem(KEY_SESSION);
}

export async function loginWithOfflineFallback(
  emailInput: string,
  passwordInput: string
): Promise<{
  success: boolean;
  isOfflineLogin: boolean;
  session?: AuthSession;
  message?: string;
}> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const baseUrl = await getServerUrl();

  // 1. Try online authentication against PostgreSQL first
  try {
    const res = await fetchWithTimeout(
      `${baseUrl}/api/admin/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: passwordInput }),
      },
      4500
    );

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        isOfflineLogin: false,
        message: json.message || "Email atau kata sandi tidak valid.",
      };
    }

    const session: AuthSession = json.session;
    await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(session));

    // Cache credential for future offline login
    const rawCached = await AsyncStorage.getItem(KEY_CACHED_AUTH);
    const cachedList: CachedCredential[] = rawCached
      ? JSON.parse(rawCached)
      : [DEFAULT_OFFLINE_CREDENTIAL];
    const filtered = cachedList.filter(
      (c) => c.email.toLowerCase() !== cleanEmail
    );
    filtered.push({ email: cleanEmail, password: passwordInput, session });
    await AsyncStorage.setItem(KEY_CACHED_AUTH, JSON.stringify(filtered));

    return {
      success: true,
      isOfflineLogin: false,
      session,
    };
  } catch {
    // 2. Network unreachable or poor connection -> fallback to local credential cache
    const rawCached = await AsyncStorage.getItem(KEY_CACHED_AUTH);
    const cachedList: CachedCredential[] = rawCached
      ? JSON.parse(rawCached)
      : [DEFAULT_OFFLINE_CREDENTIAL];

    const hasMaster = cachedList.some(
      (c) => c.email.toLowerCase() === DEFAULT_OFFLINE_CREDENTIAL.email
    );
    if (!hasMaster) {
      cachedList.push(DEFAULT_OFFLINE_CREDENTIAL);
    }

    const matched = cachedList.find(
      (c) => c.email.toLowerCase() === cleanEmail
    );

    if (!matched) {
      return {
        success: false,
        isOfflineLogin: true,
        message:
          "Tidak ada koneksi ke server & akun belum tersimpan di perangkat ini. Gunakan akun Master Admin atau sambungkan ke jaringan terlebih dahulu.",
      };
    }

    if (matched.password !== passwordInput) {
      return {
        success: false,
        isOfflineLogin: true,
        message: "Kata sandi salah (Verifikasi Mode Offline).",
      };
    }

    const offlineSession: AuthSession = {
      ...matched.session,
      user: {
        ...matched.session.user,
        terakhirLogin: `Mode Offline, ${formatNowIndonesian()}`,
      },
    };

    await AsyncStorage.setItem(KEY_SESSION, JSON.stringify(offlineSession));

    return {
      success: true,
      isOfflineLogin: true,
      session: offlineSession,
    };
  }
}

