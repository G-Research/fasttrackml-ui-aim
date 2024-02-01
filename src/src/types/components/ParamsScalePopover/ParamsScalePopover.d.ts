import { ISelectOption } from 'types/services/models/explorer/createAppModel';
import { ScaleEnum } from 'utils/d3';

export interface IParamsScalePopoverProps {
  onParamsScaleTypeChange: (params: ISelectOption[]) => void;
  selectedParams: ISelectOption[];
}
