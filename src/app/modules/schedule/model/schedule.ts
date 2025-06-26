export const timeSlots = [
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
  '12:00 AM',
];

export const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// Schedule interface to ensure proper typing
export interface Schedule {
  id?: string | number;
  class_name: string;
  faculty?: string;
  faculty_name?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_code?: string;
  course?: string;
  year?: number;
  section?: string;
  laboratory_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Form interface for creating/editing schedules
export interface ScheduleForm {
  class_name: string;
  faculty: string | null;
  day_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  course_code: string;
  course: string;
  year: number | null;
  section: string;
}
