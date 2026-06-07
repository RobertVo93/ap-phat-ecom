import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/contexts/language-context';

interface TermsSectionProps {
  agreeTerms: boolean;
  onAgreeTermsChange: (value: boolean) => void;
}

export function TermsSection({
  agreeTerms,
  onAgreeTermsChange,
}: TermsSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="hidden flex items-start space-x-2">
      <Checkbox
        id="terms"
        checked={agreeTerms}
        onCheckedChange={(checked) => onAgreeTermsChange(checked === true)}
      />
      <Label htmlFor="terms" className="text-sm text-[#8b6a42] leading-relaxed">
        {t('checkout.terms')}{' '}
        <Link href="/terms" className="text-[#573e1c] underline">
          {t('checkout.terms.link')}
        </Link>{' '}
        {t('checkout.terms.suffix')}
      </Label>
    </div>
  );
}
