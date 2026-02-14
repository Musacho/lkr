export type Grade = 'FORM 1' | 'FORM 2' | 'FORM 3' | 'FORM 4' | '10' | '11' | '12';
export type Stream = 'ONE' | 'TWO' | 'THREE' | 'A' | 'B' | 'C';

export interface Subject {
  id: string;
  name: string;
  isCore: boolean;
  maxMarks: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  grade: Grade;
  stream: Stream;
  optionalSubjects: string[];
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface Mark {
  studentId: string;
  subjectId: string;
  marks: number;
  caMarks: number;
  examMarks: number;
  term: string;
  year: number;
}

export interface CalculatedResult {
  subject: Subject;
  marks: number;
  grade: string;
  remarks: string;
}

export interface ReportCard {
  student: Student;
  results: CalculatedResult[];
  total: number;
  average: number;
  overallGrade: string;
  position: number;
  totalStudents: number;
  teacherComment: string;
  principalComment: string;
  term: string;
  year: number;
}

export interface ClassSummary {
  grade: Grade;
  stream: Stream;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  topStudents: { student: Student; average: number }[];
  subjectAverages: { subject: Subject; average: number }[];
}
