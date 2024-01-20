import React from 'react';

import { Text, ToggleButton } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import {
  IParamsScalePopoverProps,
  IParamsScaleStates,
  IParamsScaleState
} from 'types/components/ParamsScalePopover/ParamsScalePopover';

import { ScaleEnum } from 'utils/d3';

import './MetricsScalePopover.scss';

function ParamsScalePopover(
  props: IParamsScalePopoverProps,
): React.FunctionComponentElement<React.ReactNode> {
  function handleScaleChange(val: string | number, id: any) {
    const scaleParams: IParamsScaleStates = {
      ...props.paramsScaleType,
      [id]: val,
    };
    props.onParamsScaleTypeChange(scaleParams);
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
        {props.paramsScaleType.params.map((param: IParamsScaleState) => (
          <div className='ParamsScalePopover__select'>
            <ToggleButton
              title={param.name + ' scale:'}
              id={param.name}
              value={param.scale}
              leftValue={ScaleEnum.Linear}
              rightValue={ScaleEnum.Log}
              leftLabel='Linear'
              rightLabel='Log'
              onChange={handleScaleChange}
            />
          </div>
        )) 
        }
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(ParamsScalePopover);
