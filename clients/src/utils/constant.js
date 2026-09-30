export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

export const GRADE_TYPES = [
  { value: 'devoir', label: 'Devoir' },
  { value: 'examen', label: 'Examen' },
  { value: 'interrogation', label: 'Interrogation' },
  { value: 'tp', label: 'Travaux pratiques' },
];

export const PAYMENT_STATUS = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'overdue', label: 'En retard' },
  { value: 'cancelled', label: 'Annulé' },
];

export const ATTENDANCE_STATUS = [
  { value: 'present', label: 'Présent' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Retard' },
  { value: 'excused', label: 'Excusé' },
];