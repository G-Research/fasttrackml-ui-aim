// @ts-nocheck
/* eslint-disable react/prop-types */
import React from 'react';

import {
  ISelectConfig,
  ISelectOption,
} from 'types/services/models/explorer/createAppModel';

export interface ISelectFormPopperProps {
  id: string | undefined;
  type: 'metrics' | 'params';
  open: boolean;
  anchorEl: HTMLElement | null;
  options: ISelectOption[];
  selectedData?: ISelectConfig;
  onSelect: (event: React.ChangeEvent<{}>, value: ISelectOption[]) => void;
  searchValue: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose(event: any, reason: any): void;
  regexError: string | null;
  setRegexError: (value: string | null) => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (value: boolean) => void;
  className: string;
  classes: { [key: string]: string };
}