import { ScaleEnum } from 'utils/d3';

export interface IParamsScaleState {
  name: string;
  scale: ScaleEnum;
}

export interface IParamsScaleStates {
  params: IParamsScaleState[];
}

export interface IParamsScalePopoverProps {
  onParamsScaleTypeChange: (params: IParamsScaleStates) => void;
  paramsScaleType: IParamsScaleStates;
}
