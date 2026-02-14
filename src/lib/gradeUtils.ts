// Zambia Examination Council (ECZ) Grading System
// Points: 1 (highest) to 9 (lowest/fail)

export function calculateGrade(marks: number, maxMarks: number = 100): string {
  const percentage = (marks / maxMarks) * 100;
  
  if (percentage >= 75) return '1';
  if (percentage >= 65) return '2';
  if (percentage >= 55) return '3';
  if (percentage >= 45) return '4';
  if (percentage >= 40) return '5';
  if (percentage >= 35) return '6';
  if (percentage >= 30) return '7';
  if (percentage >= 25) return '8';
  return '9';
}

export function getGradePoints(grade: string): number {
  const point = parseInt(grade, 10);
  return isNaN(point) ? 9 : point;
}

export function getGradeRemarks(grade: string): string {
  switch (grade) {
    case '1': return 'Distinction';
    case '2': return 'Merit';
    case '3': return 'Credit';
    case '4': return 'Credit';
    case '5': return 'Credit';
    case '6': return 'Pass';
    case '7': return 'Pass';
    case '8': return 'Pass';
    case '9': return 'Fail';
    default: return '';
  }
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case '1': return 'bg-emerald-500 text-white';
    case '2': return 'bg-emerald-400 text-white';
    case '3': return 'bg-blue-500 text-white';
    case '4': return 'bg-blue-400 text-white';
    case '5': return 'bg-sky-400 text-white';
    case '6': return 'bg-amber-400 text-white';
    case '7': return 'bg-orange-400 text-white';
    case '8': return 'bg-orange-500 text-white';
    case '9': return 'bg-red-500 text-white';
    default: return 'bg-muted';
  }
}

export function calculateAverage(marks: number[], maxMarks: number = 100): number {
  if (marks.length === 0) return 0;
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  return Math.round((total / marks.length) * 10) / 10;
}

export function calculateTotal(marks: number[]): number {
  return marks.reduce((sum, mark) => sum + mark, 0);
}

export function generateStudentId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${random}`;
}

// Calculate best 6 points including mandatory Math and English
export interface SubjectResult {
  subjectId: string;
  subjectName: string;
  marks: number;
  caMarks: number;
  examMarks: number;
  grade: string;
  points: number;
  remarks: string;
  isCompulsory: boolean;
  includedInBest6: boolean;
}

export function calculateBest6Points(
  results: { subjectId: string; subjectName: string; marks: number; caMarks: number; examMarks: number; grade: string; remarks: string }[]
): { 
  resultsWithBest6: SubjectResult[];
  best6Points: number;
  mathPoints: number | null;
  englishPoints: number | null;
} {
  // Find Math and English results (compulsory)
  const mathResult = results.find(r => r.subjectId === 'math');
  const englishResult = results.find(r => r.subjectId === 'eng');
  
  // Get points for compulsory subjects
  const mathPoints = mathResult ? getGradePoints(mathResult.grade) : null;
  const englishPoints = englishResult ? getGradePoints(englishResult.grade) : null;
  
  // Get other subjects (excluding Math and English)
  const otherResults = results.filter(r => r.subjectId !== 'math' && r.subjectId !== 'eng');
  
  // Sort other subjects by points (ascending - lower is better)
  const sortedOthers = [...otherResults].sort((a, b) => 
    getGradePoints(a.grade) - getGradePoints(b.grade)
  );
  
  // Take best 4 from other subjects (since Math and English are compulsory = 2)
  const best4Others = sortedOthers.slice(0, 4);
  const best4OtherIds = new Set(best4Others.map(r => r.subjectId));
  
  // Calculate total points for best 6
  let best6Points = 0;
  if (mathPoints !== null) best6Points += mathPoints;
  if (englishPoints !== null) best6Points += englishPoints;
  best6Points += best4Others.reduce((sum, r) => sum + getGradePoints(r.grade), 0);
  
  // Mark which subjects are included in best 6
  const resultsWithBest6: SubjectResult[] = results.map(r => ({
    ...r,
    points: getGradePoints(r.grade),
    isCompulsory: r.subjectId === 'math' || r.subjectId === 'eng',
    includedInBest6: r.subjectId === 'math' || r.subjectId === 'eng' || best4OtherIds.has(r.subjectId),
  }));
  
  return {
    resultsWithBest6,
    best6Points,
    mathPoints,
    englishPoints,
  };
}
