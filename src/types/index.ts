export type AttendanceStatus = 'H' | 'S' | 'I' | 'A' | 'T';
// H: Hadir, S: Sakit, I: Izin, A: Alpa (Tanpa Keterangan), T: Terlambat

export type TeacherAttendanceStatus = 'H' | 'S' | 'I' | 'A' | 'Dinas' | 'Cuti';

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  avatar?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: 'X' | 'XI' | 'XII';
  major: 'RPL' | 'TKJ' | 'TKRO' | 'BD';
  academicYear: string;
  homeroomTeacher: string;
  totalStudents: number;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  gender: 'L' | 'P';
  subject: string;
  phone: string;
  email: string;
  isPiketToday?: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime: string; // HH:mm
  notes?: string;
  notifiedParent: boolean;
  notificationStatus?: 'sent' | 'pending' | 'failed';
  notifiedAt?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  status: TeacherAttendanceStatus;
  checkInTime: string;
  checkOutTime?: string;
  teachingJournal?: string;
  notes?: string;
}

export interface ParentNotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  status: AttendanceStatus;
  date: string;
  time: string;
  message: string;
  sentVia: 'WhatsApp' | 'SMS';
  deliveryStatus: 'delivered' | 'read' | 'queued';
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  website: string;
  principalName: string;
  principalNip: string;
  vicePrincipalName: string;
  vicePrincipalNip: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Administrator Utama' | 'Admin Kesiswaan' | 'Petugas Piket';
  avatar?: string;
  lastLogin: string;
}
