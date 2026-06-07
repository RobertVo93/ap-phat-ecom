import { Dispatch, SetStateAction } from 'react';
import { IOrder } from '@/types';

export type OrdersTranslator = (key: string) => string;

export interface OrdersPageHeaderProps {
  t: OrdersTranslator;
}

export interface OrdersErrorCardProps {
  error: string | null;
}

export interface OrdersFilterCardProps {
  searchQuery: string;
  statusFilter: string;
  t: OrdersTranslator;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setStatusFilter: Dispatch<SetStateAction<string>>;
}

export interface OrderCardProps {
  order: IOrder;
  t: OrdersTranslator;
}

export interface OrdersListProps {
  hasMore: boolean;
  loading: boolean;
  orders: IOrder[];
  t: OrdersTranslator;
  loadMoreRef: (node: HTMLDivElement | null) => void;
}

export interface OrdersEmptyStateProps {
  loading: boolean;
  t: OrdersTranslator;
}
