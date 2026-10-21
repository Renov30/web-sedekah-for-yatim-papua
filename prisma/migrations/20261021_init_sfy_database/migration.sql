-- Migration: 20261021_init_sfy_database
-- Description: Skema awal database Sedekah for Yatim Papua (SFY)

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable: roles
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "badgeColor" TEXT NOT NULL DEFAULT 'bg-purple-100 text-purple-900 border-purple-300',
    "deskripsi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: role_permissions
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "roleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "wilayahTugas" TEXT NOT NULL DEFAULT 'Sekretariat Pusat Jayapura',
    "terakhirLogin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: orphans
CREATE TABLE "orphans" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "namaPanggilan" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "usia" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "asalDaerah" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "tempatTinggal" TEXT NOT NULL,
    "wali" TEXT NOT NULL,
    "jenjangPendidikan" TEXT NOT NULL,
    "kebutuhanMendesak" TEXT NOT NULL,
    "statusVerifikasi" TEXT NOT NULL DEFAULT 'Menunggu Survei',
    "tanggalMasuk" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orphans_pkey" PRIMARY KEY ("id")
);

-- CreateTable: volunteers
CREATE TABLE "volunteers" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "domisili" TEXT NOT NULL,
    "divisi" TEXT NOT NULL,
    "keahlian" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu Verifikasi',
    "tanggalGabung" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: donors
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "email" TEXT,
    "noTelepon" TEXT NOT NULL,
    "totalDonasi" BIGINT NOT NULL DEFAULT 0,
    "jumlahFrekuensi" INTEGER NOT NULL DEFAULT 0,
    "programFavorit" TEXT NOT NULL DEFAULT 'Pendidikan Santri Papua',
    "status" TEXT NOT NULL DEFAULT 'Donatur Rutin',
    "tanggalTerakhir" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable: finance_transactions
CREATE TABLE "finance_transactions" (
    "id" TEXT NOT NULL,
    "noRef" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" BIGINT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "metode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Terverifikasi',
    "petugas" TEXT NOT NULL,
    "donorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_moduleId_key" ON "role_permissions"("roleId", "moduleId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "finance_transactions_noRef_key" ON "finance_transactions"("noRef");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

