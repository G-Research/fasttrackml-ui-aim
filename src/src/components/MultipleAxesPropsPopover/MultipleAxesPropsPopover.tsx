import React, { useCallback, useState } from 'react';
import _ from 'lodash-es';
import Select from 'react-select';

import { Divider } from '@material-ui/core';

import AlignmentPopover from 'components/AxesPropsPopover/AxesPropsPopover';
import { Text, SelectDropdown } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { IMultipleAxesPropsPopoverProps } from './';

import './MultipleAxesPropsPopover.scss';

function MultipleAxesPropsPopover({
  idsOptions,
  onAlignmentTypeChange,
  onAlignmentMetricChange,
  onAxesScaleRangeChange,
  alignmentConfigs,
  selectFormOptions,
  axesScaleRanges,
}: IMultipleAxesPropsPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const options = idsOptions.map((option: { value: any; label: any }) => ({
    value: option.value,
    label: option.label,
  }));

  const selectAllOption = { value: '*', label: 'Select All' };

  const handleChange = useCallback(
    (selectedOptions) => {
      if (
        selectedOptions.some(
          (option: { value: string }) => option.value === '*',
        )
      ) {
        if (selectedIds.length === idsOptions.length) {
          setSelectedIds([]);
        } else {
          setSelectedIds(
            idsOptions.map((option: { value: any }) => option.value),
          );
        }
      } else {
        setSelectedIds(
          selectedOptions.map((option: { value: any }) => option.value),
        );
      }
    },
    [idsOptions, selectedIds],
  );

  const selectedOptions = options.filter((option: { value: number }) =>
    selectedIds.includes(option.value),
  );

  return (
    <ErrorBoundary>
      <div className='MultipleAxesPropsPopover'>
        <Text component='p' tint={50}>
          CHART ID:
        </Text>
        <Select
          isMulti
          value={selectedOptions}
          options={[selectAllOption, ...options]}
          onChange={handleChange}
          classNamePrefix='react-select'
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          className='react-select-container'
        />
        <Divider className='MultipleAxesPropsPopover__divider' />
      </div>
      <AlignmentPopover
        selectedIds={selectedIds}
        selectFormOptions={selectFormOptions}
        alignmentConfigs={alignmentConfigs}
        axesScaleRanges={axesScaleRanges}
        onAlignmentMetricChange={onAlignmentMetricChange}
        onAlignmentTypeChange={onAlignmentTypeChange}
        onAxesScaleRangeChange={onAxesScaleRangeChange}
      />
    </ErrorBoundary>
  );
}

export default React.memo(MultipleAxesPropsPopover);
