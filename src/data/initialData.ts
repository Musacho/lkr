import { Subject, Student, Mark } from '@/types';

export const coreSubjects: Subject[] = [
  { id: 'math', name: 'Mathematics', isCore: true, maxMarks: 100 },
  { id: 'eng', name: 'English Language', isCore: true, maxMarks: 100 },
  { id: 'sci', name: 'Science', isCore: true, maxMarks: 100 },
  { id: 'soc', name: 'Social Studies', isCore: true, maxMarks: 100 },
  { id: 'life', name: 'Life Skills', isCore: true, maxMarks: 100 },
];

export const optionalSubjects: Subject[] = [
  { id: 'comp', name: 'Computer Studies', isCore: false, maxMarks: 100 },
  { id: 'art', name: 'Art & Design', isCore: false, maxMarks: 100 },
  { id: 'agri', name: 'Agriculture', isCore: false, maxMarks: 100 },
  { id: 'music', name: 'Music', isCore: false, maxMarks: 100 },
  { id: 'french', name: 'French', isCore: false, maxMarks: 100 },
  { id: 'pe', name: 'Physical Education', isCore: false, maxMarks: 100 },
];

export const allSubjects = [...coreSubjects, ...optionalSubjects];

export const initialStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Mwangi',
    studentId: 'STU24001',
    grade: '8',
    stream: 'A',
    optionalSubjects: ['comp', 'french'],
    guardianName: 'Mary Mwangi',
    guardianPhone: '+254 712 345 678',
  },
  {
    id: '2',
    firstName: 'Grace',
    lastName: 'Ochieng',
    studentId: 'STU24002',
    grade: '8',
    stream: 'A',
    optionalSubjects: ['art', 'music'],
    guardianName: 'Peter Ochieng',
    guardianPhone: '+254 723 456 789',
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Kamau',
    studentId: 'STU24003',
    grade: '8',
    stream: 'B',
    optionalSubjects: ['agri', 'pe'],
    guardianName: 'Jane Kamau',
    guardianPhone: '+254 734 567 890',
  },
  {
    id: '4',
    firstName: 'Faith',
    lastName: 'Wanjiku',
    studentId: 'STU24004',
    grade: '8',
    stream: 'B',
    optionalSubjects: ['comp', 'art'],
    guardianName: 'Samuel Wanjiku',
    guardianPhone: '+254 745 678 901',
  },
  {
    id: '5',
    firstName: 'Brian',
    lastName: 'Kiprop',
    studentId: 'STU24005',
    grade: '7',
    stream: 'A',
    optionalSubjects: ['music', 'french'],
    guardianName: 'Elizabeth Kiprop',
    guardianPhone: '+254 756 789 012',
  },
];

export const initialMarks: Mark[] = [
  { studentId: '1', subjectId: 'math', marks: 85, caMarks: 85, examMarks: 85, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'eng', marks: 78, caMarks: 80, examMarks: 78, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'sci', marks: 92, caMarks: 90, examMarks: 93, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'soc', marks: 74, caMarks: 70, examMarks: 75, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'life', marks: 88, caMarks: 85, examMarks: 89, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'comp', marks: 95, caMarks: 95, examMarks: 95, term: 'Term 1', year: 2024 },
  { studentId: '1', subjectId: 'french', marks: 72, caMarks: 75, examMarks: 71, term: 'Term 1', year: 2024 },
  
  { studentId: '2', subjectId: 'math', marks: 76, caMarks: 80, examMarks: 75, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'eng', marks: 89, caMarks: 90, examMarks: 89, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'sci', marks: 82, caMarks: 85, examMarks: 81, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'soc', marks: 91, caMarks: 90, examMarks: 91, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'life', marks: 85, caMarks: 88, examMarks: 84, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'art', marks: 96, caMarks: 95, examMarks: 96, term: 'Term 1', year: 2024 },
  { studentId: '2', subjectId: 'music', marks: 88, caMarks: 90, examMarks: 88, term: 'Term 1', year: 2024 },
  
  { studentId: '3', subjectId: 'math', marks: 68, caMarks: 70, examMarks: 68, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'eng', marks: 72, caMarks: 75, examMarks: 71, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'sci', marks: 75, caMarks: 78, examMarks: 74, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'soc', marks: 79, caMarks: 80, examMarks: 79, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'life', marks: 82, caMarks: 85, examMarks: 81, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'agri', marks: 90, caMarks: 88, examMarks: 91, term: 'Term 1', year: 2024 },
  { studentId: '3', subjectId: 'pe', marks: 94, caMarks: 95, examMarks: 94, term: 'Term 1', year: 2024 },
  
  { studentId: '4', subjectId: 'math', marks: 88, caMarks: 90, examMarks: 88, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'eng', marks: 84, caMarks: 85, examMarks: 84, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'sci', marks: 79, caMarks: 80, examMarks: 79, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'soc', marks: 86, caMarks: 88, examMarks: 86, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'life', marks: 91, caMarks: 90, examMarks: 91, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'comp', marks: 87, caMarks: 85, examMarks: 88, term: 'Term 1', year: 2024 },
  { studentId: '4', subjectId: 'art', marks: 93, caMarks: 95, examMarks: 93, term: 'Term 1', year: 2024 },
];

export const schoolInfo = {
  name: 'Lake Road P.T.A School',
  address: 'P.O. Box 320042, Lusaka, Zambia',
  phone: '+260 211 263901.',
  email: 'lakeroad@lrptas.ac.zm',
  motto: 'Education for Empowerment',
};
