import { ResizeModeEnum } from 'config/enums/tableEnums';

import {
  IActivePoint,
  INearestCircle,
  ISyncHoverStateArgs,
} from 'types/utils/d3/drawHoverAttributes';
import { IAxesScaleRange } from 'types/components/AxesPropsPopover/AxesPropsPopover';
import { IAxesScaleState } from 'types/components/AxesScalePopover/AxesScalePopover';
import { IAxisScale } from 'types/utils/d3/getAxisScale';
import {
  IAggregatedData,
  IAggregationConfig,
  IAlignmentConfig,
  IChartTitle,
  IChartZoom,
  IFocusedState,
} from 'types/services/models/metrics/metricsAppModel';
import { IRun } from 'types/services/models/metrics/runModel';

import { CurveEnum, HighlightEnum } from 'utils/d3';

export interface ILine {
  key: string;
  data: {
    xValues: number[];
    yValues: number[];
  };
  color?: string;
  dasharray?: string;
  selectors?: string[];
  groupKey?: string;
  run?: IRun;
  chartIndex?: number;
}

export interface ILineChartProps {
  index?: number;
  id?: string;
  data: ILine[];
  nameKey?: string;
  aggregatedData?: IAggregatedData[];
  alignmentConfig?: IAlignmentConfig;
  ignoreOutliers?: boolean;
  axesScaleRange?: IAxesScaleRange;
  highlightMode?: HighlightEnum;
  curveInterpolation?: CurveEnum;
  syncHoverState?: (args: ISyncHoverStateArgs) => void;
  aggregationConfig?: IAggregationConfig;
  chartTitle?: IChartTitle;
  zoom?: IChartZoom;
  onZoomChange?: (zoom: Partial<IChartZoom>) => void;
  resizeMode?: ResizeModeEnum;
  onMount?: () => void;
  axesScaleType?: IAxesScaleState;
  readOnly?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export interface ILineChartRef {
  setActiveLineAndCircle: (
    lineKey: string,
    focusedStateActive: boolean = false,
    force: boolean = false,
  ) => void;
  updateHoverAttributes: (xValue: number, dataSelector?: string) => void;
  clearHoverAttributes: () => void;
  setFocusedState: (focusedState: IFocusedState) => void;
}

export interface IUpdateFocusedChartArgs {
  mousePos?: [number, number];
  focusedStateActive?: boolean;
  force?: boolean;
}

export interface IAttributesRef {
  focusedState?: IFocusedState;
  activePoint?: IActivePoint;
  nearestCircles?: INearestCircle[];
  groupKey?: string;
  currentXValue?: number | string;
  scaledValues?: { x: number; y: number }[][];
  lineKey?: string;
  dataSelector?: string;
  xScale?: IAxisScale;
  yScale?: IAxisScale;
  updateScales?: (xScale: IAxisScale, yScale: IAxisScale) => void;
  setActiveLineAndCircle?: (
    lineKey: string,
    focusedStateActive: boolean = false,
    force: boolean = false,
  ) => void;
  updateHoverAttributes?: (xValue: number, dataSelector?: string) => void;
  updateFocusedChart?: (args?: IUpdateFocusedChartArgs) => void;
  clearHoverAttributes?: () => void;
}
