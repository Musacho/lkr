-- Add columns for CA marks (20%) and exam marks (80%)
ALTER TABLE public.marks 
ADD COLUMN ca_marks numeric(5,2) DEFAULT 0 CHECK (ca_marks >= 0 AND ca_marks <= 100),
ADD COLUMN exam_marks numeric(5,2) DEFAULT 0 CHECK (exam_marks >= 0 AND exam_marks <= 100);

-- Update the marks column to be calculated from ca and exam
-- The 'marks' column will store the final calculated mark: (ca_marks * 0.2) + (exam_marks * 0.8)
COMMENT ON COLUMN public.marks.ca_marks IS 'Continuous Assessment marks (weighted at 20%)';
COMMENT ON COLUMN public.marks.exam_marks IS 'End of term exam marks (weighted at 80%)';
COMMENT ON COLUMN public.marks.marks IS 'Final calculated marks: (ca_marks * 0.2) + (exam_marks * 0.8)';