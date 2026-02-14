import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Grade, Stream } from '@/types';
import { schoolInfo } from '@/data/initialData';

interface StudentResult {
  subjectId: string;
  subjectName: string;
  marks: number;
  caMarks: number;
  examMarks: number;
  grade: string;
  remarks: string;
  points: number;
  isCompulsory: boolean;
  includedInBest6: boolean;
}

interface StudentReportData {
  student: Student;
  results: StudentResult[];
  total: number;
  average: number;
  overallGrade: string;
  best6Points: number;
  mathPoints: number | null;
  englishPoints: number | null;
  position: number;
  totalStudents: number;
  term: string;
  year: number;
}

function generateSingleReport(doc: jsPDF, data: StudentReportData) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Logo
  doc.addImage('/logo/nqnm12h2.png', 'PNG', pageWidth / 2 - 17.5, yPos, 35, 35);
  yPos += 43;

  // Header - compact
  doc.setFontSize(25);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(schoolInfo.name, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${schoolInfo.address} | ${schoolInfo.phone}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`"${schoolInfo.motto}"`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;

  // Divider
  doc.setLineWidth(0.2);
  doc.line(10, yPos, pageWidth - 10, yPos);
  yPos += 6;

  // Report Title and Term - inline
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT REPORT CARD', 10, yPos);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.term} - ${data.year}`, pageWidth - 10, yPos, { align: 'right' });
  yPos += 2;

  // Student Info Box - horizontal layout
  doc.setFillColor(245, 245, 245);
  doc.rect(10, yPos, pageWidth - 20, 10, 'F');
  
  doc.setFontSize(11);
  const infoY = yPos + 6;
  const col1 = 12;
  const col2 = pageWidth * 0.32;
  const col3 = pageWidth * 0.55;
  const col4 = pageWidth * 0.78;
  
  doc.setTextColor(100);
  doc.text('Name:', col1, infoY);
  doc.text('ID:', col2, infoY);
  doc.text('Class:', col3, infoY);
  doc.text('Position:', col4, infoY);
  
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.student.firstName} ${data.student.lastName}`, col1 + 12, infoY);
  doc.text(data.student.studentId, col2 + 7, infoY);
  doc.text(`${data.student.grade} - ${data.student.stream}`, col3 + 12, infoY);
  doc.text(`${data.position} of ${data.totalStudents}`, col4 + 16, infoY);
  
  yPos += 13;

  // Results Table with CA and Exam columns
  const tableData = data.results.map(r => [
    r.isCompulsory ? `${r.subjectName} *` : r.subjectName,
    r.caMarks.toString(),
    r.examMarks.toString(),
    r.marks.toString(),
    r.grade,
    r.points.toString(),
    r.remarks
  ]);

  // Add totals row
  const totalCa = Math.round(data.results.reduce((sum, r) => sum + r.caMarks, 0) / data.results.length);
  const totalExam = Math.round(data.results.reduce((sum, r) => sum + r.examMarks, 0) / data.results.length);
  
  tableData.push([
    'Average / Total',
    `${totalCa}`,
    `${totalExam}`,
    `${data.average.toFixed(1)}%`,
    data.overallGrade,
    '',
    `Total: ${data.total}`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Subject', 'CA', 'Exam', 'Final', 'Grade', 'Points', 'Remarks']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11,
      cellPadding: 1
    },
    bodyStyles: {
      fontSize: 11,
      cellPadding: 1
    },
    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 24},
      2: { cellWidth: 24}, 
      3: { cellWidth: 24},
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 'auto' }
    },
    margin: { left: 10, right: 10 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 4;

  // Best 6 Points Summary - compact horizontal
  const summaryBoxWidth = (pageWidth - 20) / 3;
  doc.setFillColor(230, 240, 250);
  doc.rect(10, yPos, pageWidth - 20, 12, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text('Best 6 Points', 10 + summaryBoxWidth / 2, yPos + 4, { align: 'center' });
  doc.text('Mathematics', 10 + summaryBoxWidth + summaryBoxWidth / 2, yPos + 4, { align: 'center' });
  doc.text('English', 10 + 2 * summaryBoxWidth + summaryBoxWidth / 2, yPos + 4, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(41, 128, 185);
  doc.setFont('helvetica', 'bold');
  doc.text(data.best6Points.toString(), 10 + summaryBoxWidth / 2, yPos + 9, { align: 'center' });
  
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`${data.mathPoints ?? '-'} pts`, 10 + summaryBoxWidth + summaryBoxWidth / 2, yPos + 9, { align: 'center' });
  doc.text(`${data.englishPoints ?? '-'} pts`, 10 + 2 * summaryBoxWidth + summaryBoxWidth / 2, yPos + 9, { align: 'center' });
  
  yPos += 18;

  // ECZ Note - tiny
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('* Compulsory (Math & English). CA=20%, Exam=80%. Points: 1=Distinction to 9=Fail.', 10, yPos);
  yPos += 6;

  // Comments - compact side by side
  const getComment = (avg: number) => {
    if (avg >= 80) return 'Exceptional performance! Keep up the excellent work.';
    if (avg >= 70) return 'Very good performance. Continue working hard.';
    if (avg >= 60) return 'Good effort. There is room for improvement.';
    if (avg >= 50) return 'Satisfactory. More dedication is needed.';
    return 'Needs significant improvement. Please consult with teachers.';
  };

  const getPrincipalComment = (avg: number) => {
    if (avg >= 70) return 'Congratulations on your achievements.';
    return 'Strive for excellence in all endeavors.';
  };

  const commentWidth = (pageWidth - 25) / 2;
  
  // Class Teacher Comment
  doc.setDrawColor(200);
  doc.rect(10, yPos, commentWidth, 14);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Class Teacher's Comment:", 12, yPos + 4);
  doc.setTextColor(0);
  doc.setFontSize(10);
  const teacherComment = getComment(data.average);
  const teacherLines = doc.splitTextToSize(teacherComment, commentWidth - 4);
  doc.text(teacherLines, 12, yPos + 8);

  // Principal Comment
  doc.rect(15 + commentWidth, yPos, commentWidth, 14);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Head Teacher's Comment:", 17 + commentWidth, yPos + 4);
  doc.setTextColor(0);
  doc.setFontSize(10);
  const principalComment = getPrincipalComment(data.average);
  const principalLines = doc.splitTextToSize(principalComment, commentWidth - 4);
  doc.text(principalLines, 17 + commentWidth, yPos + 8);
  
  yPos += 17;

  // Signatures - at bottom
  const sigY = Math.min(yPos + 5, pageHeight - 18);
  doc.setLineWidth(0.2);
  const sigWidth = 40;
  const sigGap = (pageWidth - 20 - 3 * sigWidth) / 2;
  
  doc.line(10, sigY, 10 + sigWidth, sigY);
  doc.line(10 + sigWidth + sigGap, sigY, 10 + 2 * sigWidth + sigGap, sigY);
  doc.line(10 + 2 * (sigWidth + sigGap), sigY, 10 + 3 * sigWidth + 2 * sigGap, sigY);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text('Class Teacher', 10 + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.text('Head Teacher', 10 + sigWidth + sigGap + sigWidth / 2, sigY + 4, { align: 'center' });
  doc.text('Parent/Guardian', 10 + 2 * (sigWidth + sigGap) + sigWidth / 2, sigY + 4, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );
}

export function generateReportCardPDF(data: StudentReportData): jsPDF {
  // A4 Portrait
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  generateSingleReport(doc, data);
  return doc;
}

export function generateBulkReportsPDF(
  studentsData: StudentReportData[],
  grade: Grade,
  stream: Stream
): jsPDF {
  if (studentsData.length === 0) {
    throw new Error('No students to generate reports for');
  }

  // A4 Portrait
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Generate first student's report
  generateSingleReport(doc, studentsData[0]);

  // Add subsequent students on new pages
  for (let i = 1; i < studentsData.length; i++) {
    doc.addPage();
    generateSingleReport(doc, studentsData[i]);
  }

  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}
