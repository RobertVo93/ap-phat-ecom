import { Dispatch, SetStateAction } from 'react';
import { IOrder } from '@/types';

export interface OrderDetailBaseProps {
  order: IOrder;
}

export interface OrderDetailActionsProps extends OrderDetailBaseProps {
  rating: number;
  reviewText: string;
  rateOpen: boolean;
  setRateOpen: Dispatch<SetStateAction<boolean>>;
  setRating: Dispatch<SetStateAction<number>>;
  setReviewText: Dispatch<SetStateAction<string>>;
  onCancelOrder: (id: string) => void;
  onReorder: () => void;
  onSubmitReview: () => void;
}
