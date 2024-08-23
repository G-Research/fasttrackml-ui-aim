import React from 'react';

import { ResizeModeEnum } from 'config/enums/tableEnums';

import { ILine, ILineChartProps } from 'types/components/LineChart/LineChart';
import { IActivePoint } from 'types/utils/d3/drawHoverAttributes';
import { IProcessedData } from 'types/utils/d3/processLineChartData';
import {
  IAggregationConfig,
  ITooltip,
  IFocusedState,
  IAlignmentConfig,
  IChartZoom,
  IGroupingSelectOption,
  LegendsDataType,
  LegendsConfig,
} from 'types/services/models/metrics/metricsAppModel';
import { IHighPlotProps } from 'types/components/HighPlot/HighPlot';
import { ITagInfo } from 'types/pages/tags/Tags';

import { ChartTypeEnum } from 'utils/d3';

export interface IChartPanelProps {
  chartType: ChartTypeEnum;
  // TODO after line model definition change to HighPlot Line type
  data: ILine[][] | any;
  legendsData?: LegendsDataType;
  panelResizing?: boolean;
  focusedState: IFocusedState;
  tooltip: ITooltip;
  legends?: LegendsConfig;
  aggregationConfig?: IAggregationConfig;
  alignmentConfig?: IAlignmentConfig;
  zoom?: Partial<IChartZoom>;
  chartPanelOffsetHeight?: number;
  // chartProps: Omit<
  //   ILineChartProps | IHighPlotProps,
  //   'data' | 'index' | 'syncHoverState'
  // >[];
  // TODO need to fix type later
  chartProps: any[];
  controls: React.ReactNode;
  onZoomChange?: (zoom: Partial<IChartZoom>) => void;
  onRunsTagsChange: (runHash: string, tags: ITagInfo[]) => void;
  onActivePointChange?: (
    activePoint: IActivePoint,
    focusedStateActive?: boolean,
  ) => void;
  onChangeTooltip: (tooltip: ITooltip) => void;
  onLegendsChange?: (legends: Partial<LegendsConfig>) => void;
  resizeMode?: ResizeModeEnum;
  selectOptions: IGroupingSelectOption[];
}

export interface IChartPanelRef {
  setActiveLineAndCircle?: (
    lineKey?: string,
    focusedStateActive: boolean = false,
    force: boolean = false,
  ) => void;
  updateLines: (data: IProcessedData[]) => void;
}

export type IMemoizedForwardRefComponent<T> = React.MemoExoticComponent<
  React.ForwardRefExoticComponent<T & React.RefAttributes<unknown>>
>;

export interface IChartTypeConfig {
  [key: string]:
    | IMemoizedForwardRefComponent<ILineChartProps>
    | IMemoizedForwardRefComponent<IHighPlotProps>
    | IMemoizedForwardRefComponent<any>;
}
