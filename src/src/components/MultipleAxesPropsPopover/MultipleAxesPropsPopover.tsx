import React, { useCallback, useState } from 'react';
import _ from 'lodash-es';

import AlignmentPopover from 'components/AxesPropsPopover/AxesPropsPopover';
import { Text, SelectDropdown } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { IMultipleAxesPropsPopoverProps } from './';

function MultipleAxesPropsPopover({
  idsOptions,
  onAlignmentTypeChange,
  onAlignmentMetricChange,
  onAxesScaleRangeChange,
  alignmentConfig,
  selectFormOptions,
  axesScaleRange,
}: IMultipleAxesPropsPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleAlignmentChange = useCallback((option): void => {
    setSelectedId(option.value);
  }, []);

  function getChartId() {
    return selectedId;
  }
  return (
    <ErrorBoundary>
      <div>
        <Text component='p' tint={50}>
          CHART ID:
        </Text>
        <SelectDropdown
          selectOptions={idsOptions}
          handleSelect={handleAlignmentChange}
        />
      </div>
      <AlignmentPopover
        getChartId={getChartId}
        selectFormOptions={selectFormOptions}
        alignmentConfig={alignmentConfig}
        axesScaleRange={axesScaleRange}
        onAlignmentMetricChange={onAlignmentMetricChange}
        onAlignmentTypeChange={onAlignmentTypeChange}
        onAxesScaleRangeChange={onAxesScaleRangeChange}
      />
    </ErrorBoundary>
  );
}

export default React.memo(MultipleAxesPropsPopover);
