import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Student, Mark, Grade, Stream } from '@/types';
import { allSubjects, coreSubjects } from '@/data/initialData';
import { calculateGrade, getGradeRemarks, calculateTotal, calculateAverage, generateStudentId, calculateBest6Points } from '@/lib/gradeUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  students: Student[];
  marks: Mark[];
  loading: boolean;
  currentTerm: string;
  currentYear: number;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  updateMark: (studentId: string, subjectId: string, caMarks: number, examMarks: number) => Promise<void>;
  getStudentsByClass: (grade: Grade, stream: Stream) => Student[];
  getStudentMarks: (studentId: string) => Mark[];
  getStudentResults: (studentId: string) => {
    results: { subjectId: string; subjectName: string; marks: number; caMarks: number; examMarks: number; grade: string; remarks: string; points: number; isCompulsory: boolean; includedInBest6: boolean }[];
    total: number;
    average: number;
    overallGrade: string;
    best6Points: number;
    mathPoints: number | null;
    englishPoints: number | null;
  };
  getClassRankings: (grade: Grade, stream: Stream) => { student: Student; average: number; position: number }[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const currentTerm = 'Term 1';
  const currentYear = 2026;
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user) {
      setStudents([]);
      setMarks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('last_name', { ascending: true });

      if (studentsError) throw studentsError;

      // Fetch marks for current term
      const { data: marksData, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('term', currentTerm)
        .eq('year', currentYear);

      if (marksError) throw marksError;

      // Transform database data to app format
      const transformedStudents: Student[] = (studentsData || []).map(s => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        studentId: s.student_id,
        grade: s.grade as Grade,
        stream: s.stream as Stream,
        optionalSubjects: s.optional_subjects || [],
        guardianName: s.guardian_name || undefined,
        guardianPhone: s.guardian_phone || undefined,
        dateOfBirth: s.date_of_birth || undefined,
      }));

      const transformedMarks: Mark[] = (marksData || []).map(m => ({
        studentId: m.student_id,
        subjectId: m.subject_id,
        marks: m.marks,
        caMarks: (m as any).ca_marks ?? 0,
        examMarks: (m as any).exam_marks ?? 0,
        term: m.term,
        year: m.year,
      }));

      setStudents(transformedStudents);
      setMarks(transformedMarks);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, currentTerm, currentYear, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          student_id: studentData.studentId,
          grade: studentData.grade,
          stream: studentData.stream,
          optional_subjects: studentData.optionalSubjects,
          guardian_name: studentData.guardianName || null,
          guardian_phone: studentData.guardianPhone || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newStudent: Student = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        studentId: data.student_id,
        grade: data.grade as Grade,
        stream: data.stream as Stream,
        optionalSubjects: data.optional_subjects || [],
        guardianName: data.guardian_name || undefined,
        guardianPhone: data.guardian_phone || undefined,
      };

      setStudents(prev => [...prev, newStudent]);
      
      toast({
        title: 'Success',
        description: `${newStudent.firstName} ${newStudent.lastName} has been added.`,
      });
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateStudent = useCallback(async (id: string, studentData: Partial<Student>) => {
    try {
      const updateData: any = {};
      if (studentData.firstName !== undefined) updateData.first_name = studentData.firstName;
      if (studentData.lastName !== undefined) updateData.last_name = studentData.lastName;
      if (studentData.studentId !== undefined) updateData.student_id = studentData.studentId;
      if (studentData.grade !== undefined) updateData.grade = studentData.grade;
      if (studentData.stream !== undefined) updateData.stream = studentData.stream;
      if (studentData.optionalSubjects !== undefined) updateData.optional_subjects = studentData.optionalSubjects;
      if (studentData.guardianName !== undefined) updateData.guardian_name = studentData.guardianName;
      if (studentData.guardianPhone !== undefined) updateData.guardian_phone = studentData.guardianPhone;

      const { error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setStudents(prev =>
        prev.map(student =>
          student.id === id ? { ...student, ...studentData } : student
        )
      );

      toast({
        title: 'Success',
        description: 'Student updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update student.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const deleteStudent = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      setMarks(prev => prev.filter(mark => mark.studentId !== id));

      toast({
        title: 'Success',
        description: 'Student deleted successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete student.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateMark = useCallback(async (studentId: string, subjectId: string, caMarks: number, examMarks: number) => {
    const finalMarks = Math.round((caMarks * 0.2) + (examMarks * 0.8));
    
    try {
      // Use upsert to insert or update
      const { error } = await supabase
        .from('marks')
        .upsert({
          student_id: studentId,
          subject_id: subjectId,
          marks: finalMarks,
          ca_marks: caMarks,
          exam_marks: examMarks,
          term: currentTerm,
          year: currentYear,
        }, {
          onConflict: 'student_id,subject_id,term,year',
        });

      if (error) throw error;

      setMarks(prev => {
        const existingIndex = prev.findIndex(
          m => m.studentId === studentId && m.subjectId === subjectId && m.term === currentTerm && m.year === currentYear
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], marks: finalMarks, caMarks, examMarks };
          return updated;
        }
        
        return [...prev, { studentId, subjectId, marks: finalMarks, caMarks, examMarks, term: currentTerm, year: currentYear }];
      });
    } catch (error: any) {
      console.error('Error updating mark:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save mark.',
        variant: 'destructive',
      });
    }
  }, [currentTerm, currentYear, toast]);

  const getStudentsByClass = useCallback((grade: Grade, stream: Stream) => {
    return students.filter(s => s.grade === grade && s.stream === stream);
  }, [students]);

  const getStudentMarks = useCallback((studentId: string) => {
    return marks.filter(m => m.studentId === studentId && m.term === currentTerm && m.year === currentYear);
  }, [marks, currentTerm, currentYear]);

  const getStudentResults = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { results: [], total: 0, average: 0, overallGrade: '9', best6Points: 0, mathPoints: null, englishPoints: null };

    const studentMarks = getStudentMarks(studentId);
    const studentSubjects = [
      ...coreSubjects,
      ...allSubjects.filter(s => student.optionalSubjects.includes(s.id))
    ];

    const basicResults = studentSubjects.map(subject => {
      const mark = studentMarks.find(m => m.subjectId === subject.id);
      const markValue = mark?.marks ?? 0;
      const caValue = mark?.caMarks ?? 0;
      const examValue = mark?.examMarks ?? 0;
      const grade = calculateGrade(markValue);
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        marks: markValue,
        caMarks: caValue,
        examMarks: examValue,
        grade,
        remarks: getGradeRemarks(grade),
      };
    });

    // Calculate best 6 points with mandatory Math and English
    const { resultsWithBest6, best6Points, mathPoints, englishPoints } = calculateBest6Points(basicResults);

    const marksArray = basicResults.map(r => r.marks);
    const total = calculateTotal(marksArray);
    const average = calculateAverage(marksArray);
    const overallGrade = calculateGrade(average);

    return { results: resultsWithBest6, total, average, overallGrade, best6Points, mathPoints, englishPoints };
  }, [students, getStudentMarks]);

  const getClassRankings = useCallback((grade: Grade, stream: Stream) => {
    const classStudents = getStudentsByClass(grade, stream);
    
    const studentsWithAverages = classStudents.map(student => {
      const { average } = getStudentResults(student.id);
      return { student, average };
    });

    studentsWithAverages.sort((a, b) => b.average - a.average);

    return studentsWithAverages.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }, [getStudentsByClass, getStudentResults]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return (
    <AppContext.Provider
      value={{
        students,
        marks,
        loading,
        currentTerm,
        currentYear,
        addStudent,
        updateStudent,
        deleteStudent,
        updateMark,
        getStudentsByClass,
        getStudentMarks,
        getStudentResults,
        getClassRankings,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
