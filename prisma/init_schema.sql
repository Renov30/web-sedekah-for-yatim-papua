-- ==============================================================================
-- DATABASE SCHEMA: Sedekah for Yatim Papua (SFY)
-- Engine: PostgreSQL
-- Standalone SQL Initialization Script for Cloud Deployments (Neon, Supabase, Railway)
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- 1. ROLES
CREATE TABLE IF NOT EXISTS "roles" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "badgeColor" TEXT NOT NULL DEFAULT 'bg-purple-100 text-purple-900 border-purple-300',
    "deskripsi" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- 2. ROLE PERMISSIONS
CREATE TABLE IF NOT EXISTS "role_permissions" (
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

-- 3. USERS
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "roleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "wilayahTugas" TEXT NOT NULL DEFAULT 'Sekretariat Pusat Jayapura',
    "terakhirLogin" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- 4. DISTRICTS (Distrik)
CREATE TABLE IF NOT EXISTS "districts" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL DEFAULT 'Kab. Merauke',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- 5. VILLAGES (Kampung)
CREATE TABLE IF NOT EXISTS "villages" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL DEFAULT 'Kab. Merauke',
    "catatan" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- 6. AREA VOLUNTEERS (Pengurus AV)
CREATE TABLE IF NOT EXISTS "area_volunteers" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "kampung" TEXT NOT NULL,
    "distrik" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "catatanWilayah" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tanggalBergabung" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "area_volunteers_pkey" PRIMARY KEY ("id")
);

-- 7. ORPHANS (Anak Yatim)
CREATE TABLE IF NOT EXISTS "orphans" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "namaPanggilan" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "usia" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "asalDaerah" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kampung" TEXT,
    "pjAvId" TEXT,
    "pjAvNama" TEXT,
    "tempatTinggal" TEXT NOT NULL,
    "wali" TEXT NOT NULL,
    "jenjangPendidikan" TEXT NOT NULL,
    "kebutuhanMendesak" TEXT NOT NULL,
    "statusVerifikasi" TEXT NOT NULL DEFAULT 'Menunggu Survei',
    "tanggalMasuk" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orphans_pkey" PRIMARY KEY ("id")
);

-- 8. VOLUNTEERS (Relawan Umum)
CREATE TABLE IF NOT EXISTS "volunteers" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "domisili" TEXT NOT NULL,
    "divisi" TEXT NOT NULL,
    "keahlian" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu Verifikasi',
    "tanggalGabung" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- 9. DONORS (Donatur)
CREATE TABLE IF NOT EXISTS "donors" (
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- 10. FINANCE TRANSACTIONS (Transaksi Keuangan)
CREATE TABLE IF NOT EXISTS "finance_transactions" (
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
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_transactions_pkey" PRIMARY KEY ("id")
);

-- INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS "role_permissions_roleId_moduleId_key" ON "role_permissions"("roleId", "moduleId");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "districts_nama_key" ON "districts"("nama");
CREATE UNIQUE INDEX IF NOT EXISTS "villages_districtId_nama_key" ON "villages"("districtId", "nama");
CREATE UNIQUE INDEX IF NOT EXISTS "finance_transactions_noRef_key" ON "finance_transactions"("noRef");

-- FOREIGN KEYS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_permissions_roleId_fkey') THEN
        ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_roleId_fkey') THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'villages_districtId_fkey') THEN
        ALTER TABLE "villages" ADD CONSTRAINT "villages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orphans_pjAvId_fkey') THEN
        ALTER TABLE "orphans" ADD CONSTRAINT "orphans_pjAvId_fkey" FOREIGN KEY ("pjAvId") REFERENCES "area_volunteers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'finance_transactions_donorId_fkey') THEN
        ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

