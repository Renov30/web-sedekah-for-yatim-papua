import { PrismaClient } from "@prisma/client";
import {
  initialOrphans,
  initialVolunteers,
  initialDonors,
  initialFinances,
  initialUsers,
  initialRoles,
  initialPermissions,
  moduleList,
} from "../src/data/admin/adminData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database SFY Papua...");

  // 1. Roles
  console.log("➡️ Seeding Roles...");
  for (const r of initialRoles) {
    await prisma.role.upsert({
      where: { id: r.id },
      update: {
        nama: r.nama,
        badgeColor: r.badgeColor,
        deskripsi: r.deskripsi,
      },
      create: {
        id: r.id,
        nama: r.nama,
        badgeColor: r.badgeColor,
        deskripsi: r.deskripsi,
      },
    });
  }

  // 2. Role Permissions
  console.log("➡️ Seeding Role Permissions...");
  for (const [roleId, modules] of Object.entries(initialPermissions)) {
    for (const [moduleId, perms] of Object.entries(modules)) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_moduleId: {
            roleId,
            moduleId,
          },
        },
        update: {
          create: perms.create,
          read: perms.read,
          update: perms.update,
          delete: perms.delete,
        },
        create: {
          roleId,
          moduleId,
          create: perms.create,
          read: perms.read,
          update: perms.update,
          delete: perms.delete,
        },
      });
    }
  }

  // 3. Users
  console.log("➡️ Seeding Users...");
  for (const u of initialUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        nama: u.nama,
        roleId: u.roleId,
        status: u.status,
        wilayahTugas: u.wilayahTugas,
        terakhirLogin: u.terakhirLogin,
      },
      create: {
        id: u.id,
        nama: u.nama,
        email: u.email,
        roleId: u.roleId,
        status: u.status,
        wilayahTugas: u.wilayahTugas,
        terakhirLogin: u.terakhirLogin,
      },
    });
  }

  // 4. Orphans
  console.log("➡️ Seeding Anak Yatim...");
  for (const o of initialOrphans) {
    await prisma.orphan.upsert({
      where: { id: o.id },
      update: {
        namaLengkap: o.namaLengkap,
        namaPanggilan: o.namaPanggilan,
        gender: o.gender,
        usia: o.usia,
        status: o.status,
        asalDaerah: o.asalDaerah,
        kabupaten: o.kabupaten,
        tempatTinggal: o.tempatTinggal,
        wali: o.wali,
        jenjangPendidikan: o.jenjangPendidikan,
        kebutuhanMendesak: o.kebutuhanMendesak,
        statusVerifikasi: o.statusVerifikasi,
        tanggalMasuk: o.tanggalMasuk,
      },
      create: {
        id: o.id,
        namaLengkap: o.namaLengkap,
        namaPanggilan: o.namaPanggilan,
        gender: o.gender,
        usia: o.usia,
        status: o.status,
        asalDaerah: o.asalDaerah,
        kabupaten: o.kabupaten,
        tempatTinggal: o.tempatTinggal,
        wali: o.wali,
        jenjangPendidikan: o.jenjangPendidikan,
        kebutuhanMendesak: o.kebutuhanMendesak,
        statusVerifikasi: o.statusVerifikasi,
        tanggalMasuk: o.tanggalMasuk,
      },
    });
  }

  // 5. Volunteers
  console.log("➡️ Seeding Relawan...");
  for (const v of initialVolunteers) {
    await prisma.volunteer.upsert({
      where: { id: v.id },
      update: {
        namaLengkap: v.namaLengkap,
        email: v.email,
        noTelepon: v.noTelepon,
        domisili: v.domisili,
        divisi: v.divisi,
        keahlian: v.keahlian,
        status: v.status,
        tanggalGabung: v.tanggalGabung,
      },
      create: {
        id: v.id,
        namaLengkap: v.namaLengkap,
        email: v.email,
        noTelepon: v.noTelepon,
        domisili: v.domisili,
        divisi: v.divisi,
        keahlian: v.keahlian,
        status: v.status,
        tanggalGabung: v.tanggalGabung,
      },
    });
  }

  // 6. Donors
  console.log("➡️ Seeding Donatur...");
  for (const d of initialDonors) {
    await prisma.donor.upsert({
      where: { id: d.id },
      update: {
        nama: d.nama,
        tipe: d.tipe,
        email: d.email,
        noTelepon: d.noTelepon,
        totalDonasi: BigInt(d.totalDonasi),
        jumlahFrekuensi: d.jumlahFrekuensi,
        programFavorit: d.programFavorit,
        status: d.status,
        tanggalTerakhir: d.tanggalTerakhir,
      },
      create: {
        id: d.id,
        nama: d.nama,
        tipe: d.tipe,
        email: d.email,
        noTelepon: d.noTelepon,
        totalDonasi: BigInt(d.totalDonasi),
        jumlahFrekuensi: d.jumlahFrekuensi,
        programFavorit: d.programFavorit,
        status: d.status,
        tanggalTerakhir: d.tanggalTerakhir,
      },
    });
  }

  // 7. Finance Transactions
  console.log("➡️ Seeding Transaksi Keuangan...");
  for (const f of initialFinances) {
    await prisma.financeTransaction.upsert({
      where: { noRef: f.noRef },
      update: {
        tanggal: f.tanggal,
        jenis: f.jenis,
        kategori: f.kategori,
        jumlah: BigInt(f.jumlah),
        keterangan: f.keterangan,
        metode: f.metode,
        status: f.status,
        petugas: f.petugas,
      },
      create: {
        id: f.id,
        noRef: f.noRef,
        tanggal: f.tanggal,
        jenis: f.jenis,
        kategori: f.kategori,
        jumlah: BigInt(f.jumlah),
        keterangan: f.keterangan,
        metode: f.metode,
        status: f.status,
        petugas: f.petugas,
      },
    });
  }

  console.log("✅ Seeding database SFY Papua berhasil diselesaikan!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

