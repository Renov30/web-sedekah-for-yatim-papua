"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Mail,
  MapPin,
  X,
  UserPlus,
  Lock,
} from "lucide-react";
import {
  initialUsers,
  initialRoles,
  UserAccount,
} from "@/data/admin/adminData";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    roleId: "staf_lapangan",
    status: "Aktif" as "Aktif" | "Non-aktif",
    wilayahTugas: "Sekretariat Pusat Jayapura",
  });

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
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Aktif" ? "Non-aktif" : "Aktif";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    if (selectedUser && selectedUser.id === id) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Aktif" ? "Non-aktif" : "Aktif",
            }
          : null
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: UserAccount = {
      id: `USR-00${users.length + 1}`,
      nama: formData.nama,
      email: formData.email,
      roleId: formData.roleId,
      status: formData.status,
      terakhirLogin: "Baru Dibuat",
      wilayahTugas: formData.wilayahTugas,
    };

    setUsers([newRecord, ...users]);
    setIsAddModalOpen(false);
    setFormData({
      nama: "",
      email: "",
      roleId: "staf_lapangan",
      status: "Aktif",
      wilayahTugas: "Sekretariat Pusat Jayapura",
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Kelola Pengguna Sistem
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Manajemen akun administrator, staf operasional, pendata lapangan, dan bendahara lembaga SFY Papua.
          </p>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah User Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Total Akun Terdaftar</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {users.length} Pengguna
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Akun Aktif</p>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">
            {users.filter((u) => u.status === "Aktif").length} User
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Tingkat Hak Akses</p>
          <p className="text-xl font-bold text-stone-900 mt-0.5">
            {initialRoles.length} Roles
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
          <p className="text-xs text-stone-500">Operator Non-Aktif</p>
          <p className="text-xl font-bold text-stone-400 mt-0.5">
            {users.filter((u) => u.status === "Non-aktif").length} User
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama akun, email, atau wilayah tugas..."
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
            <option value="all">Semua Role Jabatan</option>
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
            <option value="all">Semua Status Akun</option>
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
                <th className="py-3.5 px-4">Nama Pengguna & ID</th>
                <th className="py-3.5 px-3">Email Akun</th>
                <th className="py-3.5 px-3">Jabatan & Role</th>
                <th className="py-3.5 px-3">Wilayah Penugasan</th>
                <th className="py-3.5 px-3">Terakhir Login</th>
                <th className="py-3.5 px-3 text-center">Status Akun</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
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
                        <div className="w-8 h-8 rounded-full bg-[#823296] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900">{u.nama}</p>
                          <span className="font-mono text-[10px] text-stone-400">
                            {u.id}
                          </span>
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
                        title="Klik untuk mengubah status akses login"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${
                          u.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-700"
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
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#823296] hover:text-white transition-colors"
                      >
                        <span>Kelola</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/View User Modal */}
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
                  <span className="text-stone-500">Jabatan Saat Ini:</span>
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
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedUser.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800"
                >
                  Status: {selectedUser.status} (Klik ubah)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Tautan reset password telah dikirim ke ${selectedUser.email}`);
                    setSelectedUser(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kirim Reset Password</span>
                </button>
              </div>
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
                  Nama Lengkap Operator *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama staf..."
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
                  placeholder="Contoh: Sekretariat Jayapura / Lapangan Keerom"
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
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

