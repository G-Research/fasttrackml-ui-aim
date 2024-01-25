import { ISelectOption } from 'types/services/models/explorer/createAppModel';
import { ScaleEnum } from 'utils/d3';

export interface IParamsScaleState {
  name: string;
  scale: ScaleEnum;
}

export interface IParamsScaleStates {
  params: IParamsScaleState[];
}

export interface IParamsScalePopoverProps {
  onParamsScaleTypeChange: (params: ISelectOption[]) => void;
  paramsScaleType: IParamsScaleStates;
  params: ISelectOption[];
}
