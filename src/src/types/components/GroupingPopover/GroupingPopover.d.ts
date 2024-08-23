import React from 'react';

import { IGroupingConfig } from 'services/models/explorer/createAppModel';

import { IMetricProps } from 'types/pages/metrics/Metrics';
import {
  GroupNameEnum,
  IGroupingSelectOption,
} from 'types/services/models/metrics/metricsAppModel';

export interface IGroupingPopoverProps {
  groupName: GroupNameEnum;
  groupingData: IGroupingConfig;
  advancedComponent?: React.FunctionComponentElement<React.ReactNode> | null;
  groupingSelectOptions: IGroupingSelectOption[];
  onSelect: IMetricProps['onGroupingSelectChange'];
  onGroupingModeChange: IMetricProps['onGroupingModeChange'];
  inputLabel?: string;
}

export interface IGroupingPopoverAdvancedProps {
  paletteIndex?: number;
  persistence?: boolean;
  groupingData: IGroupingConfig;
  onPersistenceChange: IMetricProps['onGroupingPersistenceChange'];
  onGroupingPaletteChange?: IMetricProps['onGroupingPaletteChange'];
  onShuffleChange: IMetricProps['onShuffleChange'];
}
