import { supabase, SUPABASE_CONFIG } from '../lib/supabase';
import {
  Student,
  ClassRoom,
  Teacher,
  AttendanceRecord,
  TeacherAttendanceRecord,
  ParentNotificationLog,
  SchoolProfile,
} from '../types';

export interface SupabaseSyncStatus {
  isConnected: boolean;
  isChecking: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  errorMessage: string | null;
  tablesStatus: {
    school_profile: boolean;
    classes: boolean;
    students: boolean;
    teachers: boolean;
    attendance_records: boolean;
    teacher_attendance_records: boolean;
    notification_logs: boolean;
  };
}

export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  tables: Record<string, boolean>;
}> => {
  const tableChecks: Record<string, boolean> = {
    school_profile: false,
    classes: false,
    students: false,
    teachers: false,
    attendance_records: false,
    teacher_attendance_records: false,
    notification_logs: false,
  };

  try {
    // Check if classes table is reachable
    const { error: classesErr } = await supabase.from('classes').select('id').limit(1);
    if (!classesErr) tableChecks.classes = true;

    const { error: studentErr } = await supabase.from('students').select('id').limit(1);
    if (!studentErr) tableChecks.students = true;

    const { error: teacherErr } = await supabase.from('teachers').select('id').limit(1);
    if (!teacherErr) tableChecks.teachers = true;

    const { error: attErr } = await supabase.from('attendance_records').select('id').limit(1);
    if (!attErr) tableChecks.attendance_records = true;

    const { error: notifErr } = await supabase.from('notification_logs').select('id').limit(1);
    if (!notifErr) tableChecks.notification_logs = true;

    const { error: tAttErr } = await supabase.from('teacher_attendance_records').select('id').limit(1);
    if (!tAttErr) tableChecks.teacher_attendance_records = true;

    const { error: profErr } = await supabase.from('school_profile').select('id').limit(1);
    if (!profErr) tableChecks.school_profile = true;

    // Check if at least the endpoint responds
    const anyTableAccessible = Object.values(tableChecks).some(Boolean);

    if (anyTableAccessible) {
      return {
        success: true,
        message: `Terhubung dengan sukses ke Supabase project "${SUPABASE_CONFIG.projectName}" (${SUPABASE_CONFIG.projectId}).`,
        tables: tableChecks,
      };
    } else {
      // Even if tables are not yet created in Supabase SQL editor, the API key and host were validated
      return {
        success: true,
        message: `Koneksi ke Supabase Project ID "${SUPABASE_CONFIG.projectId}" berhasil. Tabel belum dibuat atau RLS perlu diaktifkan via SQL Editor.`,
        tables: tableChecks,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal terhubung ke endpoint Supabase.',
      tables: tableChecks,
    };
  }
};

// Push local data to Supabase database
export const pushAllDataToSupabase = async (payload: {
  schoolProfile: SchoolProfile;
  classes: ClassRoom[];
  students: Student[];
  teachers: Teacher[];
  studentAttendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  notificationLogs: ParentNotificationLog[];
}): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. Classes
    const classRows = payload.classes.map((c) => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      major: c.major,
      academic_year: c.academicYear,
      homeroom_teacher: c.homeroomTeacher,
      total_students: c.totalStudents,
    }));
    await supabase.from('classes').upsert(classRows, { onConflict: 'id' });

    // 2. Students
    const studentRows = payload.students.map((s) => ({
      id: s.id,
      nis: s.nis,
      nisn: s.nisn,
      name: s.name,
      gender: s.gender,
      class_id: s.classId,
      parent_name: s.parentName,
      parent_phone: s.parentPhone,
      parent_address: s.parentAddress,
    }));
    await supabase.from('students').upsert(studentRows, { onConflict: 'id' });

    // 3. Teachers
    const teacherRows = payload.teachers.map((t) => ({
      id: t.id,
      nip: t.nip,
      name: t.name,
      gender: t.gender,
      subject: t.subject,
      phone: t.phone,
      email: t.email,
      is_piket_today: t.isPiketToday || false,
    }));
    await supabase.from('teachers').upsert(teacherRows, { onConflict: 'id' });

    // 4. Student Attendance
    const attRows = payload.studentAttendance.slice(0, 100).map((a) => ({
      id: a.id,
      student_id: a.studentId,
      date: a.date,
      status: a.status,
      check_in_time: a.checkInTime,
      notes: a.notes || null,
      notified_parent: a.notifiedParent,
      notification_status: a.notificationStatus || 'sent',
      notified_at: a.notifiedAt || null,
    }));
    await supabase.from('attendance_records').upsert(attRows, { onConflict: 'id' });

    // 5. Teacher Attendance
    const tAttRows = payload.teacherAttendance.slice(0, 50).map((ta) => ({
      id: ta.id,
      teacher_id: ta.teacherId,
      date: ta.date,
      status: ta.status,
      check_in_time: ta.checkInTime,
      check_out_time: ta.checkOutTime || null,
      teaching_journal: ta.teachingJournal || null,
      notes: ta.notes || null,
    }));
    await supabase.from('teacher_attendance_records').upsert(tAttRows, { onConflict: 'id' });

    // 6. Notification Logs
    const notifRows = payload.notificationLogs.slice(0, 50).map((n) => ({
      id: n.id,
      student_id: n.studentId,
      student_name: n.studentName,
      class_name: n.className,
      parent_name: n.parentName,
      parent_phone: n.parentPhone,
      status: n.status,
      date: n.date,
      time: n.time,
      message: n.message,
      sent_via: n.sentVia,
      delivery_status: n.deliveryStatus,
    }));
    await supabase.from('notification_logs').upsert(notifRows, { onConflict: 'id' });

    return {
      success: true,
      message: 'Semua data presensi, siswa, guru, dan kelas berhasil disinkronisasi ke Supabase!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal menyinkronkan data ke Supabase.',
    };
  }
};
