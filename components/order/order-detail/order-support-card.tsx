import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Brand } from '@/lib/brand';
import { useLanguage } from '@/lib/contexts/language-context';

export function OrderSupportCard() {
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42]">
      <CardContent className="p-6 text-center">
        <h3 className="font-bold text-[#573e1c] text-lg mb-3">
          {t('order.detail.needHelp')}
        </h3>
        <p className="text-[#8b6a42] text-sm mb-4">
          {t('order.detail.contactUs')}
        </p>
        <div className="space-y-2">
          <a href={`tel:${Brand.phone?.replace(/\s+/g, '')}`} className="flex items-center justify-center space-x-2 text-sm text-[#573e1c] hover:text-[#8b6a42] transition-colors">
            <Phone className="w-4 h-4" />
            <span>{Brand.phone}</span>
          </a>
          <a href={`mailto:${Brand.email}`} className="flex items-center justify-center space-x-2 text-sm text-[#573e1c] hover:text-[#8b6a42] transition-colors">
            <Mail className="w-4 h-4" />
            <span>{Brand.email}</span>
          </a>
          <a
            href={`https://zalo.me/${Brand.phone?.replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 p-3 rounded-lg mt-4 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{t('order.detail.chatNow')}</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
