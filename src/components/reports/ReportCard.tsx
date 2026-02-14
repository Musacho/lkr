import { Student } from '@/types';
import { useApp } from '@/context/AppContext';
import { schoolInfo } from '@/data/initialData';
import { cn } from '@/lib/utils';
import { getGradeColor } from '@/lib/gradeUtils';
import { generateReportCardPDF, downloadPDF } from '@/lib/pdfExport';
import { GraduationCap, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportCardProps {
  student: Student;
}

export function ReportCard({ student }: ReportCardProps) {
  const { getStudentResults, getClassRankings, currentTerm, currentYear } = useApp();
  const { results, total, average, overallGrade, best6Points, mathPoints, englishPoints } = getStudentResults(student.id);
  const rankings = getClassRankings(student.grade, student.stream);
  const studentRanking = rankings.find(r => r.student.id === student.id);
  const position = studentRanking?.position ?? 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = generateReportCardPDF({
      student,
      results,
      total,
      average,
      overallGrade,
      best6Points,
      mathPoints,
      englishPoints,
      position,
      totalStudents: rankings.length,
      term: currentTerm,
      year: currentYear
    });
    downloadPDF(doc, `Report_Card_${student.firstName}_${student.lastName}_${currentTerm}_${currentYear}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button onClick={handleDownloadPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm report-card">
        {/* Header */}
        <div className="text-center border-b border-border pb-6 mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-35 h-20 rounded-full  flex items-center justify-center">
              <img src='/logo/nqnm12h2.png' className="w-35 h-20 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{schoolInfo.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{schoolInfo.address}</p>
          <p className="text-muted-foreground text-sm">{schoolInfo.phone} | {schoolInfo.email}</p>
          <p className="text-primary font-medium mt-2 italic">&quot;{schoolInfo.motto}&quot;</p>
        </div>

        {/* Report Title */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-xl font-bold text-foreground">
            STUDENT REPORT CARD
          </h2>
          <p className="text-muted-foreground">{currentTerm} - {currentYear}</p>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Student Name</p>
            <p className="font-medium">{student.firstName} {student.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-medium">{student.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Class</p>
            <p className="font-medium">Grade {student.grade} - Stream {student.stream}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Position</p>
            <p className="font-medium">{position} of {rankings.length}</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto mb-6">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Subject</th>
                <th className="text-center w-16">CA (20%)</th>
                <th className="text-center w-16">Exam (80%)</th>
                <th className="text-center w-16">Final</th>
                <th className="text-center w-14">Grade</th>
                <th className="text-center w-14">Points</th>
                <th className="text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.subjectId} className={result.includedInBest6 ? 'bg-primary/5' : ''}>
                  <td>
                    {result.subjectName}
                    {result.isCompulsory && <span className="text-xs text-primary ml-1">*</span>}
                  </td>
                  <td className="text-center text-muted-foreground">{result.caMarks}</td>
                  <td className="text-center text-muted-foreground">{result.examMarks}</td>
                  <td className="text-center font-medium">{result.marks}</td>
                  <td className="text-center">
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      getGradeColor(result.grade)
                    )}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="text-center font-medium">{result.points}</td>
                  <td className="text-muted-foreground">{result.remarks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-muted/50">
                <td>Total / Average</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-center">{total}</td>
                <td className="text-center">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    getGradeColor(overallGrade)
                  )}>
                    {overallGrade}
                  </span>
                </td>
                <td></td>
                <td>{average.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Best 6 Points Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-primary/10 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Best 6 Points</p>
            <p className="text-2xl font-bold text-primary">{best6Points}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Mathematics</p>
            <p className="text-xl font-semibold">{mathPoints ?? '-'} pts</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">English</p>
            <p className="text-xl font-semibold">{englishPoints ?? '-'} pts</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          * Compulsory subjects (Mathematics & English). Highlighted rows are included in Best 6 calculation.
          CA = 20%, Exam = 80%. Lower points are better (1 = Distinction, 9 = Fail).
        </p>

        {/* Comments Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Class Teacher&apos;s Comment</p>
            <p className="text-foreground text-sm">
              {average >= 80 ? 'Exceptional performance! Keep up the excellent work.' :
               average >= 70 ? 'Very good performance. Continue working hard.' :
               average >= 60 ? 'Good effort. There is room for improvement.' :
               average >= 50 ? 'Satisfactory. More dedication is needed.' :
               'Needs significant improvement. Please consult with teachers.'}
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Principal&apos;s Comment</p>
            <p className="text-foreground text-sm">
              {average >= 70 ? 'Congratulations on your achievements. We are proud of you.' :
               'We encourage you to strive for excellence in all your endeavors.'}
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 pt-6 border-t border-border">
          <div className="text-center">
            <div className="border-b border-foreground w-32 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Class Teacher</p>
          </div>
          <div className="text-center">
            <div className="border-b border-foreground w-32 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Head Teacher</p>
          </div>
          <div className="text-center">
            <div className="border-b border-foreground w-32 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Parent/Guardian</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Generated on {new Date().toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
