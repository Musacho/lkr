-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  grade TEXT NOT NULL,
  stream TEXT NOT NULL CHECK (stream IN ('A', 'B')),
  optional_subjects TEXT[] DEFAULT '{}',
  guardian_name TEXT,
  guardian_phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject_id TEXT NOT NULL,
  marks INTEGER NOT NULL CHECK (marks >= 0 AND marks <= 100),
  term TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, subject_id, term, year)
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

-- Policies for students - all authenticated users can CRUD
CREATE POLICY "Authenticated users can view students" 
ON public.students FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert students" 
ON public.students FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update students" 
ON public.students FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete students" 
ON public.students FOR DELETE 
TO authenticated
USING (true);

-- Policies for marks - all authenticated users can CRUD
CREATE POLICY "Authenticated users can view marks" 
ON public.marks FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert marks" 
ON public.marks FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update marks" 
ON public.marks FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete marks" 
ON public.marks FOR DELETE 
TO authenticated
USING (true);

-- Trigger for updated_at on students
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on marks
CREATE TRIGGER update_marks_updated_at
BEFORE UPDATE ON public.marks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_students_grade_stream ON public.students(grade, stream);
CREATE INDEX idx_marks_student_term_year ON public.marks(student_id, term, year);