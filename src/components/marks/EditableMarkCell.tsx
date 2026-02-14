import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getGradeColor, calculateGrade } from '@/lib/gradeUtils';

interface EditableMarkCellProps {
  caMarks: number;
  examMarks: number;
  onSave: (caMarks: number, examMarks: number) => void;
  maxMarks?: number;
}

export function EditableMarkCell({ caMarks, examMarks, onSave, maxMarks = 100 }: EditableMarkCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCa, setEditCa] = useState(caMarks.toString());
  const [editExam, setEditExam] = useState(examMarks.toString());
  const caInputRef = useRef<HTMLInputElement>(null);

  const finalMark = Math.round((caMarks * 0.2) + (examMarks * 0.8));

  useEffect(() => {
    if (isEditing && caInputRef.current) {
      caInputRef.current.focus();
      caInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditCa(caMarks.toString());
    setEditExam(examMarks.toString());
  }, [caMarks, examMarks]);

  const handleSave = () => {
    const caValue = parseFloat(editCa);
    const examValue = parseFloat(editExam);
    
    const validCa = !isNaN(caValue) && caValue >= 0 && caValue <= maxMarks ? caValue : caMarks;
    const validExam = !isNaN(examValue) && examValue >= 0 && examValue <= maxMarks ? examValue : examMarks;
    
    onSave(validCa, validExam);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditCa(caMarks.toString());
      setEditExam(examMarks.toString());
      setIsEditing(false);
    }
  };

  const grade = calculateGrade(finalMark, maxMarks);
  const gradeColorClass = getGradeColor(grade);

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground w-8">CA:</span>
          <Input
            ref={caInputRef}
            type="number"
            min={0}
            max={maxMarks}
            step="0.1"
            value={editCa}
            onChange={e => setEditCa(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-16 h-7 text-center text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground w-8">Exam:</span>
          <Input
            type="number"
            min={0}
            max={maxMarks}
            step="0.1"
            value={editExam}
            onChange={e => setEditExam(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-16 h-7 text-center text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-lg group-hover:text-primary transition-colors">
          {finalMark}
        </span>
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-medium',
          gradeColorClass
        )}>
          {grade}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        CA: {caMarks} | Exam: {examMarks}
      </div>
    </div>
  );
}
