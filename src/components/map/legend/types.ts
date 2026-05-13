import { PropsWithChildren } from 'react';

type Sortable = {
  enabled: boolean;
  handle?: boolean;
  handleIcon?: React.ReactNode;
};

type OnChangeOrder = (id: string[]) => void;

/*
 * Legend
 */
export interface LegendProps extends PropsWithChildren {
  className?: string;
  sortable: Sortable;
  onChangeOrder?: OnChangeOrder;
}

/*
 * Sortable
 */
export interface SortableListProps extends PropsWithChildren {
  className?: string;
  sortable?: Sortable;
  onChangeOrder: OnChangeOrder;
  divided?: boolean;
}

export interface SortableItemProps extends PropsWithChildren {
  id: string;
  sortable: Sortable;
  divided?: boolean;
  'data-testid'?: string;
}
