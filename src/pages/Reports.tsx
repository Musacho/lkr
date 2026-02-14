import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClassSelector } from '@/components/dashboard/ClassSelector';
import { ReportCard } from '@/components/reports/ReportCard';
import { useApp } from '@/context/AppContext';
import { Grade, Stream, Student } from '@/types';
import { FileText, ChevronRight, Loader2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { generateBulkReportsPDF, downloadPDF } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';

export default function Reports() {
  const [grade, setGrade] = useState<Grade>('FORM 1');
  const [stream, setStream] = useState<Stream>('A');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { getStudentsByClass, getStudentResults, getClassRankings, currentTerm, currentYear, loading } = useApp();
  const { toast } = useToast();
  const classStudents = getStudentsByClass(grade, stream);

  const handleExportAll = async () => {
    if (classStudents.length === 0) {
      toast({
        title: 'No students',
        description: 'There are no students in this class to export.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const rankings = getClassRankings(grade, stream);
      
      const studentsData = classStudents.map(student => {
        const { results, total, average, overallGrade, best6Points, mathPoints, englishPoints } = getStudentResults(student.id);
        const studentRanking = rankings.find(r => r.student.id === student.id);
        
        return {
          student,
          results,
          total,
          average,
          overallGrade,
          best6Points,
          mathPoints,
          englishPoints,
          position: studentRanking?.position ?? 0,
          totalStudents: rankings.length,
          term: currentTerm,
          year: currentYear
        };
      });

      const doc = generateBulkReportsPDF(studentsData, grade, stream);
      downloadPDF(doc, `Report_Cards_Grade${grade}_Stream${stream}_${currentTerm}_${currentYear}.pdf`);
      
      toast({
        title: 'Export complete',
        description: `${classStudents.length} report cards exported successfully.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (selectedStudent) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <button
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors no-print"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to student list
          </button>
          <ReportCard student={selectedStudent} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Report Cards</h1>
            <p className="text-muted-foreground mt-1">
              View and export student report cards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ClassSelector
              grade={grade}
              stream={stream}
              onGradeChange={setGrade}
              onStreamChange={setStream}
            />
            {classStudents.length > 0 && (
              <Button 
                onClick={handleExportAll} 
                disabled={isExporting}
                className="gap-2"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export All ({classStudents.length})
              </Button>
            )}
          </div>
        </div>

        {/* Student List */}
        {classStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classStudents.map(student => {
              const { average, overallGrade } = getStudentResults(student.id);
              
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={cn(
                    'p-4 bg-card rounded-xl border border-border text-left',
                    'hover:border-primary/50 hover:shadow-md transition-all duration-200',
                    'animate-fade-in group'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{average.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Grade {overallGrade}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">View report card</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No students in Grade {grade} - Stream {stream}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
