"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  KeyRound,
  Users,
  Edit2,
  X,
  ArrowRight,
} from "lucide-react";
import { initialRoles, RoleDefinition } from "@/data/admin/adminData";
import {
  getStoredRoles,
  saveStoredRoles,
} from "@/lib/adminDataStore";

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    });
  }, []);

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

      {/* Role Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs flex flex-col justify-between hover:border-[#823296]/30 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  {role.nama}
                </h2>
                <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>{role.userCount} User</span>
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
                <button
                  type="button"
                  onClick={() => handleOpenEdit(role)}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border border-stone-200 text-stone-600 hover:text-[#823296] hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Edit Role & Deskripsi"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <Link
                  href={`/admin/permissions?role=${role.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#823296] hover:text-[#5E2276] hover:underline"
                >
                  <span>Hak Akses</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}

