export interface MultiSelectProps extends SelectStatusProps, SelectDataProps, SelectThemeProps {
  id: string | number;
  batchSelectionActive?: boolean;
  batchSelectionLabel?: string;
  clearSelectionActive?: boolean;
  clearSelectionLabel?: string;
  disabled?: boolean;
  options?: SelectOptionProps[];
  groups?: SelectGroupProps[];
  placeholder?: string;
  size: 'base' | 's' | 'none';
  theme?: 'default';
  state?: 'none' | 'error' | 'valid';
  values?: string[] | number[];
  loading?: boolean;
  onChange?: (selection: string[] | number[]) => void;
}
