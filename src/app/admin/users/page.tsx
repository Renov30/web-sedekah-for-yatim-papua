"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  MapPin,
  X,
  UserPlus,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
} from "lucide-react";
import { initialRoles } from "@/data/admin/adminData";
import {
  UserWithAuth,
  getStoredUsers,
  registerNewUser,
  updateStoredUser,
  deleteStoredUser,
  resetUserPassword,
  MASTER_ADMIN_CREDENTIALS,
} from "@/lib/auth";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserWithAuth[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState<UserWithAuth | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetPasswordModalUser, setResetPasswordModalUser] =
    useState<UserWithAuth | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] =
    useState<UserWithAuth | null>(null);

  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    roleId: "staf_lapangan",
    status: "Aktif" as "Aktif" | "Non-aktif",
    wilayahTugas: "Sekretariat Pusat Merauke (Papua Selatan)",
  });
  const [showFormPassword, setShowFormPassword] = useState(false);

  useEffect(() => {
    // Load persisted users from storage
    queueMicrotask(() => setUsers(getStoredUsers()));
  }, []);

  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setAlertFeedback({ type, message });
    setTimeout(() => {
      setAlertFeedback(null);
    }, 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.wilayahTugas.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || u.roleId === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleName = (roleId: string) => {
    const role = initialRoles.find((r) => r.id === roleId);
    return role ? role.nama : roleId;
  };

  const getRoleBadge = (roleId: string) => {
    const role = initialRoles.find((r) => r.id === roleId);
    return role ? role.badgeColor : "bg-stone-100 text-stone-800";
  };

  const handleToggleStatus = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    if (
      target.id === "USR-001" ||
      target.email.toLowerCase() ===
        MASTER_ADMIN_CREDENTIALS.email.toLowerCase()
    ) {
      showNotification(
        "error",
        "Akun Master Admin utama harus selalu aktif demi stabilitas sistem."
      );
      return;
    }

    const nextStatus = target.status === "Aktif" ? "Non-aktif" : "Aktif";
    const res = updateStoredUser(id, { status: nextStatus });

    if (res.success) {
      refreshUsers();
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, status: nextStatus });
      }
      showNotification(
        "success",
        `Status ${target.nama} berhasil diubah menjadi ${nextStatus}.`
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      showNotification("error", "Kata sandi awal minimal 6 karakter.");
      return;
    }

    const res = registerNewUser({
      nama: formData.nama.trim(),
      email: formData.email.trim(),
      password: formData.password,
      roleId: formData.roleId,
      status: formData.status,
      wilayahTugas: formData.wilayahTugas.trim() || "Merauke",
    });

    if (!res.success) {
      showNotification("error", res.message || "Gagal membuat pengguna.");
      return;
    }

    refreshUsers();
    setIsAddModalOpen(false);
    showNotification(
      "success",
      `Akun pengguna ${formData.nama} berhasil dibuat dan dapat langsung digunakan untuk login.`
    );
    setFormData({
      nama: "",
      email: "",
      password: "",
      roleId: "staf_lapangan",
      status: "Aktif",
      wilayahTugas: "Sekretariat Pusat Merauke (Papua Selatan)",
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordModalUser) return;

    if (newPasswordInput.length < 6) {
      showNotification("error", "Kata sandi baru minimal 6 karakter.");
      return;
    }

    const res = resetUserPassword(
      resetPasswordModalUser.id,
      newPasswordInput
    );
    if (!res.success) {
      showNotification(
        "error",
        res.message || "Gagal memperbarui kata sandi."
      );
      return;
    }

    refreshUsers();
    setResetPasswordModalUser(null);
    setNewPasswordInput("");
    showNotification(
      "success",
      `Kata sandi baru untuk ${resetPasswordModalUser.nama} berhasil disimpan.`
    );
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmUser) return;

    const res = deleteStoredUser(deleteConfirmUser.id);
    if (!res.success) {
      showNotification("error", res.message || "Gagal menghapus pengguna.");
      setDeleteConfirmUser(null);
      return;
    }

    refreshUsers();
    if (selectedUser?.id === deleteConfirmUser.id) {
      setSelectedUser(null);
    }
    setDeleteConfirmUser(null);
    showNotification(
      "success",
      `Akun pengguna ${deleteConfirmUser.nama} telah berhasil dihapus.`
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Nama Pengguna",
      "Email",
      "Role",
      "Wilayah Tugas",
      "Status",
      "Terakhir Login",
    ];

    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.nama}"`,
      u.email,
      `"${getRoleName(u.roleId)}"`,
      `"${u.wilayahTugas}"`,
      u.status,
      `"${u.terakhirLogin}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daftar_user_admin_sfy_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isMasterAccount = (u: UserWithAuth) => {
    return (
      u.id === "USR-001" ||
      u.email.toLowerCase() ===
        MASTER_ADMIN_CREDENTIALS.email.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {alertFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in ${
            alertFeedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {alertFeedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{alertFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertFeedback(null)}
            className="p-1 text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Kelola Pengguna Sistem
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor User</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar (3 Parts: Atas, Tengah, Bawah - No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Pengguna
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {users.length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Akun</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Terdaftar di Sistem</span>
            <span className="font-semibold text-stone-700">SFY Merauke</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Status Akun
          </p>
          <p className="text-2xl font-extrabold text-emerald-700 my-2">
            {users.filter((u) => u.status === "Aktif").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Aktif</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Non-aktif / Dibatasi</span>
            <span className="font-semibold text-stone-700">
              {users.filter((u) => u.status === "Non-aktif").length} Akun
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Super Administrator
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {users.filter((u) => u.roleId === "super_admin").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Akun</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Akses Penuh</span>
            <span className="font-semibold text-[#823296]">RBAC</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Operator & Koordinator
          </p>
          <p className="text-2xl font-extrabold text-stone-900 my-2">
            {users.filter((u) => u.roleId !== "super_admin").length}{" "}
            <span className="text-xs font-medium text-stone-500 font-sans">Akun</span>
          </p>
          <div className="pt-2.5 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Staf & PJ Wilayah</span>
            <span className="font-semibold text-stone-700">Operasional</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama pengguna, email, atau wilayah tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] focus:ring-1 focus:ring-[#823296]"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Role</option>
            {initialRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-[#823296] bg-white text-stone-700"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-aktif">Non-aktif</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-[24%] min-w-[180px]">Nama Pengguna</th>
                <th className="py-3.5 px-3 w-[20%] min-w-[160px]">Email Akun</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[130px]">Jabatan & Role</th>
                <th className="py-3.5 px-3 w-[16%] min-w-[130px]">Wilayah Penugasan</th>
                <th className="py-3.5 px-3 w-[12%] min-w-[110px]">Terakhir Login</th>
                <th className="py-3.5 px-3 w-[6%] min-w-[85px] text-center">Status</th>
                <th className="py-3.5 px-4 w-[6%] min-w-[70px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-stone-500 text-sm"
                  >
                    Tidak ditemukan pengguna yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isMasterAccount(u)
                              ? "bg-[#5E2276] text-white"
                              : "bg-purple-100 text-[#5E2276]"
                          }`}
                        >
                          {isMasterAccount(u) ? (
                            <Shield className="w-4 h-4" />
                          ) : (
                            u.nama.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-stone-900">{u.nama}</p>
                          {isMasterAccount(u) && (
                            <span className="text-[10px] bg-purple-100 text-[#5E2276] font-bold px-1.5 py-0.2 rounded">
                              Master
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs font-mono text-stone-700">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRoleBadge(
                          u.roleId
                        )}`}
                      >
                        {getRoleName(u.roleId)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{u.wilayahTugas}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-stone-500">
                      {u.terakhirLogin}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        disabled={isMasterAccount(u)}
                        title={
                          isMasterAccount(u)
                            ? "Akun Master Admin selalu aktif"
                            : "Klik untuk mengubah status akses login"
                        }
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-opacity ${
                          isMasterAccount(u)
                            ? "bg-emerald-100 text-emerald-800 cursor-not-allowed opacity-90"
                            : u.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800 hover:opacity-80 cursor-pointer"
                            : "bg-stone-200 text-stone-700 hover:opacity-80 cursor-pointer"
                        }`}
                      >
                        {u.status === "Aktif" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{u.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                          title="Lihat Detail Akun"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResetPasswordModalUser(u);
                            setNewPasswordInput("");
                          }}
                          className="p-1.5 rounded-lg text-xs text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors"
                          title="Ubah Kata Sandi"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        {!isMasterAccount(u) && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(u)}
                            className="p-1.5 rounded-lg text-xs text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                  {selectedUser.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedUser.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Email Akun:</span>
                  <span className="font-mono text-stone-900">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Jabatan & Role:</span>
                  <span className="font-bold text-[#823296]">
                    {getRoleName(selectedUser.roleId)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Wilayah Tugas:</span>
                  <span className="font-medium text-stone-800">
                    {selectedUser.wilayahTugas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Aktivitas Terakhir:</span>
                  <span className="font-medium text-stone-800">
                    {selectedUser.terakhirLogin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Akses:</span>
                  <span
                    className={`font-semibold ${
                      selectedUser.status === "Aktif"
                        ? "text-emerald-700"
                        : "text-stone-500"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedUser.id)}
                  disabled={isMasterAccount(selectedUser)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                    isMasterAccount(selectedUser)
                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer"
                  }`}
                >
                  Ubah Status ({selectedUser.status})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordModalUser(selectedUser);
                    setNewPasswordInput("");
                    setSelectedUser(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Ubah Kata Sandi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Ubah Kata Sandi
              </h3>
              <button
                type="button"
                onClick={() => setResetPasswordModalUser(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Masukkan kata sandi baru untuk akun <strong>{resetPasswordModalUser.nama}</strong> ({resetPasswordModalUser.email}):
            </p>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kata Sandi Baru * (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? "text" : "password"}
                    required
                    placeholder="Kata sandi baru..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 pr-9 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPasswordInModal ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Akun Pengguna</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{deleteConfirmUser.nama}</strong> ({deleteConfirmUser.email})? Pengguna ini tidak akan bisa login lagi ke sistem.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Akun Pengguna Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Lengkap Pengguna *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Faisal"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Alamat Email Resmi *
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@sfypapua.org"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Kata Sandi Awal * (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? "text" : "password"}
                    required
                    placeholder="Tentukan kata sandi..."
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-9 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showFormPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Role Hak Akses
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) =>
                      setFormData({ ...formData, roleId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    {initialRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Aktif" | "Non-aktif",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296] bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-aktif">Non-aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Wilayah Penugasan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sekretariat Merauke / Lapangan Kurik"
                  value={formData.wilayahTugas}
                  onChange={(e) =>
                    setFormData({ ...formData, wilayahTugas: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
