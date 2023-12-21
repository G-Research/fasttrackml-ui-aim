import React, { memo } from 'react';

import BusyLoaderWrapper from 'components/BusyLoaderWrapper/BusyLoaderWrapper';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { IDistributionVisualizerProps } from '../types';

import Wrapper from './temp/Wrapper';

import './DistributionsVisualizer.scss';

function DistributionsVisualizer(
  props: IDistributionVisualizerProps,
): React.FunctionComponentElement<React.ReactNode> {
  return (
    <ErrorBoundary>
      <BusyLoaderWrapper
        className='VisualizationLoader'
        isLoading={!!props.isLoading}
      >
        <div className='DistributionsVisualizer'>
          {props.data?.processedValues && (
            <Wrapper
              data={props.data?.processedValues}
              className='Visualizer'
              iters={props.data.iters}
            />
          )}
        </div>
      </BusyLoaderWrapper>
    </ErrorBoundary>
  );
}

DistributionsVisualizer.displayName = 'DistributionsVisualizer';

export default memo<IDistributionVisualizerProps>(DistributionsVisualizer);
