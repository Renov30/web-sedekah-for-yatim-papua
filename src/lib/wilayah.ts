export interface DistrikRecord {
  id: string;
  nama: string;
  kabupaten: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface KampungRecord {
  id: string;
  nama: string;
  distrikId: string;
  distrikNama: string;
  kabupaten: string;
  catatan?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export const STORAGE_KEY_DISTRIK = "sfy_master_distrik";
export const STORAGE_KEY_KAMPUNG = "sfy_master_kampung";

export const initialDistriks: DistrikRecord[] = [
  { id: "DST-001", nama: "Distrik Merauke", kabupaten: "Kab. Merauke" },
  { id: "DST-002", nama: "Distrik Semangga", kabupaten: "Kab. Merauke" },
  { id: "DST-003", nama: "Distrik Kurik", kabupaten: "Kab. Merauke" },
  { id: "DST-004", nama: "Distrik Tanah Miring", kabupaten: "Kab. Merauke" },
  { id: "DST-005", nama: "Distrik Malind", kabupaten: "Kab. Merauke" },
  { id: "DST-006", nama: "Distrik Sota", kabupaten: "Kab. Merauke" },
  { id: "DST-007", nama: "Distrik Naukenjerai", kabupaten: "Kab. Merauke" },
  { id: "DST-008", nama: "Distrik Jagebob", kabupaten: "Kab. Merauke" },
  { id: "DST-009", nama: "Distrik Animha", kabupaten: "Kab. Merauke" },
  { id: "DST-010", nama: "Distrik Okaba", kabupaten: "Kab. Merauke" },
  { id: "DST-011", nama: "Distrik Muting", kabupaten: "Kab. Merauke" },
  { id: "DST-012", nama: "Distrik Tanah Merah", kabupaten: "Kab. Boven Digoel" },
  { id: "DST-013", nama: "Distrik Mandobo", kabupaten: "Kab. Boven Digoel" },
  { id: "DST-014", nama: "Distrik Obaa", kabupaten: "Kab. Mappi" },
  { id: "DST-015", nama: "Distrik Agats", kabupaten: "Kab. Asmat" },
];

export const initialKampungs: KampungRecord[] = [
  // Distrik Merauke
  {
    id: "KMP-001",
    nama: "Kampung Wasur",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan Taman Nasional Wasur, basis binaan anak yatim dan posko AV Yohanes Gebze.",
  },
  {
    id: "KMP-002",
    nama: "Kampung Nasem",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Wilayah pesisir selatan Merauke, posko AV Lukas Balagaize.",
  },
  {
    id: "KMP-003",
    nama: "Kampung Bokem",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Perbatasan kota Merauke, mayoritas petani dan buruh pelabuhan.",
  },
  {
    id: "KMP-004",
    nama: "Kelurahan Maro",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat kota Merauke dekat Sungai Maro.",
  },
  {
    id: "KMP-005",
    nama: "Kelurahan Mandala",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan padat penduduk, lokasi sekretariat relawan SFY Papua.",
  },
  {
    id: "KMP-006",
    nama: "Kelurahan Karang Indah",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Wilayah perkotaan Merauke, banyak anak asuh dhuafa.",
  },
  {
    id: "KMP-007",
    nama: "Kelurahan Samkai",
    distrikId: "DST-001",
    distrikNama: "Distrik Merauke",
    kabupaten: "Kab. Merauke",
    catatan: "Dekat kawasan pesisir pantai Lampu Satu.",
  },

  // Distrik Semangga
  {
    id: "KMP-008",
    nama: "Kampung Urumb",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan transmigrasi pesisir, posko dampingan AV Petrus Mahuze.",
  },
  {
    id: "KMP-009",
    nama: "Kampung Wendu",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Sentra perkebunan & pesisir, posko AV Markus Samkakai.",
  },
  {
    id: "KMP-010",
    nama: "Kampung Matara",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Wilayah pertanian Semangga barat.",
  },
  {
    id: "KMP-011",
    nama: "Kampung Muram Sari",
    distrikId: "DST-002",
    distrikNama: "Distrik Semangga",
    kabupaten: "Kab. Merauke",
    catatan: "Sentra padi dan lumbung pangan lokal.",
  },

  // Distrik Kurik
  {
    id: "KMP-012",
    nama: "Kampung Kumbe",
    distrikId: "DST-003",
    distrikNama: "Distrik Kurik",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat persimpangan Kurik-Malind, posko AV Elisabeth Kaize.",
  },
  {
    id: "KMP-013",
    nama: "Kampung Harapan Makmur",
    distrikId: "DST-003",
    distrikNama: "Distrik Kurik",
    kabupaten: "Kab. Merauke",
    catatan: "Komunitas petani sawah dan peternak.",
  },
  {
    id: "KMP-014",
    nama: "Kampung Salor Indah",
    distrikId: "DST-003",
    distrikNama: "Distrik Kurik",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat pondok pesantren mitra dan asrama binaan.",
  },

  // Distrik Tanah Miring
  {
    id: "KMP-015",
    nama: "Kampung Isano Mbias",
    distrikId: "DST-004",
    distrikNama: "Distrik Tanah Miring",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan pemukiman transmigrasi SP 2.",
  },
  {
    id: "KMP-016",
    nama: "Kampung Hidup Baru",
    distrikId: "DST-004",
    distrikNama: "Distrik Tanah Miring",
    kabupaten: "Kab. Merauke",
    catatan: "Sentra pertanian hortikultura & peternakan sapi.",
  },
  {
    id: "KMP-017",
    nama: "Kampung Yasa Mulya",
    distrikId: "DST-004",
    distrikNama: "Distrik Tanah Miring",
    kabupaten: "Kab. Merauke",
    catatan: "SP 1 Tanah Miring, akses mudah dari jalur Trans Irian.",
  },

  // Distrik Malind
  {
    id: "KMP-018",
    nama: "Kampung Kumbe Pesisir",
    distrikId: "DST-005",
    distrikNama: "Distrik Malind",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan nelayan muara sungai Kumbe.",
  },
  {
    id: "KMP-019",
    nama: "Kampung Onggaya",
    distrikId: "DST-005",
    distrikNama: "Distrik Malind",
    kabupaten: "Kab. Merauke",
    catatan: "Komunitas pesisir barat daya Merauke.",
  },

  // Distrik Sota
  {
    id: "KMP-020",
    nama: "Kampung Sota",
    distrikId: "DST-006",
    distrikNama: "Distrik Sota",
    kabupaten: "Kab. Merauke",
    catatan: "Kawasan perbatasan RI - Papua Nugini (PNG), posko AV Maria Ndiken.",
  },
  {
    id: "KMP-021",
    nama: "Kampung Yanggandur",
    distrikId: "DST-006",
    distrikNama: "Distrik Sota",
    kabupaten: "Kab. Merauke",
    catatan: "Wilayah pedalaman adat Kanum, kawasan hutan Taman Nasional.",
  },
  {
    id: "KMP-022",
    nama: "Kampung Rawa Biru",
    distrikId: "DST-006",
    distrikNama: "Distrik Sota",
    kabupaten: "Kab. Merauke",
    catatan: "Pusat sumber air bersih alami Merauke.",
  },

  // Distrik Tanah Merah (Boven Digoel)
  {
    id: "KMP-023",
    nama: "Kampung Tanah Merah",
    distrikId: "DST-012",
    distrikNama: "Distrik Tanah Merah",
    kabupaten: "Kab. Boven Digoel",
    catatan: "Pusat kabupaten Boven Digoel di hulu Sungai Digoel.",
  },
  {
    id: "KMP-024",
    nama: "Kampung Sokanggo",
    distrikId: "DST-012",
    distrikNama: "Distrik Tanah Merah",
    kabupaten: "Kab. Boven Digoel",
    catatan: "Kawasan hunian masyarakat adat pedalaman Digoel.",
  },
];

export function getStoredDistriks(): DistrikRecord[] {
  if (typeof window === "undefined") {
    return initialDistriks;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISTRIK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DISTRIK, JSON.stringify(initialDistriks));
      return initialDistriks;
    }
    const parsed = JSON.parse(raw) as DistrikRecord[];
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_DISTRIK, JSON.stringify(initialDistriks));
      return initialDistriks;
    }
    return parsed;
  } catch {
    return initialDistriks;
  }
}

export function saveStoredDistriks(list: DistrikRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_DISTRIK, JSON.stringify(list));
  fetch("/api/admin/wilayah", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ distriks: list }),
  }).catch((err) =>
    console.error("Gagal sinkronisasi distrik ke database:", err)
  );
}

export async function fetchWilayahFromApi(): Promise<{
  distriks: DistrikRecord[];
  kampungs: KampungRecord[];
}> {
  try {
    const res = await fetch("/api/admin/wilayah", { cache: "no-store" });
    if (!res.ok) {
      return {
        distriks: getStoredDistriks(),
        kampungs: getStoredKampungs(),
      };
    }
    const json = await res.json();
    if (
      json.success &&
      Array.isArray(json.distriks) &&
      Array.isArray(json.kampungs)
    ) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY_DISTRIK,
          JSON.stringify(json.distriks)
        );
        localStorage.setItem(
          STORAGE_KEY_KAMPUNG,
          JSON.stringify(json.kampungs)
        );
      }
      return {
        distriks: json.distriks,
        kampungs: json.kampungs,
      };
    }
  } catch (e) {
    console.error("Gagal memuat wilayah dari API:", e);
  }
  return {
    distriks: getStoredDistriks(),
    kampungs: getStoredKampungs(),
  };
}

export function getStoredKampungs(): KampungRecord[] {
  if (typeof window === "undefined") {
    return initialKampungs;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KAMPUNG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_KAMPUNG, JSON.stringify(initialKampungs));
      return initialKampungs;
    }
    const parsed = JSON.parse(raw) as KampungRecord[];
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_KAMPUNG, JSON.stringify(initialKampungs));
      return initialKampungs;
    }
    return parsed;
  } catch {
    return initialKampungs;
  }
}

export function saveStoredKampungs(list: KampungRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_KAMPUNG, JSON.stringify(list));
  fetch("/api/admin/wilayah", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kampungs: list }),
  }).catch((err) =>
    console.error("Gagal sinkronisasi kampung ke database:", err)
  );
}

export function addDistrik(
  nama: string,
  kabupaten: string
): { success: boolean; message?: string; data?: DistrikRecord } {
  const distriks = getStoredDistriks();
  const cleanNama = nama.trim();

  if (!cleanNama) {
    return { success: false, message: "Nama distrik wajib diisi." };
  }

  const existing = distriks.find(
    (d) => d.nama.toLowerCase() === cleanNama.toLowerCase()
  );
  if (existing) {
    return { success: false, message: `Distrik "${cleanNama}" sudah ada di database.` };
  }

  const newId = `DST-${String(distriks.length + 1).padStart(3, "0")}`;
  const newRecord: DistrikRecord = {
    id: newId,
    nama: cleanNama,
    kabupaten: kabupaten.trim() || "Kab. Merauke",
  };

  const updated = [newRecord, ...distriks];
  saveStoredDistriks(updated);

  return { success: true, data: newRecord };
}

export function updateDistrik(
  id: string,
  updates: Partial<Omit<DistrikRecord, "id">>
): { success: boolean; message?: string } {
  const distriks = getStoredDistriks();
  const index = distriks.findIndex((d) => d.id === id);

  if (index === -1) {
    return { success: false, message: "Distrik tidak ditemukan." };
  }

  const oldNama = distriks[index].nama;
  const newNama = updates.nama ? updates.nama.trim() : oldNama;

  if (updates.nama && updates.nama.toLowerCase() !== oldNama.toLowerCase()) {
    const duplicate = distriks.find(
      (d) => d.id !== id && d.nama.toLowerCase() === newNama.toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: `Distrik "${newNama}" sudah ada.` };
    }
  }

  distriks[index] = {
    ...distriks[index],
    ...updates,
    nama: newNama,
  };

  saveStoredDistriks(distriks);

  // If distrik name or kabupaten changed, cascade to existing kampungs
  if (updates.nama || updates.kabupaten) {
    const kampungs = getStoredKampungs();
    let hasChanges = false;
    const updatedKampungs = kampungs.map((k) => {
      if (k.distrikId === id || k.distrikNama.toLowerCase() === oldNama.toLowerCase()) {
        hasChanges = true;
        return {
          ...k,
          distrikNama: newNama,
          kabupaten: updates.kabupaten || k.kabupaten,
        };
      }
      return k;
    });

    if (hasChanges) {
      saveStoredKampungs(updatedKampungs);
    }
  }

  return { success: true };
}

export function softDeleteDistrik(id: string): { success: boolean; message?: string } {
  const distriks = getStoredDistriks();
  const target = distriks.find((d) => d.id === id);

  if (!target) {
    return { success: false, message: "Distrik tidak ditemukan." };
  }

  // Check if any active kampung is using this distrik
  const kampungs = getStoredKampungs();
  const activeKampungsInDistrik = kampungs.filter(
    (k) => !k.isDeleted && (k.distrikId === id || k.distrikNama.toLowerCase() === target.nama.toLowerCase())
  );

  if (activeKampungsInDistrik.length > 0) {
    return {
      success: false,
      message: `Distrik "${target.nama}" masih memiliki ${activeKampungsInDistrik.length} kampung aktif. Hapus atau pindahkan kampung terlebih dahulu.`,
    };
  }

  target.isDeleted = true;
  target.deletedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  saveStoredDistriks(distriks);
  return { success: true };
}

export function restoreDistrik(id: string): { success: boolean; message?: string } {
  const distriks = getStoredDistriks();
  const target = distriks.find((d) => d.id === id);

  if (!target) {
    return { success: false, message: "Distrik tidak ditemukan." };
  }

  target.isDeleted = false;
  target.deletedAt = undefined;

  saveStoredDistriks(distriks);
  return { success: true };
}

export function deleteDistrik(id: string): { success: boolean; message?: string } {
  const distriks = getStoredDistriks();
  const target = distriks.find((d) => d.id === id);

  if (!target) {
    return { success: false, message: "Distrik tidak ditemukan." };
  }

  // Check if any kampung is using this distrik
  const kampungs = getStoredKampungs();
  const kampungsInDistrik = kampungs.filter(
    (k) => k.distrikId === id || k.distrikNama.toLowerCase() === target.nama.toLowerCase()
  );

  if (kampungsInDistrik.length > 0) {
    return {
      success: false,
      message: `Distrik "${target.nama}" memiliki ${kampungsInDistrik.length} kampung binaan. Hapus atau pindahkan kampung terlebih dahulu.`,
    };
  }

  const filtered = distriks.filter((d) => d.id !== id);
  saveStoredDistriks(filtered);
  return { success: true };
}

export function addKampung(
  nama: string,
  distrikNama: string,
  kabupaten: string,
  catatan?: string
): { success: boolean; message?: string; data?: KampungRecord } {
  const cleanNama = nama.trim();
  const cleanDistrik = distrikNama.trim();

  if (!cleanNama) {
    return { success: false, message: "Nama kampung wajib diisi." };
  }

  if (!cleanDistrik) {
    return { success: false, message: "Distrik wajib dipilih." };
  }

  const distriks = getStoredDistriks();
  let matchedDistrik = distriks.find(
    (d) => d.nama.toLowerCase() === cleanDistrik.toLowerCase()
  );

  // Auto-register distrik if user entered a completely new distrik
  if (!matchedDistrik) {
    const newDistrikRes = addDistrik(cleanDistrik, kabupaten);
    if (newDistrikRes.data) {
      matchedDistrik = newDistrikRes.data;
    }
  }

  const kampungs = getStoredKampungs();
  const existing = kampungs.find(
    (k) =>
      k.nama.toLowerCase() === cleanNama.toLowerCase() &&
      k.distrikNama.toLowerCase() === cleanDistrik.toLowerCase()
  );

  if (existing) {
    return {
      success: false,
      message: `"${cleanNama}" sudah terdaftar di ${cleanDistrik}.`,
    };
  }

  const newId = `KMP-${String(kampungs.length + 1).padStart(3, "0")}`;
  const newRecord: KampungRecord = {
    id: newId,
    nama: cleanNama,
    distrikId: matchedDistrik ? matchedDistrik.id : "DST-CUSTOM",
    distrikNama: cleanDistrik,
    kabupaten: kabupaten.trim() || (matchedDistrik ? matchedDistrik.kabupaten : "Kab. Merauke"),
    catatan: catatan?.trim(),
  };

  const updated = [newRecord, ...kampungs];
  saveStoredKampungs(updated);

  return { success: true, data: newRecord };
}

export function updateKampung(
  id: string,
  updates: Partial<Omit<KampungRecord, "id">>
): { success: boolean; message?: string } {
  const kampungs = getStoredKampungs();
  const index = kampungs.findIndex((k) => k.id === id);

  if (index === -1) {
    return { success: false, message: "Kampung tidak ditemukan." };
  }

  kampungs[index] = {
    ...kampungs[index],
    ...updates,
  };

  saveStoredKampungs(kampungs);
  return { success: true };
}

export function softDeleteKampung(id: string): { success: boolean; message?: string } {
  const kampungs = getStoredKampungs();
  const target = kampungs.find((k) => k.id === id);

  if (!target) {
    return { success: false, message: "Kampung tidak ditemukan." };
  }

  target.isDeleted = true;
  target.deletedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  saveStoredKampungs(kampungs);
  return { success: true };
}

export function restoreKampung(id: string): { success: boolean; message?: string } {
  const kampungs = getStoredKampungs();
  const target = kampungs.find((k) => k.id === id);

  if (!target) {
    return { success: false, message: "Kampung tidak ditemukan." };
  }

  target.isDeleted = false;
  target.deletedAt = undefined;

  saveStoredKampungs(kampungs);
  return { success: true };
}

export function deleteKampung(id: string): { success: boolean; message?: string } {
  const kampungs = getStoredKampungs();
  const target = kampungs.find((k) => k.id === id);

  if (!target) {
    return { success: false, message: "Kampung tidak ditemukan." };
  }

  const filtered = kampungs.filter((k) => k.id !== id);
  saveStoredKampungs(filtered);
  return { success: true };
}

export function getKampungsByDistrik(distrikNama: string): KampungRecord[] {
  const kampungs = getStoredKampungs();
  if (!distrikNama || distrikNama === "all") return kampungs;
  return kampungs.filter(
    (k) => k.distrikNama.toLowerCase() === distrikNama.trim().toLowerCase()
  );
}
