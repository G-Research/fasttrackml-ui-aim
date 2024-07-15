import React from 'react';

export interface ITableColumn {
  key: string;
  label?: string;
  content: React.ReactNode | string;
  topHeader: string;
  pin?: string | null;
  isHidden?: boolean;
}
