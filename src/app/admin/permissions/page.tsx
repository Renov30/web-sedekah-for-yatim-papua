"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Save,
} from "lucide-react";
import {
  initialRoles,
  moduleList,
  initialPermissions,
  RolePermissionsMap,
} from "@/data/admin/adminData";

function PermissionsContent() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role");

  const [selectedRoleId, setSelectedRoleId] = useState<string>("super_admin");
  const [permissionsMap, setPermissionsMap] =
    useState<RolePermissionsMap>(initialPermissions);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (requestedRole && initialRoles.some((r) => r.id === requestedRole)) {
      queueMicrotask(() => setSelectedRoleId(requestedRole));
    }
  }, [requestedRole]);

  const currentRole =
    initialRoles.find((r) => r.id === selectedRoleId) || initialRoles[0];

  const currentRolePerms = permissionsMap[selectedRoleId] || {};

  const handleToggleAction = (
    moduleId: string,
    action: "create" | "read" | "update" | "delete"
  ) => {
    setPermissionsMap((prev) => {
      const currentRoleObj = prev[selectedRoleId] || {};
      const currentModObj = currentRoleObj[moduleId] || {
        create: false,
        read: false,
        update: false,
        delete: false,
      };

      return {
        ...prev,
        [selectedRoleId]: {
          ...currentRoleObj,
          [moduleId]: {
            ...currentModObj,
            [action]: !currentModObj[action],
          },
        },
      };
    });
  };

  const handleSetAll = (enable: boolean) => {
    setPermissionsMap((prev) => {
      const updatedModObj: {
        [moduleId: string]: {
          create: boolean;
          read: boolean;
          update: boolean;
          delete: boolean;
        };
      } = {};

      moduleList.forEach((m) => {
        updatedModObj[m.id] = {
          create: enable,
          read: enable,
          update: enable,
          delete: enable,
        };
      });

      return {
        ...prev,
        [selectedRoleId]: updatedModObj,
      };
    });
  };

  const handleSetReadOnly = () => {
    setPermissionsMap((prev) => {
      const updatedModObj: {
        [moduleId: string]: {
          create: boolean;
          read: boolean;
          update: boolean;
          delete: boolean;
        };
      } = {};

      moduleList.forEach((m) => {
        updatedModObj[m.id] = {
          create: false,
          read: true,
          update: false,
          delete: false,
        };
      });

      return {
        ...prev,
        [selectedRoleId]: updatedModObj,
      };
    });
  };

  const handleSave = () => {
    setSavedSuccessMessage(
      `Hak akses untuk role "${currentRole.nama}" berhasil diperbarui dan disinkronisasi ke sesi operator!`
    );
    setTimeout(() => {
      setSavedSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Penentuan Permission Role
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#823296] border border-purple-200">
              Matriks Akses Granular
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#823296] text-white hover:bg-[#702882] transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Hak Akses</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {initialRoles.map((r) => {
            const isSelected = r.id === selectedRoleId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleId(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#823296] text-white shadow-2xs"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {r.nama}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Role Scope Card */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentRole.badgeColor}`}
          >
            {currentRole.nama}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            ({currentRole.id})
          </span>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSetAll(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer"
          >
            Pilih Semua
          </button>
          <button
            type="button"
            onClick={handleSetReadOnly}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 cursor-pointer"
          >
            Hanya Baca
          </button>
          <button
            type="button"
            onClick={() => handleSetAll(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Kosongkan
          </button>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[36%] min-w-[200px]">Modul Aplikasi</th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Read (Lihat)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Create (Tambah)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Update (Ubah)</span>
                </th>
                <th className="py-3 px-3 w-[16%] text-center">
                  <span className="inline-block">Delete (Hapus)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {moduleList.map((mod) => {
                const actionState = currentRolePerms[mod.id] || {
                  create: false,
                  read: false,
                  update: false,
                  delete: false,
                };

                return (
                  <tr
                    key={mod.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900 text-sm">
                        {mod.name}
                      </p>
                    </td>

                    {/* Read */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={actionState.read}
                        onChange={() => handleToggleAction(mod.id, "read")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer"
                      />
                    </td>

                    {/* Create */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={actionState.create}
                        onChange={() => handleToggleAction(mod.id, "create")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer"
                      />
                    </td>

                    {/* Update */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={actionState.update}
                        onChange={() => handleToggleAction(mod.id, "update")}
                        className="w-4 h-4 rounded text-[#823296] focus:ring-[#823296] cursor-pointer"
                      />
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={actionState.delete}
                        onChange={() => handleToggleAction(mod.id, "delete")}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PermissionsAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-stone-500">
          Memuat konfigurasi permission...
        </div>
      }
    >
      <PermissionsContent />
    </Suspense>
  );
}

