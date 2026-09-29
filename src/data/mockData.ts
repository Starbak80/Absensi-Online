import {
  Student,
  ClassRoom,
  Teacher,
  AttendanceRecord,
  TeacherAttendanceRecord,
  ParentNotificationLog,
  SchoolProfile,
  AdminUser,
} from '../types';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  name: 'SMK TARUNA BHAKTI KADUGEDE',
  npsn: '20246378',
  address: 'Jl. Raya Kadugede No. 80, Kadugede',
  village: 'Kadugede',
  district: 'Kec. Kadugede',
  regency: 'Kabupaten Kuningan',
  province: 'Jawa Barat',
  postalCode: '45561',
  email: 'arsiptb80@gmail.com',
  phone: '(0232) 873421',
  website: 'smktarunabhakti-kadugede.sch.id',
  principalName: 'Drs. H. Sukardi, M.Pd',
  principalNip: '19680512 199403 1 004',
  vicePrincipalName: 'Asep Saepudin, S.Pd',
  vicePrincipalNip: '19750824 200212 1 003',
};

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'c-x-rpl-1',
    name: 'X RPL 1',
    grade: 'X',
    major: 'RPL',
    academicYear: '2026/2027',
    homeroomTeacher: 'Dewi Sartika, S.Kom',
    totalStudents: 10,
  },
  {
    id: 'c-x-rpl-2',
    name: 'X RPL 2',
    grade: 'X',
    major: 'RPL',
    academicYear: '2026/2027',
    homeroomTeacher: 'Imam Prasetyo, S.Kom',
    totalStudents: 8,
  },
  {
    id: 'c-x-tkj-1',
    name: 'X TKJ 1',
    grade: 'X',
    major: 'TKJ',
    academicYear: '2026/2027',
    homeroomTeacher: 'Bambang Triyono, S.T',
    totalStudents: 8,
  },
  {
    id: 'c-xi-rpl-1',
    name: 'XI RPL 1',
    grade: 'XI',
    major: 'RPL',
    academicYear: '2026/2027',
    homeroomTeacher: 'Agus Hendrawan, M.Kom',
    totalStudents: 9,
  },
  {
    id: 'c-xi-tkj-1',
    name: 'XI TKJ 1',
    grade: 'XI',
    major: 'TKJ',
    academicYear: '2026/2027',
    homeroomTeacher: 'Rudi Hartono, S.T',
    totalStudents: 8,
  },
  {
    id: 'c-xi-tkro-1',
    name: 'XI TKRO 1',
    grade: 'XI',
    major: 'TKRO',
    academicYear: '2026/2027',
    homeroomTeacher: 'Dadan Ramdani, S.Pd',
    totalStudents: 8,
  },
  {
    id: 'c-xii-rpl-1',
    name: 'XII RPL 1',
    grade: 'XII',
    major: 'RPL',
    academicYear: '2026/2027',
    homeroomTeacher: 'Fitri Handayani, M.Pd',
    totalStudents: 8,
  },
  {
    id: 'c-xii-tkro-1',
    name: 'XII TKRO 1',
    grade: 'XII',
    major: 'TKRO',
    academicYear: '2026/2027',
    homeroomTeacher: 'Endang Sutisna, S.Pd.T',
    totalStudents: 8,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // X RPL 1
  {
    id: 's-101',
    nis: '260101',
    nisn: '0087654321',
    name: 'Aditya Pratama Nugraha',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Budi Nugraha',
    parentPhone: '081223344551',
    parentAddress: 'Desa Kadugede Dusun Manis, Kadugede',
  },
  {
    id: 's-102',
    nis: '260102',
    nisn: '0087654322',
    name: 'Aisyah Putri Rahmadani',
    gender: 'P',
    classId: 'c-x-rpl-1',
    parentName: 'H. Rahmat Hidayat',
    parentPhone: '081398765432',
    parentAddress: 'Jl. Raya Cigugur No. 12, Kuningan',
  },
  {
    id: 's-103',
    nis: '260103',
    nisn: '0087654323',
    name: 'Bagas Dimas Saputra',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Supardi',
    parentPhone: '085721112233',
    parentAddress: 'Desa Babatan Blok Kliwon, Kadugede',
  },
  {
    id: 's-104',
    nis: '260104',
    nisn: '0087654324',
    name: 'Cantika Dewi Lestari',
    gender: 'P',
    classId: 'c-x-rpl-1',
    parentName: 'Siti Rohimah',
    parentPhone: '082114455667',
    parentAddress: 'Desa Winduhaji, Kuningan',
  },
  {
    id: 's-105',
    nis: '260105',
    nisn: '0087654325',
    name: 'Dafi Rizqullah Permana',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Ade Permana',
    parentPhone: '087822998877',
    parentAddress: 'Desa Bayuning, Kadugede',
  },
  {
    id: 's-106',
    nis: '260106',
    nisn: '0087654326',
    name: 'Farhan Maulana Hakim',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Lukman Hakim',
    parentPhone: '089655443322',
    parentAddress: 'Desa Ciketak, Kadugede',
  },
  {
    id: 's-107',
    nis: '260107',
    nisn: '0087654327',
    name: 'Gita Amelia Putri',
    gender: 'P',
    classId: 'c-x-rpl-1',
    parentName: 'Wawan Gunawan',
    parentPhone: '081298112233',
    parentAddress: 'Desa Tinggar, Kadugede',
  },
  {
    id: 's-108',
    nis: '260108',
    nisn: '0087654328',
    name: 'Hafiz Syahputra',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Iwan Setiawan',
    parentPhone: '085811224455',
    parentAddress: 'Kelurahan Purwawinangun, Kuningan',
  },
  {
    id: 's-109',
    nis: '260109',
    nisn: '0087654329',
    name: 'Intan Nuraini',
    gender: 'P',
    classId: 'c-x-rpl-1',
    parentName: 'Encep Sutisna',
    parentPhone: '081388776655',
    parentAddress: 'Desa Ciherang, Kadugede',
  },
  {
    id: 's-110',
    nis: '260110',
    nisn: '0087654330',
    name: 'Jovan Alexander Siregar',
    gender: 'L',
    classId: 'c-x-rpl-1',
    parentName: 'Tigor Siregar',
    parentPhone: '082199887766',
    parentAddress: 'Jl. Veteran No. 45, Kuningan',
  },

  // X RPL 2
  {
    id: 's-201',
    nis: '260201',
    nisn: '0087654331',
    name: 'Kevin Ardiansyah',
    gender: 'L',
    classId: 'c-x-rpl-2',
    parentName: 'Agus Ardiansyah',
    parentPhone: '081234567890',
    parentAddress: 'Desa Margasari, Kadugede',
  },
  {
    id: 's-202',
    nis: '260202',
    nisn: '0087654332',
    name: 'Lestari Indah Wulandari',
    gender: 'P',
    classId: 'c-x-rpl-2',
    parentName: 'Dedi Kuswandi',
    parentPhone: '087812345678',
    parentAddress: 'Kadugede Wetan',
  },
  {
    id: 's-203',
    nis: '260203',
    nisn: '0087654333',
    name: 'Muhammad Fadhil Akbar',
    gender: 'L',
    classId: 'c-x-rpl-2',
    parentName: 'H. Mansyur',
    parentPhone: '085712349988',
    parentAddress: 'Desa Nangka, Kadugede',
  },
  {
    id: 's-204',
    nis: '260204',
    nisn: '0087654334',
    name: 'Nadia Salsabila',
    gender: 'P',
    classId: 'c-x-rpl-2',
    parentName: 'Iis Rosita',
    parentPhone: '081399881122',
    parentAddress: 'Ciporang, Kuningan',
  },
  {
    id: 's-205',
    nis: '260205',
    nisn: '0087654335',
    name: 'Panji Satria Wicaksana',
    gender: 'L',
    classId: 'c-x-rpl-2',
    parentName: 'Toto Suryanto',
    parentPhone: '082211993344',
    parentAddress: 'Desa Sindangjawa, Kadugede',
  },
  {
    id: 's-206',
    nis: '260206',
    nisn: '0087654336',
    name: 'Rafi Ahmad Fauzi',
    gender: 'L',
    classId: 'c-x-rpl-2',
    parentName: 'Fauzi Ridwan',
    parentPhone: '085933221144',
    parentAddress: 'Desa Kadugede Kulon',
  },
  {
    id: 's-207',
    nis: '260207',
    nisn: '0087654337',
    name: 'Riska Melani',
    gender: 'P',
    classId: 'c-x-rpl-2',
    parentName: 'Maman Surahman',
    parentPhone: '081288771199',
    parentAddress: 'Desa Windusengkahan, Kuningan',
  },
  {
    id: 's-208',
    nis: '260208',
    nisn: '0087654338',
    name: 'Yoga Pratama',
    gender: 'L',
    classId: 'c-x-rpl-2',
    parentName: 'Tatang Sutarman',
    parentPhone: '087766554433',
    parentAddress: 'Desa Haurkuning, Nusaherang',
  },

  // XI RPL 1
  {
    id: 's-301',
    nis: '250101',
    nisn: '0078901231',
    name: 'Aldi Taher Prasetyo',
    gender: 'L',
    classId: 'c-xi-rpl-1',
    parentName: 'Bambang Prasetyo',
    parentPhone: '081234998811',
    parentAddress: 'Kadugede Krajan',
  },
  {
    id: 's-302',
    nis: '250102',
    nisn: '0078901232',
    name: 'Annisa Tri Hapsari',
    gender: 'P',
    classId: 'c-xi-rpl-1',
    parentName: 'Surya Dharma',
    parentPhone: '081344556677',
    parentAddress: 'Desa Cikadu, Kadugede',
  },
  {
    id: 's-303',
    nis: '250103',
    nisn: '0078901233',
    name: 'Bima Sakti Nugraha',
    gender: 'L',
    classId: 'c-xi-rpl-1',
    parentName: 'H. Sudrajat',
    parentPhone: '085788990011',
    parentAddress: 'Desa Darma, Kuningan',
  },
  {
    id: 's-304',
    nis: '250104',
    nisn: '0078901234',
    name: 'Chandra Wijaya',
    gender: 'L',
    classId: 'c-xi-rpl-1',
    parentName: 'Hendra Wijaya',
    parentPhone: '082155667788',
    parentAddress: 'Kuningan Kota',
  },
  {
    id: 's-305',
    nis: '250105',
    nisn: '0078901235',
    name: 'Dinda Kirana Maheswari',
    gender: 'P',
    classId: 'c-xi-rpl-1',
    parentName: 'Kuswanto',
    parentPhone: '087899001122',
    parentAddress: 'Desa Jagara, Darma',
  },
  {
    id: 's-306',
    nis: '250106',
    nisn: '0078901236',
    name: 'Eko Prasetyo Utomo',
    gender: 'L',
    classId: 'c-xi-rpl-1',
    parentName: 'Sugeng Utomo',
    parentPhone: '089511223344',
    parentAddress: 'Kadugede Barat',
  },
  {
    id: 's-307',
    nis: '250107',
    nisn: '0078901237',
    name: 'Fani Oktaviani',
    gender: 'P',
    classId: 'c-xi-rpl-1',
    parentName: 'Nana Suryana',
    parentPhone: '081233221100',
    parentAddress: 'Desa Sukasari, Kadugede',
  },
  {
    id: 's-308',
    nis: '250108',
    nisn: '0078901238',
    name: 'Gilang Ramadhan',
    gender: 'L',
    classId: 'c-xi-rpl-1',
    parentName: 'Rahmat Basuki',
    parentPhone: '085877665544',
    parentAddress: 'Desa Babatan, Kadugede',
  },
  {
    id: 's-309',
    nis: '250109',
    nisn: '0078901239',
    name: 'Hesti Wulandari',
    gender: 'P',
    classId: 'c-xi-rpl-1',
    parentName: 'Umar Dani',
    parentPhone: '081399002233',
    parentAddress: 'Desa Kadugede Tengah',
  },

  // XI TKRO 1
  {
    id: 's-401',
    nis: '250201',
    nisn: '0078901240',
    name: 'Aris Munandar',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Dodi Munandar',
    parentPhone: '081299884411',
    parentAddress: 'Kadugede',
  },
  {
    id: 's-402',
    nis: '250202',
    nisn: '0078901241',
    name: 'Budi Santoso',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Santoso',
    parentPhone: '082188776655',
    parentAddress: 'Desa Ciketak, Kadugede',
  },
  {
    id: 's-403',
    nis: '250203',
    nisn: '0078901242',
    name: 'Danu Kusuma',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Roni Kusuma',
    parentPhone: '085733445566',
    parentAddress: 'Desa Tinggar',
  },
  {
    id: 's-404',
    nis: '250204',
    nisn: '0078901243',
    name: 'Feri Irawan',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Irawan',
    parentPhone: '087811223399',
    parentAddress: 'Desa Ciherang',
  },
  {
    id: 's-405',
    nis: '250205',
    nisn: '0078901244',
    name: 'Ilham Kurnia',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Kurnia Ramli',
    parentPhone: '089677889900',
    parentAddress: 'Kadugede',
  },
  {
    id: 's-406',
    nis: '250206',
    nisn: '0078901245',
    name: 'Rizki Fauzan',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Fauzan Effendi',
    parentPhone: '081244556633',
    parentAddress: 'Desa Bayuning',
  },
  {
    id: 's-407',
    nis: '250207',
    nisn: '0078901246',
    name: 'Sandika Galih',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Galih Sujana',
    parentPhone: '085822334411',
    parentAddress: 'Desa Nangka',
  },
  {
    id: 's-408',
    nis: '250208',
    nisn: '0078901247',
    name: 'Wahyu Ramadhan',
    gender: 'L',
    classId: 'c-xi-tkro-1',
    parentName: 'Ramadhan',
    parentPhone: '081377889922',
    parentAddress: 'Kuningan',
  },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-01',
    nip: '19680512 199403 1 004',
    name: 'Drs. H. Sukardi, M.Pd',
    gender: 'L',
    subject: 'Kepala Sekolah / Pend. Kewarganegaraan',
    phone: '081223344001',
    email: 'sukardi.tb@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-02',
    nip: '19750824 200212 1 003',
    name: 'Asep Saepudin, S.Pd',
    gender: 'L',
    subject: 'Waka Kesiswaan / Pendidikan Jasmani & Olahraga',
    phone: '081399887702',
    email: 'asep.saepudin@kadugede.sch.id',
    isPiketToday: true,
  },
  {
    id: 't-03',
    nip: '19840315 200902 2 008',
    name: 'Dewi Sartika, S.Kom',
    gender: 'P',
    subject: 'Produktif RPL (Pemrograman Web & Perangkat Bergerak)',
    phone: '085721110003',
    email: 'dewi.sartika@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-04',
    nip: '19810928 200801 1 012',
    name: 'Agus Hendrawan, M.Kom',
    gender: 'L',
    subject: 'Produktif RPL (Basis Data & Algoritma)',
    phone: '082114450004',
    email: 'agus.hendrawan@kadugede.sch.id',
    isPiketToday: true,
  },
  {
    id: 't-05',
    nip: '19871104 201101 1 007',
    name: 'Bambang Triyono, S.T',
    gender: 'L',
    subject: 'Produktif TKJ (Administrasi Infrastruktur Jaringan)',
    phone: '087822990005',
    email: 'bambang.triyono@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-06',
    nip: '19790214 200604 1 009',
    name: 'Dadan Ramdani, S.Pd',
    gender: 'L',
    subject: 'Produktif TKRO (Pemeliharaan Mesin Kendaraan Ringan)',
    phone: '089655440006',
    email: 'dadan.ramdani@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-07',
    nip: '19890620 201403 2 006',
    name: 'Fitri Handayani, M.Pd',
    gender: 'P',
    subject: 'Matematika Terapan',
    phone: '081298110007',
    email: 'fitri.handayani@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-08',
    nip: '19920117 201801 2 005',
    name: 'Neng Nurjanah, S.Pd',
    gender: 'P',
    subject: 'Bahasa Indonesia & Literasi Digital',
    phone: '085811220008',
    email: 'neng.nurjanah@kadugede.sch.id',
    isPiketToday: true,
  },
  {
    id: 't-09',
    nip: '19830419 201001 1 015',
    name: 'H. Ujang Supriatna, S.Ag',
    gender: 'L',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    phone: '081388770009',
    email: 'ujang.supriatna@kadugede.sch.id',
    isPiketToday: false,
  },
  {
    id: 't-10',
    nip: '19900810 201502 1 004',
    name: 'Rudi Hartono, S.T',
    gender: 'L',
    subject: 'Produktif TKJ (Teknologi Layanan Jaringan)',
    phone: '082199880010',
    email: 'rudi.hartono@kadugede.sch.id',
    isPiketToday: false,
  },
];

// Helper to seed realistic attendance for recent days
export const generateInitialAttendance = (): {
  studentAttendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  notificationLogs: ParentNotificationLog[];
} => {
  const studentAttendance: AttendanceRecord[] = [];
  const teacherAttendance: TeacherAttendanceRecord[] = [];
  const notificationLogs: ParentNotificationLog[] = [];

  // Generate 14 days of realistic past records up to today (2026-09-29)
  const today = new Date('2026-09-29');

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // Skip Sunday

    const dateStr = d.toISOString().split('T')[0];

    // Seed student attendance
    INITIAL_STUDENTS.forEach((student, index) => {
      // Create natural distribution: 88% Hadir, 5% Sakit, 4% Izin, 2% Terlambat, 1% Alpa
      const rand = ((index * 13 + i * 7) % 100);
      let status: 'H' | 'S' | 'I' | 'A' | 'T' = 'H';
      let checkInTime = '06:45';
      let notes = '';

      if (rand >= 97) {
        status = 'A';
        checkInTime = '-';
        notes = 'Tanpa pemberitahuan';
      } else if (rand >= 93) {
        status = 'S';
        checkInTime = '-';
        notes = 'Surat dokter / demam';
      } else if (rand >= 88) {
        status = 'I';
        checkInTime = '-';
        notes = 'Kepentingan keluarga';
      } else if (rand >= 84) {
        status = 'T';
        checkInTime = '07:20';
        notes = 'Terlambat 20 menit (ban bocor)';
      } else {
        const minutes = 30 + ((index * 3 + i * 2) % 25);
        checkInTime = `06:${minutes.toString().padStart(2, '0')}`;
      }

      const recId = `att-${dateStr}-${student.id}`;
      studentAttendance.push({
        id: recId,
        studentId: student.id,
        date: dateStr,
        status,
        checkInTime,
        notes,
        notifiedParent: true,
        notificationStatus: 'sent',
        notifiedAt: `${dateStr} ${checkInTime !== '-' ? checkInTime : '07:30'}`,
      });

      // Add parent notification log for important statuses or sample today
      if (status !== 'H' || i === 0) {
        const statusText =
          status === 'H'
            ? 'HADIR tepat waktu'
            : status === 'T'
            ? 'TERLAMBAT'
            : status === 'S'
            ? 'SAKIT'
            : status === 'I'
            ? 'IZIN'
            : 'ALPA (Tanpa Keterangan)';

        const msg = `Yth. Bpk/Ibu Wali dari ${student.name} (Kelas X RPL 1). Kami informasikan bahwa ananda tercatat ${statusText} di SMK Taruna Bhakti Kadugede pada ${dateStr} pukul ${checkInTime}. Terima kasih.`;

        notificationLogs.push({
          id: `notif-${recId}`,
          studentId: student.id,
          studentName: student.name,
          className: student.classId === 'c-x-rpl-1' ? 'X RPL 1' : 'X RPL 2',
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          status,
          date: dateStr,
          time: checkInTime !== '-' ? checkInTime : '07:35',
          message: msg,
          sentVia: 'WhatsApp',
          deliveryStatus: status === 'A' ? 'delivered' : 'read',
        });
      }
    });

    // Seed teacher attendance
    INITIAL_TEACHERS.forEach((teacher, tIdx) => {
      const tRand = (tIdx * 11 + i * 5) % 100;
      let tStatus: 'H' | 'S' | 'I' | 'A' | 'Dinas' | 'Cuti' = 'H';
      let checkInTime = '06:30';
      let journal = `Mengajar materi modul pertemuan ${14 - i}`;

      if (tRand >= 95) {
        tStatus = 'Dinas';
        checkInTime = '07:00';
        journal = 'Workshop Kurikulum Merdeka di Cadisdik Wilayah X';
      } else if (tRand >= 92) {
        tStatus = 'S';
        checkInTime = '-';
        journal = 'Izin istirahat sakit';
      } else if (tRand >= 88) {
        tStatus = 'I';
        checkInTime = '-';
        journal = 'Izin urusan keluarga';
      } else {
        const m = 20 + ((tIdx * 4) % 30);
        checkInTime = `06:${m.toString().padStart(2, '0')}`;
      }

      teacherAttendance.push({
        id: `t-att-${dateStr}-${teacher.id}`,
        teacherId: teacher.id,
        date: dateStr,
        status: tStatus,
        checkInTime,
        checkOutTime: tStatus === 'H' ? '15:30' : undefined,
        teachingJournal: journal,
      });
    });
  }

  return { studentAttendance, teacherAttendance, notificationLogs };
};

export const INITIAL_ADMIN_USER: AdminUser = {
  id: 'adm-01',
  username: 'admin',
  email: 'arsiptb80@gmail.com',
  fullName: 'Administrator Sistem Absensi',
  role: 'Administrator Utama',
  lastLogin: '2026-09-29 07:15 WIB',
};
