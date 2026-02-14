import { Grade, Stream } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClassSelectorProps {
  grade: Grade;
  stream: Stream;
  onGradeChange: (grade: Grade) => void;
  onStreamChange: (stream: Stream) => void;
}

const grades: Grade[] = ['FORM 1', 'FORM 2', 'FORM 3', 'FORM 4','10','11','12'];
const streams: Stream[] = ['ONE', 'TWO','THREE','A','B','C'];

export function ClassSelector({ grade, stream, onGradeChange, onStreamChange }: ClassSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Grade:</label>
        <Select value={grade} onValueChange={onGradeChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {grades.map(g => (
              <SelectItem key={g} value={g}>Grade {g}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Stream:</label>
        <Select value={stream} onValueChange={onStreamChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {streams.map(s => (
              <SelectItem key={s} value={s}>Stream {s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
