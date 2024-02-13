import {
  IGroupingSelectOption,
  ITooltip,
} from 'types/services/models/metrics/metricsAppModel';

import { CurveEnum } from 'utils/d3';
import { ISelectOption } from 'types/services/models/explorer/createAppModel';

export interface IControlProps {
  curveInterpolation: CurveEnum;
  isVisibleColorIndicator: boolean;
  selectOptions: IGroupingSelectOption[];
  tooltip?: ITooltip;
  onColorIndicatorChange: () => void;
  onCurveInterpolationChange: () => void;
  onChangeTooltip: (tooltip: Partial<ITooltip>) => void;
  onParamsScaleTypeChange: (args: ISelectOption[]) => void;
  selectedParams: ISelectOption[];
}
