import { UserAccount } from "@/data/admin/adminData";

export interface UserWithAuth extends UserAccount {
  password: string;
}

export interface AuthSession {
  user: UserAccount;
  roleName: string;
  token: string;
}

export const AUTH_STORAGE_KEY = "sfy_admin_session";
export const LAST_ACTIVITY_KEY = "sfy_admin_last_activity";
export const USERS_STORAGE_KEY = "sfy_registered_users";

// Durasi inaktivitas sebelum logout otomatis (15 Menit)
export const SESSION_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
// Durasi peringatan sebelum logout otomatis (60 Detik)
export const SESSION_WARNING_TIME_MS = 60 * 1000;

export function updateLastActivity(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch {
    // ignore
  }
}

export function getLastActivity(): number {
  if (typeof window === "undefined") return Date.now();
  try {
    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!raw) return Date.now();
    const time = parseInt(raw, 10);
    return isNaN(time) ? Date.now() : time;
  } catch {
    return Date.now();
  }
}

export function isSessionExpired(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) return false;
    const rawLast = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!rawLast) {
      updateLastActivity();
      return false;
    }
    const lastTime = parseInt(rawLast, 10);
    if (isNaN(lastTime)) return false;
    return Date.now() - lastTime >= SESSION_INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
}

export function getRemainingSessionTime(): number {
  if (typeof window === "undefined") return SESSION_INACTIVITY_TIMEOUT_MS;
  const lastTime = getLastActivity();
  const elapsed = Date.now() - lastTime;
  const remaining = SESSION_INACTIVITY_TIMEOUT_MS - elapsed;
  return Math.max(0, remaining);
}

export const roleDisplayNames: Record<string, string> = {
  super_admin: "Super Admin Lembaga",
  bendahara: "Bendahara Lembaga",
  koordinator_relawan: "Koordinator Relawan",
  staf_lapangan: "Staf Pendataan Lapangan",
  auditor: "Auditor & Pengawas",
};

// Master Admin (Super Admin) Default Account (uses plain username "admin")
export const MASTER_ADMIN_CREDENTIALS: UserWithAuth = {
  id: "USR-001",
  nama: "Master Administrator SFY",
  email: "admin",
  password: "AdminSFY2025!",
  roleId: "super_admin",
  status: "Aktif",
  terakhirLogin: "Belum pernah login",
  wilayahTugas: "Sekretariat Pusat Merauke (Papua Selatan)",
};

export function getStoredUsers(): UserWithAuth[] {
  if (typeof window === "undefined") {
    return [MASTER_ADMIN_CREDENTIALS];
  }
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([MASTER_ADMIN_CREDENTIALS])
      );
      return [MASTER_ADMIN_CREDENTIALS];
    }
    const parsed = JSON.parse(raw) as UserWithAuth[];
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([MASTER_ADMIN_CREDENTIALS])
      );
      return [MASTER_ADMIN_CREDENTIALS];
    }

    // Auto-migrate legacy master admin email "admin@sfypapua.org" -> "admin"
    let migrated = false;
    const normalized = parsed.map((u) => {
      if (
        u.id === "USR-001" &&
        u.email.toLowerCase() === "admin@sfypapua.org"
      ) {
        migrated = true;
        return { ...u, email: "admin" };
      }
      return u;
    });

    // Ensure master admin is preserved with super_admin role
    const hasMaster = normalized.some(
      (u) =>
        u.id === "USR-001" ||
        u.email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() ||
        u.email.toLowerCase() === "admin@sfypapua.org"
    );
    if (!hasMaster) {
      const merged = [MASTER_ADMIN_CREDENTIALS, ...normalized];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    if (migrated) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return [MASTER_ADMIN_CREDENTIALS];
  }
}

export function saveStoredUsers(
  users: UserWithAuth[],
  syncToServer = true
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  if (syncToServer) {
    fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: users }),
    }).catch(() => {});
  }
}

export async function fetchUsersFromApi(): Promise<UserWithAuth[]> {
  const localUsers = getStoredUsers();
  if (typeof window === "undefined") return localUsers;

  try {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (!res.ok) return localUsers;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return localUsers;

    const serverUsers = json.data as UserWithAuth[];
    const mergedMap = new Map<string, UserWithAuth>();

    for (const su of serverUsers) {
      mergedMap.set(su.id, su);
    }

    let hasUnsyncedLocal = false;
    for (const lu of localUsers) {
      const existsById = mergedMap.has(lu.id);
      const existsByUsername = Array.from(mergedMap.values()).some(
        (su) => su.email.toLowerCase() === lu.email.toLowerCase()
      );
      if (!existsById && !existsByUsername) {
        mergedMap.set(lu.id, lu);
        hasUnsyncedLocal = true;
      }
    }

    const merged = Array.from(mergedMap.values());
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));

    if (hasUnsyncedLocal) {
      fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: merged }),
      }).catch(() => {});
    }

    return merged;
  } catch {
    return localUsers;
  }
}

export function authenticateUser(
  usernameInput: string,
  passwordInput: string
): { success: boolean; message?: string; session?: AuthSession } {
  const cleanUsername = usernameInput.trim().toLowerCase();
  const users = getStoredUsers();

  const isMasterAlias =
    cleanUsername === "admin" || cleanUsername === "admin@sfypapua.org";

  const user = users.find((u) => {
    const uName = u.email.toLowerCase();
    if (isMasterAlias && (u.id === "USR-001" || uName === "admin" || uName === "admin@sfypapua.org")) {
      return true;
    }
    return uName === cleanUsername || u.nama.toLowerCase() === cleanUsername;
  });

  if (!user) {
    return {
      success: false,
      message: "Username pengguna belum terdaftar di sistem SFY Papua.",
    };
  }

  if (user.isDeleted) {
    return {
      success: false,
      message: "Akun ini telah dihapus dari sistem.",
    };
  }

  if (user.status !== "Aktif") {
    return {
      success: false,
      message: "Akun ini telah dinonaktifkan oleh administrator.",
    };
  }

  if (user.password !== passwordInput) {
    return {
      success: false,
      message: "Kata sandi salah. Silakan periksa kembali huruf besar, huruf kecil, dan simbol.",
    };
  }

  // Update last login
  const now = new Date();
  const formattedTime =
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now) + " WIT";

  user.terakhirLogin = `Hari ini, ${formattedTime}`;
  saveStoredUsers(users);

  // Create clean user account without exposing password
  const userAccount: UserAccount = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    roleId: user.roleId,
    status: user.status,
    terakhirLogin: user.terakhirLogin,
    wilayahTugas: user.wilayahTugas,
  };

  const session: AuthSession = {
    user: userAccount,
    roleName: roleDisplayNames[user.roleId] || "Staf Lembaga",
    token: `sfy_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };

  saveSession(session);

  return {
    success: true,
    session,
  };
}

export function registerNewUser(
  newUser: Omit<UserWithAuth, "id" | "terakhirLogin">
): { success: boolean; message?: string; user?: UserWithAuth } {
  const users = getStoredUsers();
  const cleanUsername = newUser.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === cleanUsername)) {
    return {
      success: false,
      message: `Username "${newUser.email}" sudah terdaftar. Gunakan username lain.`,
    };
  }

  const maxNum = users.reduce((max, u) => {
    const num = parseInt(u.id.replace(/\D/g, ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const newId = `USR-${String(maxNum + 1).padStart(3, "0")}`;
  const created: UserWithAuth = {
    ...newUser,
    id: newId,
    email: cleanUsername,
    terakhirLogin: "Belum pernah login",
  };

  const updatedUsers = [created, ...users];
  saveStoredUsers(updatedUsers);

  return {
    success: true,
    user: created,
  };
}

export function updateStoredUser(
  id: string,
  updates: Partial<Omit<UserWithAuth, "id">>
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  // If username is changing, verify uniqueness
  if (updates.email) {
    const cleanUsername = updates.email.trim().toLowerCase();
    const duplicate = users.find(
      (u) => u.id !== id && u.email.toLowerCase() === cleanUsername
    );
    if (duplicate) {
      return { success: false, message: "Username sudah digunakan oleh akun lain." };
    }
    updates.email = cleanUsername;
  }

  users[index] = {
    ...users[index],
    ...updates,
  };

  saveStoredUsers(users);

  // Sync active session if the edited user is currently logged in
  const currentSession = getStoredSession();
  if (currentSession && currentSession.user.id === id) {
    saveSession({
      ...currentSession,
      user: {
        ...currentSession.user,
        ...updates,
      },
      roleName: updates.roleId
        ? roleDisplayNames[updates.roleId] || updates.roleId
        : currentSession.roleName,
    });
  }

  return { success: true };
}

export function resetUserPassword(
  id: string,
  newPassword: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "Kata sandi minimal 6 karakter." };
  }

  users[index].password = newPassword;
  saveStoredUsers(users);
  return { success: true };
}

export function deleteStoredUser(
  id: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  if (
    target.id === "USR-001" ||
    target.email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() ||
    target.email.toLowerCase() === "admin@sfypapua.org"
  ) {
    return {
      success: false,
      message: "Akun Master Admin utama tidak dapat dihapus demi keamanan sistem.",
    };
  }

  // Soft Delete: tandai isDeleted = true & status = "Non-aktif"
  target.isDeleted = true;
  target.deletedAt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  target.status = "Non-aktif";

  saveStoredUsers(users);
  return { success: true };
}

export function restoreStoredUser(
  id: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  target.isDeleted = false;
  target.deletedAt = undefined;
  target.status = "Aktif";

  saveStoredUsers(users);
  return { success: true };
}

export function permanentDeleteStoredUser(
  id: string
): { success: boolean; message?: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: "Pengguna tidak ditemukan." };
  }

  if (
    target.id === "USR-001" ||
    target.email.toLowerCase() === MASTER_ADMIN_CREDENTIALS.email.toLowerCase() ||
    target.email.toLowerCase() === "admin@sfypapua.org"
  ) {
    return {
      success: false,
      message: "Akun Master Admin tidak dapat dihapus secara permanen.",
    };
  }

  const filtered = users.filter((u) => u.id !== id);
  saveStoredUsers(filtered);
  return { success: true };
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  if (isSessionExpired()) {
    clearSession();
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;

    // Ensure session roleId stays in sync with stored users list
    const storedUsers = getStoredUsers();
    const matchedUser = storedUsers.find(
      (u) =>
        u.id === session.user.id ||
        u.email.toLowerCase() === session.user.email.toLowerCase()
    );
    if (matchedUser && matchedUser.roleId !== session.user.roleId) {
      session.user.roleId = matchedUser.roleId;
      session.roleName =
        roleDisplayNames[matchedUser.roleId] || matchedUser.roleId;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }

    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  updateLastActivity();
  window.dispatchEvent(new Event("sfy-permissions-updated"));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  window.dispatchEvent(new Event("sfy-permissions-updated"));
}
