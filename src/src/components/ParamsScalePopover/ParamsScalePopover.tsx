import React from 'react';

import { Text, ToggleButton } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import {
  IParamsScalePopoverProps,
  IParamsScaleStates,
} from 'types/components/ParamsScalePopover/ParamsScalePopover';
import { ISelectOption } from 'types/services/models/explorer/createAppModel';

import { ScaleEnum } from 'utils/d3';

import './ParamsScalePopover.scss';

function ParamsScalePopover(
  props: IParamsScalePopoverProps,
): React.FunctionComponentElement<React.ReactNode> {
  function handleScaleChange(val: string | number, id: any) {
    const newParams = props.params.map((param) => {
      if (param.key === id) {
        param.scale = val as ScaleEnum;
      }
      return param;
    });

    props.onParamsScaleTypeChange(newParams);
  }

  return (
    <ErrorBoundary>
      <div className='ParamsScalePopover'>
        <Text
          size={12}
          tint={50}
          component='p'
          className='ParamsScalePopover__subtitle'
        >
          Select Params Scale:
        </Text>
        {props.params.map((param: ISelectOption) => (
          <div className='ParamsScalePopover__select' key={param.key}>
            <ToggleButton
              title={param.label + ' scale:'}
              id={param.key}
              value={param.scale ? param.scale : ScaleEnum.Linear}
              leftValue={ScaleEnum.Linear}
              rightValue={ScaleEnum.Log}
              leftLabel='Linear'
              rightLabel='Log'
              onChange={handleScaleChange}
            />
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(ParamsScalePopover);
