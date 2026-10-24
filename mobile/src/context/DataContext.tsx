import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  clearStoredSessionMobile,
  enqueueSyncOperation,
  formatDateIndonesian,
  formatNowIndonesian,
  getServerUrl,
  getStoredSessionMobile,
  loadLocalData,
  loginWithOfflineFallback,
  performTwoWaySync,
  saveLocalCollections,
  saveServerUrl,
} from "../services/syncEngine";
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
} from "../types/admin";

interface DataContextType {
  isBootstrapping: boolean;
  session: AuthSession | null;
  orphans: OrphanRecord[];
  avs: AVRecord[];
  distriks: DistrikRecord[];
  kampungs: KampungRecord[];
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  serverUrl: string;
  lastSyncFeedback: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; isOfflineLogin?: boolean }>;
  logout: () => Promise<void>;
  updateServerUrl: (url: string) => Promise<void>;
  triggerSync: (silent?: boolean) => Promise<void>;

  // Orphan CRUD
  addOrphan: (
    payload: Omit<OrphanRecord, "id" | "tanggalMasuk">
  ) => Promise<OrphanRecord>;
  updateOrphan: (
    id: string,
    updates: Partial<OrphanRecord>
  ) => Promise<void>;
  softDeleteOrphan: (id: string) => Promise<void>;
  restoreOrphan: (id: string) => Promise<void>;
  deleteOrphanPermanently: (id: string) => Promise<void>;

  // AV CRUD
  addAV: (
    payload: Omit<AVRecord, "id" | "tanggalBergabung" | "anakDampingan">
  ) => Promise<AVRecord>;
  updateAV: (id: string, updates: Partial<AVRecord>) => Promise<void>;
  softDeleteAV: (id: string) => Promise<void>;
  restoreAV: (id: string) => Promise<void>;
  deleteAVPermanently: (id: string) => Promise<void>;

  // Wilayah CRUD
  addDistrik: (
    nama: string,
    kabupaten: string
  ) => Promise<{ success: boolean; message?: string; data?: DistrikRecord }>;
  updateDistrik: (
    id: string,
    updates: Partial<DistrikRecord>
  ) => Promise<{ success: boolean; message?: string }>;
  softDeleteDistrik: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
  restoreDistrik: (id: string) => Promise<void>;
  deleteDistrikPermanently: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  addKampung: (
    nama: string,
    distrikNama: string,
    kabupaten: string,
    catatan?: string
  ) => Promise<{ success: boolean; message?: string; data?: KampungRecord }>;
  updateKampung: (
    id: string,
    updates: Partial<KampungRecord>
  ) => Promise<void>;
  softDeleteKampung: (id: string) => Promise<void>;
  restoreKampung: (id: string) => Promise<void>;
  deleteKampungPermanently: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function computeAvSupervisedOrphans(
  avs: AVRecord[],
  orphans: OrphanRecord[]
): AVRecord[] {
  const activeOrphans = orphans.filter((o) => !o.isDeleted);
  return avs.map((av) => {
    const supervised = activeOrphans
      .filter(
        (o) =>
          o.pjAvId === av.id ||
          (o.pjAvNama && o.pjAvNama.toLowerCase() === av.nama.toLowerCase())
      )
      .map((o) => o.namaLengkap);
    return {
      ...av,
      anakDampingan: supervised,
    };
  });
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [orphans, setOrphans] = useState<OrphanRecord[]>(initialOrphans);
  const [avs, setAvs] = useState<AVRecord[]>(initialAVs);
  const [distriks, setDistriks] = useState<DistrikRecord[]>(initialDistriks);
  const [kampungs, setKampungs] = useState<KampungRecord[]>(initialKampungs);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [serverUrl, setServerUrlState] = useState<string>(
    "http://192.168.1.15:3000"
  );
  const [lastSyncFeedback, setLastSyncFeedback] = useState<string | null>(null);

  const syncingRef = useRef(false);
  const pendingResyncRef = useRef(false);

  const showSyncToast = useCallback((msg: string) => {
    setLastSyncFeedback(msg);
    setTimeout(() => {
      setLastSyncFeedback((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const triggerSync = useCallback(
    async (silent = false): Promise<void> => {
      if (syncingRef.current) {
        pendingResyncRef.current = true;
        return;
      }
      syncingRef.current = true;
      if (!silent) setIsSyncing(true);

      try {
        const res = await performTwoWaySync();
        setIsOnline(res.isOnline);
        setPendingCount(res.remainingQueue.length);

        if (res.lastSyncTime) {
          setLastSyncTime(res.lastSyncTime);
        }

        if (res.success && res.data) {
          const currentUrl = await getServerUrl();
          setServerUrlState(currentUrl);
          setOrphans(res.data.orphans);
          setAvs(
            computeAvSupervisedOrphans(res.data.avs, res.data.orphans)
          );
          setDistriks(res.data.distriks);
          setKampungs(res.data.kampungs);
          if (!silent) {
            if (res.uploadedCount > 0) {
              showSyncToast(
                `Sinkronisasi berhasil (${res.uploadedCount} perubahan lokal diunggah)`
              );
            } else {
              showSyncToast("Data terbaru berhasil disinkronkan dari database");
            }
          }
        } else {
          if (!silent) {
            showSyncToast(
              "Jaringan offline/buruk — menggunakan & menyimpan data di perangkat"
            );
          }
        }
      } finally {
        syncingRef.current = false;
        if (!silent) setIsSyncing(false);
        if (pendingResyncRef.current) {
          pendingResyncRef.current = false;
          void triggerSync(true);
        }
      }
    },
    [showSyncToast]
  );

  // Initial load from AsyncStorage + initial background sync
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [storedSession, local, url] = await Promise.all([
        getStoredSessionMobile(),
        loadLocalData(),
        getServerUrl(),
      ]);

      if (!mounted) return;
      setSession(storedSession);
      setOrphans(local.orphans);
      setAvs(computeAvSupervisedOrphans(local.avs, local.orphans));
      setDistriks(local.distriks);
      setKampungs(local.kampungs);
      setPendingCount(local.syncQueue.length);
      setLastSyncTime(local.lastSyncTime);
      setServerUrlState(url);
      setIsBootstrapping(false);

      // Perform immediate background sync
      await triggerSync(true);
    })();

    return () => {
      mounted = false;
    };
  }, [triggerSync]);

  // Automatic Background Sync & Connectivity Watcher (every 12s & on App Foreground)
  useEffect(() => {
    const interval = setInterval(() => {
      // Automatically sync when offline (to detect reconnection), when there are pending local items, or periodic refresh
      triggerSync(true);
    }, 12000);

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        triggerSync(true);
      }
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [triggerSync]);

  const login = async (email: string, password: string) => {
    const result = await loginWithOfflineFallback(email, password);
    if (result.success && result.session) {
      setSession(result.session);
      setIsOnline(!result.isOfflineLogin);
      if (!result.isOfflineLogin) {
        triggerSync(true);
      }
    }
    return {
      success: result.success,
      message: result.message,
      isOfflineLogin: result.isOfflineLogin,
    };
  };

  const logout = async () => {
    await clearStoredSessionMobile();
    setSession(null);
  };

  const updateServerUrl = async (url: string) => {
    const saved = await saveServerUrl(url);
    setServerUrlState(saved);
    await triggerSync(false);
  };

  // ==========================================================
  // 1. ORPHAN (ANAK YATIM) OFFLINE-FIRST MUTATIONS
  // ==========================================================
  const addOrphan = async (
    payload: Omit<OrphanRecord, "id" | "tanggalMasuk">
  ): Promise<OrphanRecord> => {
    let maxNum = orphans.length;
    for (const o of orphans) {
      const m = o.id.match(/YTM-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = `YTM-${String(maxNum + 1).padStart(3, "0")}`;

    const matchedAv = avs.find(
      (a) =>
        (payload.pjAvId && a.id === payload.pjAvId) ||
        (payload.pjAvNama &&
          a.nama.toLowerCase() === payload.pjAvNama.toLowerCase())
    );

    const newRecord: OrphanRecord = {
      ...payload,
      id: newId,
      pjAvId: matchedAv ? matchedAv.id : payload.pjAvId,
      pjAvNama: matchedAv ? matchedAv.nama : payload.pjAvNama,
      tanggalMasuk: formatDateIndonesian(),
      isDeleted: false,
    };

    const nextOrphans = [newRecord, ...orphans];
    const nextAvs = computeAvSupervisedOrphans(avs, nextOrphans);
    setOrphans(nextOrphans);
    setAvs(nextAvs);
    await saveLocalCollections({ orphans: nextOrphans, avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "orphan",
      action: "create",
      recordId: newId,
      payload: newRecord as unknown as Record<string, unknown>,
    });
    setPendingCount(q.length);

    triggerSync(true);
    return newRecord;
  };

  const updateOrphan = async (id: string, updates: Partial<OrphanRecord>) => {
    let updatedItem: OrphanRecord | null = null;
    const matchedAv =
      updates.pjAvNama || updates.pjAvId
        ? avs.find(
            (a) =>
              (updates.pjAvId && a.id === updates.pjAvId) ||
              (updates.pjAvNama &&
                a.nama.toLowerCase() === updates.pjAvNama.toLowerCase())
          )
        : undefined;

    const nextOrphans = orphans.map((o) => {
      if (o.id === id) {
        updatedItem = {
          ...o,
          ...updates,
          pjAvId: matchedAv ? matchedAv.id : updates.pjAvId ?? o.pjAvId,
          pjAvNama: matchedAv ? matchedAv.nama : updates.pjAvNama ?? o.pjAvNama,
        };
        return updatedItem;
      }
      return o;
    });

    const nextAvs = computeAvSupervisedOrphans(avs, nextOrphans);
    setOrphans(nextOrphans);
    setAvs(nextAvs);
    await saveLocalCollections({ orphans: nextOrphans, avs: nextAvs });

    if (updatedItem) {
      const q = await enqueueSyncOperation({
        entity: "orphan",
        action: "update",
        recordId: id,
        payload: updatedItem as unknown as Record<string, unknown>,
      });
      setPendingCount(q.length);
      triggerSync(true);
    }
  };

  const softDeleteOrphan = async (id: string) => {
    const deletedAt = formatNowIndonesian();
    const nextOrphans = orphans.map((o) =>
      o.id === id ? { ...o, isDeleted: true, deletedAt } : o
    );
    const nextAvs = computeAvSupervisedOrphans(avs, nextOrphans);
    setOrphans(nextOrphans);
    setAvs(nextAvs);
    await saveLocalCollections({ orphans: nextOrphans, avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "orphan",
      action: "soft_delete",
      recordId: id,
      payload: { isDeleted: true, deletedAt },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const restoreOrphan = async (id: string) => {
    const nextOrphans = orphans.map((o) =>
      o.id === id ? { ...o, isDeleted: false, deletedAt: undefined } : o
    );
    const nextAvs = computeAvSupervisedOrphans(avs, nextOrphans);
    setOrphans(nextOrphans);
    setAvs(nextAvs);
    await saveLocalCollections({ orphans: nextOrphans, avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "orphan",
      action: "restore",
      recordId: id,
      payload: { isDeleted: false },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const deleteOrphanPermanently = async (id: string) => {
    const nextOrphans = orphans.filter((o) => o.id !== id);
    const nextAvs = computeAvSupervisedOrphans(avs, nextOrphans);
    setOrphans(nextOrphans);
    setAvs(nextAvs);
    await saveLocalCollections({ orphans: nextOrphans, avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "orphan",
      action: "delete",
      recordId: id,
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  // ==========================================================
  // 2. AV (KOORDINATOR KAMPUNG) OFFLINE-FIRST MUTATIONS
  // ==========================================================
  const addAV = async (
    payload: Omit<AVRecord, "id" | "tanggalBergabung" | "anakDampingan">
  ): Promise<AVRecord> => {
    let maxNum = avs.length;
    for (const a of avs) {
      const m = a.id.match(/AV-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = `AV-${String(maxNum + 1).padStart(3, "0")}`;

    const newRecord: AVRecord = {
      ...payload,
      id: newId,
      anakDampingan: [],
      tanggalBergabung: formatDateIndonesian(),
      isDeleted: false,
    };

    const nextAvs = computeAvSupervisedOrphans([newRecord, ...avs], orphans);
    setAvs(nextAvs);
    await saveLocalCollections({ avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "av",
      action: "create",
      recordId: newId,
      payload: newRecord as unknown as Record<string, unknown>,
    });
    setPendingCount(q.length);
    triggerSync(true);
    return newRecord;
  };

  const updateAV = async (id: string, updates: Partial<AVRecord>) => {
    let updatedItem: AVRecord | null = null;
    const nextAvsRaw = avs.map((a) => {
      if (a.id === id) {
        updatedItem = { ...a, ...updates };
        return updatedItem;
      }
      return a;
    });

    const nextAvs = computeAvSupervisedOrphans(nextAvsRaw, orphans);
    setAvs(nextAvs);
    await saveLocalCollections({ avs: nextAvs });

    if (updatedItem) {
      const q = await enqueueSyncOperation({
        entity: "av",
        action: "update",
        recordId: id,
        payload: updatedItem as unknown as Record<string, unknown>,
      });
      setPendingCount(q.length);
      triggerSync(true);
    }
  };

  const softDeleteAV = async (id: string) => {
    const deletedAt = formatNowIndonesian();
    const nextAvs = avs.map((a) =>
      a.id === id ? { ...a, isDeleted: true, deletedAt } : a
    );
    setAvs(nextAvs);
    await saveLocalCollections({ avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "av",
      action: "soft_delete",
      recordId: id,
      payload: { isDeleted: true, deletedAt },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const restoreAV = async (id: string) => {
    const nextAvs = avs.map((a) =>
      a.id === id ? { ...a, isDeleted: false, deletedAt: undefined } : a
    );
    setAvs(nextAvs);
    await saveLocalCollections({ avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "av",
      action: "restore",
      recordId: id,
      payload: { isDeleted: false },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const deleteAVPermanently = async (id: string) => {
    const nextAvs = avs.filter((a) => a.id !== id);
    setAvs(nextAvs);
    await saveLocalCollections({ avs: nextAvs });

    const q = await enqueueSyncOperation({
      entity: "av",
      action: "delete",
      recordId: id,
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  // ==========================================================
  // 3. WILAYAH (DISTRIK & KAMPUNG) OFFLINE-FIRST MUTATIONS
  // ==========================================================
  const addDistrik = async (
    nama: string,
    kabupaten: string
  ): Promise<{ success: boolean; message?: string; data?: DistrikRecord }> => {
    const cleanNama = nama.trim();
    if (!cleanNama) {
      return { success: false, message: "Nama distrik wajib diisi." };
    }

    const dup = distriks.find(
      (d) => d.nama.toLowerCase() === cleanNama.toLowerCase()
    );
    if (dup) {
      return {
        success: false,
        message: `Distrik "${cleanNama}" sudah terdaftar.`,
      };
    }

    let maxNum = distriks.length;
    for (const d of distriks) {
      const m = d.id.match(/DST-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = `DST-${String(maxNum + 1).padStart(3, "0")}`;

    const newRecord: DistrikRecord = {
      id: newId,
      nama: cleanNama,
      kabupaten: kabupaten.trim() || "Kab. Merauke",
      isDeleted: false,
    };

    const nextDistriks = [newRecord, ...distriks];
    setDistriks(nextDistriks);
    await saveLocalCollections({ distriks: nextDistriks });

    const q = await enqueueSyncOperation({
      entity: "distrik",
      action: "create",
      recordId: newId,
      payload: newRecord as unknown as Record<string, unknown>,
    });
    setPendingCount(q.length);
    triggerSync(true);

    return { success: true, data: newRecord };
  };

  const updateDistrik = async (
    id: string,
    updates: Partial<DistrikRecord>
  ): Promise<{ success: boolean; message?: string }> => {
    const existing = distriks.find((d) => d.id === id);
    if (!existing) {
      return { success: false, message: "Distrik tidak ditemukan." };
    }

    const newNama = updates.nama ? updates.nama.trim() : existing.nama;
    if (
      updates.nama &&
      newNama.toLowerCase() !== existing.nama.toLowerCase()
    ) {
      const dup = distriks.find(
        (d) => d.id !== id && d.nama.toLowerCase() === newNama.toLowerCase()
      );
      if (dup) {
        return {
          success: false,
          message: `Distrik "${newNama}" sudah ada.`,
        };
      }
    }

    const updatedRecord: DistrikRecord = {
      ...existing,
      ...updates,
      nama: newNama,
    };

    const nextDistriks = distriks.map((d) => (d.id === id ? updatedRecord : d));
    const nextKampungs = kampungs.map((k) =>
      k.distrikId === id ||
      k.distrikNama.toLowerCase() === existing.nama.toLowerCase()
        ? {
            ...k,
            distrikNama: newNama,
            kabupaten: updates.kabupaten || k.kabupaten,
          }
        : k
    );

    setDistriks(nextDistriks);
    setKampungs(nextKampungs);
    await saveLocalCollections({
      distriks: nextDistriks,
      kampungs: nextKampungs,
    });

    const q = await enqueueSyncOperation({
      entity: "distrik",
      action: "update",
      recordId: id,
      payload: updatedRecord as unknown as Record<string, unknown>,
    });
    setPendingCount(q.length);
    triggerSync(true);

    return { success: true };
  };

  const softDeleteDistrik = async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    const target = distriks.find((d) => d.id === id);
    if (!target) {
      return { success: false, message: "Distrik tidak ditemukan." };
    }

    const activeKampungs = kampungs.filter(
      (k) =>
        !k.isDeleted &&
        (k.distrikId === id ||
          k.distrikNama.toLowerCase() === target.nama.toLowerCase())
    );
    if (activeKampungs.length > 0) {
      return {
        success: false,
        message: `Distrik "${target.nama}" masih memiliki ${activeKampungs.length} kampung aktif.`,
      };
    }

    const deletedAt = formatNowIndonesian();
    const nextDistriks = distriks.map((d) =>
      d.id === id ? { ...d, isDeleted: true, deletedAt } : d
    );
    setDistriks(nextDistriks);
    await saveLocalCollections({ distriks: nextDistriks });

    const q = await enqueueSyncOperation({
      entity: "distrik",
      action: "soft_delete",
      recordId: id,
      payload: { isDeleted: true, deletedAt },
    });
    setPendingCount(q.length);
    triggerSync(true);

    return { success: true };
  };

  const restoreDistrik = async (id: string) => {
    const nextDistriks = distriks.map((d) =>
      d.id === id ? { ...d, isDeleted: false, deletedAt: undefined } : d
    );
    setDistriks(nextDistriks);
    await saveLocalCollections({ distriks: nextDistriks });

    const q = await enqueueSyncOperation({
      entity: "distrik",
      action: "restore",
      recordId: id,
      payload: { isDeleted: false },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const deleteDistrikPermanently = async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    const target = distriks.find((d) => d.id === id);
    if (!target) {
      return { success: false, message: "Distrik tidak ditemukan." };
    }

    const anyKampungs = kampungs.filter(
      (k) =>
        k.distrikId === id ||
        k.distrikNama.toLowerCase() === target.nama.toLowerCase()
    );
    if (anyKampungs.length > 0) {
      return {
        success: false,
        message: `Distrik "${target.nama}" masih memiliki ${anyKampungs.length} kampung binaan.`,
      };
    }

    const nextDistriks = distriks.filter((d) => d.id !== id);
    setDistriks(nextDistriks);
    await saveLocalCollections({ distriks: nextDistriks });

    const q = await enqueueSyncOperation({
      entity: "distrik",
      action: "delete",
      recordId: id,
    });
    setPendingCount(q.length);
    triggerSync(true);

    return { success: true };
  };

  const addKampung = async (
    nama: string,
    distrikNama: string,
    kabupaten: string,
    catatan?: string
  ): Promise<{ success: boolean; message?: string; data?: KampungRecord }> => {
    const cleanNama = nama.trim();
    const cleanDistrik = distrikNama.trim();
    if (!cleanNama) {
      return { success: false, message: "Nama kampung wajib diisi." };
    }
    if (!cleanDistrik) {
      return { success: false, message: "Distrik wajib dipilih." };
    }

    const dup = kampungs.find(
      (k) =>
        k.nama.toLowerCase() === cleanNama.toLowerCase() &&
        k.distrikNama.toLowerCase() === cleanDistrik.toLowerCase()
    );
    if (dup) {
      return {
        success: false,
        message: `"${cleanNama}" sudah terdaftar di ${cleanDistrik}.`,
      };
    }

    let matchedDistrik = distriks.find(
      (d) => d.nama.toLowerCase() === cleanDistrik.toLowerCase()
    );
    if (!matchedDistrik) {
      const distRes = await addDistrik(cleanDistrik, kabupaten);
      matchedDistrik = distRes.data;
    }

    let maxNum = kampungs.length;
    for (const k of kampungs) {
      const m = k.id.match(/KMP-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = `KMP-${String(maxNum + 1).padStart(3, "0")}`;

    const newRecord: KampungRecord = {
      id: newId,
      nama: cleanNama,
      distrikId: matchedDistrik ? matchedDistrik.id : "DST-001",
      distrikNama: cleanDistrik,
      kabupaten:
        kabupaten.trim() ||
        (matchedDistrik ? matchedDistrik.kabupaten : "Kab. Merauke"),
      catatan: catatan?.trim(),
      isDeleted: false,
    };

    const nextKampungs = [newRecord, ...kampungs];
    setKampungs(nextKampungs);
    await saveLocalCollections({ kampungs: nextKampungs });

    const q = await enqueueSyncOperation({
      entity: "kampung",
      action: "create",
      recordId: newId,
      payload: newRecord as unknown as Record<string, unknown>,
    });
    setPendingCount(q.length);
    triggerSync(true);

    return { success: true, data: newRecord };
  };

  const updateKampung = async (id: string, updates: Partial<KampungRecord>) => {
    let updatedItem: KampungRecord | null = null;
    const nextKampungs = kampungs.map((k) => {
      if (k.id === id) {
        updatedItem = { ...k, ...updates };
        return updatedItem;
      }
      return k;
    });
    setKampungs(nextKampungs);
    await saveLocalCollections({ kampungs: nextKampungs });

    if (updatedItem) {
      const q = await enqueueSyncOperation({
        entity: "kampung",
        action: "update",
        recordId: id,
        payload: updatedItem as unknown as Record<string, unknown>,
      });
      setPendingCount(q.length);
      triggerSync(true);
    }
  };

  const softDeleteKampung = async (id: string) => {
    const deletedAt = formatNowIndonesian();
    const nextKampungs = kampungs.map((k) =>
      k.id === id ? { ...k, isDeleted: true, deletedAt } : k
    );
    setKampungs(nextKampungs);
    await saveLocalCollections({ kampungs: nextKampungs });

    const q = await enqueueSyncOperation({
      entity: "kampung",
      action: "soft_delete",
      recordId: id,
      payload: { isDeleted: true, deletedAt },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const restoreKampung = async (id: string) => {
    const nextKampungs = kampungs.map((k) =>
      k.id === id ? { ...k, isDeleted: false, deletedAt: undefined } : k
    );
    setKampungs(nextKampungs);
    await saveLocalCollections({ kampungs: nextKampungs });

    const q = await enqueueSyncOperation({
      entity: "kampung",
      action: "restore",
      recordId: id,
      payload: { isDeleted: false },
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  const deleteKampungPermanently = async (id: string) => {
    const nextKampungs = kampungs.filter((k) => k.id !== id);
    setKampungs(nextKampungs);
    await saveLocalCollections({ kampungs: nextKampungs });

    const q = await enqueueSyncOperation({
      entity: "kampung",
      action: "delete",
      recordId: id,
    });
    setPendingCount(q.length);
    triggerSync(true);
  };

  return (
    <DataContext.Provider
      value={{
        isBootstrapping,
        session,
        orphans,
        avs,
        distriks,
        kampungs,
        isOnline,
        isSyncing,
        pendingCount,
        lastSyncTime,
        serverUrl,
        lastSyncFeedback,
        login,
        logout,
        updateServerUrl,
        triggerSync,
        addOrphan,
        updateOrphan,
        softDeleteOrphan,
        restoreOrphan,
        deleteOrphanPermanently,
        addAV,
        updateAV,
        softDeleteAV,
        restoreAV,
        deleteAVPermanently,
        addDistrik,
        updateDistrik,
        softDeleteDistrik,
        restoreDistrik,
        deleteDistrikPermanently,
        addKampung,
        updateKampung,
        softDeleteKampung,
        restoreKampung,
        deleteKampungPermanently,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
