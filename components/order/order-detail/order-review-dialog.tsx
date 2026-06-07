import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/contexts/language-context';

interface OrderReviewDialogProps {
  open: boolean;
  rating: number;
  reviewText: string;
  onOpenChange: (open: boolean) => void;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (value: string) => void;
  onSubmitReview: () => void;
}

export function OrderReviewDialog({
  open,
  rating,
  reviewText,
  onOpenChange,
  onRatingChange,
  onReviewTextChange,
  onSubmitReview,
}: OrderReviewDialogProps) {
  const { t } = useLanguage();
  // TODO: Implement review submission logic and API integration. For now, this is a placeholder dialog.
  return <></>

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
        >
          <Star className="w-4 h-4 mr-2" />
          {t('order.detail.review')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#573e1c]">{t('order.detail.review')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-[#573e1c]">{t('order.detail.yourRating')}</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => onRatingChange(star)}
                  className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="review" className="text-[#573e1c]">{t('order.detail.comments')}</Label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e) => onReviewTextChange(e.target.value)}
              placeholder={t('order.detail.reviewPlaceholder')}
              className="mt-2 border-[#8b6a42] focus:border-[#573e1c]"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="border-[#573e1c] text-[#573e1c]"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={onSubmitReview}
              className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
            >
              {t('order.detail.reviewSubmit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
