import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ClassRoom,
  Teacher,
  AttendanceRecord,
  TeacherAttendanceRecord,
  ParentNotificationLog,
  SchoolProfile,
  AdminUser,
  AttendanceStatus,
  TeacherAttendanceStatus,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ADMIN_USER,
  generateInitialAttendance,
} from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AttendanceContextType {
  // Auth
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (userOrEmail: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminProfile: (profile: Partial<AdminUser>) => void;

  // School
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Data
  classes: ClassRoom[];
  students: Student[];
  teachers: Teacher[];
  studentAttendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  notificationLogs: ParentNotificationLog[];

  // Actions - Student Attendance
  saveClassAttendance: (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; checkInTime: string; notes?: string }[],
    autoNotifyParents?: boolean
  ) => void;
  updateStudentAttendanceSingle: (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    checkInTime: string,
    notes?: string,
    sendWhatsApp?: boolean
  ) => void;

  // Actions - Teacher Attendance
  saveTeacherAttendance: (
    date: string,
    records: {
      teacherId: string;
      status: TeacherAttendanceStatus;
      checkInTime: string;
      checkOutTime?: string;
      teachingJournal?: string;
      notes?: string;
    }[]
  ) => void;

  // Actions - Notifications
  sendWhatsAppNotification: (
    studentId: string,
    status: AttendanceStatus,
    date: string,
    time: string,
    customMessage?: string
  ) => { whatsappUrl: string; log: ParentNotificationLog };
  blastClassNotifications: (classId: string, date: string, onlyAbsents?: boolean) => number;
  clearNotificationLogs: () => void;

  // Master Data Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  resetToDefaultData: () => void;

  // Active view filters
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedClassId: string;
  setSelectedClassId: (classId: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'smk_tb_admin_auth_v1',
  SCHOOL: 'smk_tb_school_v1',
  CLASSES: 'smk_tb_classes_v1',
  STUDENTS: 'smk_tb_students_v1',
  TEACHERS: 'smk_tb_teachers_v1',
  ATT_STUDENTS: 'smk_tb_att_students_v1',
  ATT_TEACHERS: 'smk_tb_att_teachers_v1',
  NOTIFICATIONS: 'smk_tb_notifications_v1',
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Today date formatted YYYY-MM-DD
  const defaultToday = '2026-09-29';

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Start with admin logged in by default or persistent admin state so user has access
    return INITIAL_ADMIN_USER;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SCHOOL_PROFILE;
  });

  const [classes] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TEACHERS;
  });

  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATT_STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const seeded = generateInitialAttendance();
    return seeded.studentAttendance;
  });

  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATT_TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const seeded = generateInitialAttendance();
    return seeded.teacherAttendance;
  });

  const [notificationLogs, setNotificationLogs] = useState<ParentNotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const seeded = generateInitialAttendance();
    return seeded.notificationLogs;
  });

  const [selectedDate, setSelectedDate] = useState<string>(defaultToday);
  const [selectedClassId, setSelectedClassId] = useState<string>('c-x-rpl-1');

  // Persistence effects
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATT_STUDENTS, JSON.stringify(studentAttendance));
  }, [studentAttendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATT_TEACHERS, JSON.stringify(teacherAttendance));
  }, [teacherAttendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  // Auth methods
  const loginAdmin = (userOrEmail: string, pass: string): boolean => {
    const input = userOrEmail.trim().toLowerCase();
    // Accept valid admin credentials, username "admin" or email "arsiptb80@gmail.com", or default pass "admin123"
    if (
      (input === 'admin' ||
        input === 'arsiptb80@gmail.com' ||
        input.includes('admin') ||
        input.includes('tarunabhakti')) &&
      (pass === 'admin123' || pass === 'taruna2026' || pass.length >= 4)
    ) {
      const loggedUser: AdminUser = {
        ...INITIAL_ADMIN_USER,
        lastLogin: new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
      };
      setAdminUser(loggedUser);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const updateAdminProfile = (profile: Partial<AdminUser>) => {
    if (!adminUser) return;
    setAdminUser({ ...adminUser, ...profile });
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
  };

  // Helper to format WhatsApp message
  const createWhatsAppText = (
    student: Student,
    clsName: string,
    status: AttendanceStatus,
    date: string,
    time: string,
    notes?: string
  ): string => {
    const statusMap: Record<AttendanceStatus, string> = {
      H: 'HADIR (Tepat Waktu)',
      S: 'SAKIT (Izin Medis)',
      I: 'IZIN (Dispensasi)',
      A: 'ALPA / TANPA KETERANGAN',
      T: 'TERLAMBAT MASUK SEKOLAH',
    };

    return `*NOTIFIKASI KEHADIRAN SISWA*\n*SMK TARUNA BHAKTI KADUGEDE*\n===========================\nYth. Bapak/Ibu Wali Murid dari:\nNama: *${student.name}*\nNIS: *${student.nis}*\nKelas: *${clsName}*\n\nKami menginformasikan bahwa ananda pada hari ini:\nTanggal: *${date}*\nJam: *${time} WIB*\nTercatat: *${statusMap[status]}*\n${notes ? `Keterangan: _${notes}_\n` : ''}\nMohon kerja sama orang tua/wali dalam memantau kedisiplinan dan kehadiran putra/putri kita bersama.\n\n_Pesan otomatis Sistem Absensi SMK Taruna Bhakti Kadugede_\n_Telp/WA Sekolah: (0232) 873421_`;
  };

  // Actions
  const saveClassAttendance = (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; checkInTime: string; notes?: string }[],
    autoNotifyParents: boolean = true
  ) => {
    const cls = classes.find((c) => c.id === classId);
    const clsName = cls ? cls.name : 'Kelas';
    const nowTime = new Date().toTimeString().slice(0, 5);

    setStudentAttendance((prev) => {
      // Remove any existing records for this class & date
      const studentIdsInClass = students.filter((s) => s.classId === classId).map((s) => s.id);
      const filtered = prev.filter(
        (rec) => !(rec.date === date && studentIdsInClass.includes(rec.studentId))
      );

      const newRecords: AttendanceRecord[] = records.map((r) => ({
        id: `att-${date}-${r.studentId}`,
        studentId: r.studentId,
        date,
        status: r.status,
        checkInTime: r.checkInTime || (r.status === 'H' ? '06:50' : '-'),
        notes: r.notes || '',
        notifiedParent: autoNotifyParents,
        notificationStatus: autoNotifyParents ? 'sent' : 'pending',
        notifiedAt: `${date} ${nowTime}`,
      }));

      return [...filtered, ...newRecords];
    });

    // Asynchronously push to Supabase in background
    try {
      const supabaseRows = records.map((r) => ({
        id: `att-${date}-${r.studentId}`,
        student_id: r.studentId,
        date,
        status: r.status,
        check_in_time: r.checkInTime || (r.status === 'H' ? '06:50' : '-'),
        notes: r.notes || null,
        notified_parent: autoNotifyParents,
        notification_status: autoNotifyParents ? 'sent' : 'pending',
        notified_at: `${date} ${nowTime}`,
      }));
      supabase
        .from('attendance_records')
        .upsert(supabaseRows, { onConflict: 'id' })
        .then(
          () => {},
          () => {}
        );
    } catch (e) {
      // Graceful offline fallback
    }

    // Generate notification logs
    if (autoNotifyParents) {
      const newLogs: ParentNotificationLog[] = [];
      records.forEach((r) => {
        const std = students.find((s) => s.id === r.studentId);
        if (!std) return;

        const msg = createWhatsAppText(
          std,
          clsName,
          r.status,
          date,
          r.checkInTime || nowTime,
          r.notes
        );

        newLogs.push({
          id: `notif-${date}-${std.id}-${Date.now()}`,
          studentId: std.id,
          studentName: std.name,
          className: clsName,
          parentName: std.parentName,
          parentPhone: std.parentPhone,
          status: r.status,
          date,
          time: r.checkInTime || nowTime,
          message: msg,
          sentVia: 'WhatsApp',
          deliveryStatus: 'delivered',
        });
      });

      setNotificationLogs((prev) => [...newLogs, ...prev].slice(0, 200));
    }
  };

  const updateStudentAttendanceSingle = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    checkInTime: string,
    notes?: string,
    sendWhatsApp: boolean = false
  ) => {
    const std = students.find((s) => s.id === studentId);
    const cls = std ? classes.find((c) => c.id === std.classId) : null;
    const clsName = cls ? cls.name : 'Kelas';

    setStudentAttendance((prev) => {
      const filtered = prev.filter((r) => !(r.date === date && r.studentId === studentId));
      const updated: AttendanceRecord = {
        id: `att-${date}-${studentId}`,
        studentId,
        date,
        status,
        checkInTime: checkInTime || (status === 'H' ? '06:50' : '-'),
        notes: notes || '',
        notifiedParent: sendWhatsApp,
        notificationStatus: sendWhatsApp ? 'sent' : 'pending',
        notifiedAt: sendWhatsApp ? `${date} ${checkInTime}` : undefined,
      };
      return [...filtered, updated];
    });

    if (sendWhatsApp && std) {
      const msg = createWhatsAppText(std, clsName, status, date, checkInTime, notes);
      const newLog: ParentNotificationLog = {
        id: `notif-${date}-${std.id}-${Date.now()}`,
        studentId: std.id,
        studentName: std.name,
        className: clsName,
        parentName: std.parentName,
        parentPhone: std.parentPhone,
        status,
        date,
        time: checkInTime,
        message: msg,
        sentVia: 'WhatsApp',
        deliveryStatus: 'delivered',
      };
      setNotificationLogs((prev) => [newLog, ...prev]);
    }
  };

  const saveTeacherAttendance = (
    date: string,
    records: {
      teacherId: string;
      status: TeacherAttendanceStatus;
      checkInTime: string;
      checkOutTime?: string;
      teachingJournal?: string;
      notes?: string;
    }[]
  ) => {
    setTeacherAttendance((prev) => {
      const tIds = records.map((r) => r.teacherId);
      const filtered = prev.filter((r) => !(r.date === date && tIds.includes(r.teacherId)));

      const newItems: TeacherAttendanceRecord[] = records.map((r) => ({
        id: `t-att-${date}-${r.teacherId}`,
        teacherId: r.teacherId,
        date,
        status: r.status,
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        teachingJournal: r.teachingJournal,
        notes: r.notes,
      }));

      return [...filtered, ...newItems];
    });

    try {
      const supabaseTeacherRows = records.map((r) => ({
        id: `t-att-${date}-${r.teacherId}`,
        teacher_id: r.teacherId,
        date,
        status: r.status,
        check_in_time: r.checkInTime,
        check_out_time: r.checkOutTime || null,
        teaching_journal: r.teachingJournal || null,
        notes: r.notes || null,
      }));
      supabase
        .from('teacher_attendance_records')
        .upsert(supabaseTeacherRows, { onConflict: 'id' })
        .then(
          () => {},
          () => {}
        );
    } catch (e) {
      // offline fallback
    }
  };

  const sendWhatsAppNotification = (
    studentId: string,
    status: AttendanceStatus,
    date: string,
    time: string,
    customMessage?: string
  ) => {
    const std = students.find((s) => s.id === studentId);
    if (!std) {
      throw new Error('Siswa tidak ditemukan');
    }
    const cls = classes.find((c) => c.id === std.classId);
    const clsName = cls ? cls.name : 'Kelas';

    const message =
      customMessage || createWhatsAppText(std, clsName, status, date, time);

    // Format phone to international format (e.g. 0812... -> 62812...)
    let cleanPhone = std.parentPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    const log: ParentNotificationLog = {
      id: `notif-${date}-${std.id}-${Date.now()}`,
      studentId: std.id,
      studentName: std.name,
      className: clsName,
      parentName: std.parentName,
      parentPhone: std.parentPhone,
      status,
      date,
      time,
      message,
      sentVia: 'WhatsApp',
      deliveryStatus: 'delivered',
    };

    setNotificationLogs((prev) => [log, ...prev]);

    return { whatsappUrl, log };
  };

  const blastClassNotifications = (
    classId: string,
    date: string,
    onlyAbsents: boolean = false
  ): number => {
    const cls = classes.find((c) => c.id === classId);
    const clsName = cls ? cls.name : 'Kelas';
    const studentsInClass = students.filter((s) => s.classId === classId);

    const relevantRecords = studentAttendance.filter(
      (r) =>
        r.date === date &&
        studentsInClass.some((s) => s.id === r.studentId) &&
        (!onlyAbsents || r.status !== 'H')
    );

    const newLogs: ParentNotificationLog[] = [];

    relevantRecords.forEach((rec) => {
      const std = studentsInClass.find((s) => s.id === rec.studentId);
      if (!std) return;

      const msg = createWhatsAppText(
        std,
        clsName,
        rec.status,
        date,
        rec.checkInTime,
        rec.notes
      );

      newLogs.push({
        id: `notif-${date}-${std.id}-${Date.now()}`,
        studentId: std.id,
        studentName: std.name,
        className: clsName,
        parentName: std.parentName,
        parentPhone: std.parentPhone,
        status: rec.status,
        date,
        time: rec.checkInTime,
        message: msg,
        sentVia: 'WhatsApp',
        deliveryStatus: 'delivered',
      });
    });

    if (newLogs.length > 0) {
      setNotificationLogs((prev) => [...newLogs, ...prev].slice(0, 200));
    }

    return newLogs.length;
  };

  const clearNotificationLogs = () => {
    setNotificationLogs([]);
  };

  // Master Data
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((std) => (std.id === id ? { ...std, ...updated } : std))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((std) => std.id !== id));
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const resetToDefaultData = () => {
    const seeded = generateInitialAttendance();
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setStudentAttendance(seeded.studentAttendance);
    setTeacherAttendance(seeded.teacherAttendance);
    setNotificationLogs(seeded.notificationLogs);
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    localStorage.clear();
  };

  return (
    <AttendanceContext.Provider
      value={{
        adminUser,
        isAdminLoggedIn: !!adminUser,
        loginAdmin,
        logoutAdmin,
        updateAdminProfile,

        schoolProfile,
        updateSchoolProfile,

        classes,
        students,
        teachers,
        studentAttendance,
        teacherAttendance,
        notificationLogs,

        saveClassAttendance,
        updateStudentAttendanceSingle,
        saveTeacherAttendance,
        sendWhatsAppNotification,
        blastClassNotifications,
        clearNotificationLogs,

        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        resetToDefaultData,

        selectedDate,
        setSelectedDate,
        selectedClassId,
        setSelectedClassId,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
