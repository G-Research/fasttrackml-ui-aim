import {
  IGroupingSelectOption,
  ITooltip,
} from 'types/services/models/metrics/metricsAppModel';

import { IParamsScaleStates } from 'types/components/ParamsScalePopover/ParamsScalePopover';

import { CurveEnum } from 'utils/d3';
import { ISelectOption } from 'types/services/models/explorer/createAppModel';

export interface IControlProps {
  curveInterpolation: CurveEnum;
  isVisibleColorIndicator: boolean;
  selectOptions: IGroupingSelectOption[];
  tooltip?: ITooltip;
  paramsScaleType: IParamsScaleStates;
  onColorIndicatorChange: () => void;
  onCurveInterpolationChange: () => void;
  onChangeTooltip: (tooltip: Partial<ITooltip>) => void;
  onParamsScaleTypeChange: (args: ISelectOption[]) => void;
  params: ISelectOption[];
}
