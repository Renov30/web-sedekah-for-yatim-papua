"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  KeyRound,
  Users,
  Edit2,
  Trash2,
  RotateCcw,
  AlertCircle,
  X,
  ArrowRight,
  CheckSquare,
  Shield,
} from "lucide-react";
import { initialRoles, RoleDefinition } from "@/data/admin/adminData";
import {
  getStoredRoles,
  saveStoredRoles,
} from "@/lib/adminDataStore";
import { getStoredUsers, UserWithAuth } from "@/lib/auth";

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [users, setUsers] = useState<UserWithAuth[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewTrash, setViewTrash] = useState(false);
  const [softDeleteTarget, setSoftDeleteTarget] =
    useState<RoleDefinition | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] =
    useState<RoleDefinition | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkSoftDeleteModalOpen, setBulkSoftDeleteModalOpen] = useState(false);
  const [bulkPermanentDeleteModalOpen, setBulkPermanentDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  // Edit Role State
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [editFormData, setEditFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  useEffect(() => {
    queueMicrotask(() => {
      setRoles(getStoredRoles());
      setUsers(getStoredUsers());
    });
  }, []);

  const activeRoles = roles.filter((r) => !r.isDeleted);
  const deletedRoles = roles.filter((r) => r.isDeleted);
  const displayedRoles = viewTrash ? deletedRoles : activeRoles;

  const getActiveUserCountForRole = (roleId: string, fallbackCount: number) => {
    if (users.length === 0) return fallbackCount;
    return users.filter((u) => !u.isDeleted && u.roleId === roleId).length;
  };

  const handleSoftDelete = (role: RoleDefinition) => {
    if (role.id === "super_admin") return;
    const updated = roles.map((r) =>
      r.id === role.id
        ? { ...r, isDeleted: true, deletedAt: new Date().toISOString() }
        : r
    );
    setRoles(updated);
    saveStoredRoles(updated);
    setSoftDeleteTarget(null);
  };

  const handleRestore = (role: RoleDefinition) => {
    const updated = roles.map((r) =>
      r.id === role.id
        ? { ...r, isDeleted: false, deletedAt: undefined }
        : r
    );
    setRoles(updated);
    saveStoredRoles(updated);
  };

  const handlePermanentDelete = (id: string) => {
    if (id === "super_admin") return;
    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    saveStoredRoles(updated);
    setPermanentDeleteTarget(null);
  };

  const selectableRoles = displayedRoles.filter((r) => r.id !== "super_admin");
  const isAllSelected =
    selectableRoles.length > 0 &&
    selectableRoles.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableRoles.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (id === "super_admin") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkSoftDelete = () => {
    const now = new Date().toISOString();
    const deletableIds = selectedIds.filter((id) => id !== "super_admin");

    const updated = roles.map((r) => {
      if (deletableIds.includes(r.id)) {
        return {
          ...r,
          isDeleted: true,
          deletedAt: now,
        };
      }
      return r;
    });

    setRoles(updated);
    saveStoredRoles(updated);
    setSelectedIds([]);
    setBulkSoftDeleteModalOpen(false);
  };

  const handleBulkRestore = () => {
    const updated = roles.map((r) => {
      if (selectedIds.includes(r.id)) {
        return {
          ...r,
          isDeleted: false,
          deletedAt: undefined,
        };
      }
      return r;
    });

    setRoles(updated);
    saveStoredRoles(updated);
    setSelectedIds([]);
  };

  const handleBulkPermanentDelete = () => {
    const deletableIds = selectedIds.filter((id) => id !== "super_admin");
    const updated = roles.filter((r) => !deletableIds.includes(r.id));
    setRoles(updated);
    saveStoredRoles(updated);
    setSelectedIds([]);
    setBulkPermanentDeleteModalOpen(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = formData.nama.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const newRole: RoleDefinition = {
      id: newId,
      nama: formData.nama,
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      deskripsi: formData.deskripsi,
      userCount: 0,
    };

    const updated = [...roles, newRole];
    setRoles(updated);
    saveStoredRoles(updated);
    setIsAddModalOpen(false);
    setFormData({ nama: "", deskripsi: "" });
  };

  const handleOpenEdit = (role: RoleDefinition) => {
    setEditingRole(role);
    setEditFormData({
      nama: role.nama,
      deskripsi: role.deskripsi,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    const updated = roles.map((r) => {
      if (r.id === editingRole.id) {
        return {
          ...r,
          nama: editFormData.nama.trim(),
          deskripsi: editFormData.deskripsi.trim(),
        };
      }
      return r;
    });

    setRoles(updated);
    saveStoredRoles(updated);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Manajemen Role & Jabatan
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/permissions"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#823296]" />
            <span>Matriks Permission</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Role Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs Aktif vs Kotak Sampah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => {
              setViewTrash(false);
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              !viewTrash
                ? "bg-white text-stone-900 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Data Aktif ({activeRoles.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setViewTrash(true);
              setSelectedIds([]);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewTrash
                ? "bg-stone-900 text-white shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kotak Sampah ({deletedRoles.length})</span>
          </button>
        </div>
        {viewTrash && (
          <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            Menampilkan data role/jabatan yang dihapus sementara (Soft Delete).
          </span>
        )}

        {selectableRoles.length > 0 && (
          <button
            type="button"
            onClick={toggleSelectAll}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>{isAllSelected ? "Batalkan Semua Pilihan" : `Pilih Semua (${selectableRoles.length})`}</span>
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-red-900 font-semibold">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.length} role jabatan terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl border border-red-200 text-stone-700 bg-white hover:bg-stone-50 font-semibold cursor-pointer"
            >
              Batal Pilih
            </button>
            {viewTrash ? (
              <>
                <button
                  type="button"
                  onClick={handleBulkRestore}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan ({selectedIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkPermanentDeleteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Permanen ({selectedIds.length})</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setBulkSoftDeleteModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus {selectedIds.length} Role Terpilih</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Role Grid Cards */}
      {displayedRoles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-500 text-sm">
          {viewTrash
            ? "Kotak sampah kosong. Tidak ada role atau jabatan yang terhapus."
            : "Belum ada data role atau jabatan terdaftar."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRoles.map((role) => (
            <div
              key={role.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between transition-colors ${
                selectedIds.includes(role.id)
                  ? "border-purple-400 bg-purple-50/20"
                  : "border-stone-200/80 hover:border-[#823296]/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {role.id !== "super_admin" ? (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(role.id)}
                        onChange={() => toggleSelectRow(role.id)}
                        className="w-4 h-4 rounded border-stone-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        title="Pilih role"
                      />
                    ) : (
                      <span title="Role Super Admin dilindungi sistem">
                        <Shield className="w-3.5 h-3.5 text-stone-300" />
                      </span>
                    )}
                    <h2 className="text-base font-bold text-stone-900">
                      {role.nama}
                    </h2>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{getActiveUserCountForRole(role.id, role.userCount)} User</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                  {role.deskripsi}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="font-mono text-[10px] text-stone-400">
                  id: {role.id}
                </span>
                <div className="flex items-center gap-2">
                  {viewTrash ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRestore(role)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="Pulihkan Role"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Pulihkan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPermanentDeleteTarget(role)}
                        className="p-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(role)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border border-stone-200 text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                        title="Edit Role & Deskripsi"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      {role.id !== "super_admin" && (
                        <button
                          type="button"
                          onClick={() => setSoftDeleteTarget(role)}
                          className="p-1 rounded-lg border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus ke Kotak Sampah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Link
                        href={`/admin/permissions?role=${role.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#823296] hover:text-[#5E2276] hover:underline"
                      >
                        <span>Hak Akses</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Tambah Role Baru
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
                  Nama Jabatan / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Manajer Distribusi Logistik"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Deskripsi Lingkup Wewenang *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan batasan tanggung jawab jabatan ini..."
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
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
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#823296] bg-purple-50 px-2 py-0.5 rounded">
                  {editingRole.id}
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  Edit Data Role
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Nama Jabatan / Role *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.nama}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Deskripsi Lingkup Wewenang *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editFormData.deskripsi}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-[#823296]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Data Role (Soft Delete) */}
      {softDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus Data Role (Soft Delete)</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan role/jabatan <strong>{softDeleteTarget.nama}</strong> ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Role ini tidak akan dihapus permanen dan dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSoftDeleteTarget(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSoftDelete(softDeleteTarget)}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan ke Sampah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Permanen */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Role Secara Permanen</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus role <strong>{permanentDeleteTarget.nama}</strong> secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat role ini akan dihapus sepenuhnya dari database lokal.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPermanentDeleteTarget(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(permanentDeleteTarget.id)}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Hapus Sekaligus Banyak (Bulk Soft Delete) */}
      {bulkSoftDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span>Hapus {selectedIds.length} Role Jabatan Sekaligus</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin memindahkan <strong>{selectedIds.length} role jabatan</strong> yang dipilih ke Kotak Sampah?
            </p>
            <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              Role yang dihapus sementara dapat dipulihkan sewaktu-waktu melalui tab <strong>Kotak Sampah</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBulkSoftDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkSoftDelete}
                className="px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Pindahkan {selectedIds.length} Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Permanen Sekaligus (Bulk Permanent Delete) */}
      {bulkPermanentDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Hapus Permanen {selectedIds.length} Role</span>
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{selectedIds.length} role jabatan</strong> yang dipilih secara permanen?
            </p>
            <p className="text-[11px] text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
              Tindakan ini tidak dapat dibatalkan. Riwayat role ini akan dihapus sepenuhnya dari database lokal.
            </p>
            <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBulkPermanentDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkPermanentDelete}
                className="px-4 py-2 rounded-xl font-semibold bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Hapus Permanen ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

