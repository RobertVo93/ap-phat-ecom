import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CopyValueRowProps {
  label: string;
  value: string;
  field: string;
  copiedField: string | null;
  color: 'blue' | 'pink';
  onCopy: (text: string, field: string) => void;
  isStrong?: boolean;
}

export function CopyValueRow({
  label,
  value,
  field,
  copiedField,
  color,
  onCopy,
  isStrong = false,
}: CopyValueRowProps) {
  const textClassName = color === 'blue' ? 'text-blue-900' : 'text-pink-900';
  const labelClassName = color === 'blue' ? 'text-blue-700' : 'text-pink-700';
  const buttonClassName = color === 'blue'
    ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
    : 'text-pink-600 hover:text-pink-800 hover:bg-pink-100';

  return (
    <div className="space-y-2">
      <Label className={`${labelClassName} font-medium`}>{label}</Label>
      <div className="flex items-center justify-between p-3 bg-white rounded border">
        <span className={`${textClassName} ${isStrong ? 'font-mono text-lg font-bold' : 'font-medium'}`}>
          {value}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onCopy(value, field)}
          className={buttonClassName}
        >
          {copiedField === field ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
