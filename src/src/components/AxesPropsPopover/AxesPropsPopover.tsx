import React from 'react';
import _ from 'lodash-es';

import { Divider } from '@material-ui/core';

import {
  Text,
  SelectDropdown,
  InputWrapper,
  Icon,
  Button,
} from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import { isSystemMetric } from 'utils/isSystemMetric';
import { AlignmentOptionsEnum } from 'utils/d3';

import { ISelectDropdownOption as ISelectOption } from '../kit/SelectDropdown';

import {
  IAxesPropsPopoverProps,
  IAxesRangeValidation,
  IAxesRangeValue,
  DROPDOWN_LIST_HEIGHT,
  METRICS_ALIGNMENT_LIST,
  RANGE_DEBOUNCE_DELAY,
} from './';

import './AxesPropsPopover.scss';

function AxesPropsPopover({
  selectedIds,
  onAlignmentTypeChange,
  onAlignmentMetricChange,
  onAxesScaleRangeChange,
  alignmentConfigs,
  selectFormOptions,
  axesScaleRanges,
}: IAxesPropsPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  const [yScaleRange, setYScaleRange] = React.useState<IAxesRangeValue>({});
  const [isYScaleRangeValid, setIsYScaleRangeValid] =
    React.useState<IAxesRangeValidation>({
      min: true,
      max: true,
    });
  const [xScaleRange, setXScaleRange] = React.useState<IAxesRangeValue>({});
  const [isXScaleRangeValid, setIsXScaleRangeValid] =
    React.useState<IAxesRangeValidation>({
      min: true,
      max: true,
    });

  const handleAlignmentChange = React.useCallback(
    (option: ISelectOption): void => {
      if (option) {
        if (option.group === 'METRIC') {
          onAlignmentMetricChange(option.value);
        } else {
          selectedIds.forEach((selectedId) => {
            onAlignmentTypeChange(
              selectedId,
              option.value as AlignmentOptionsEnum,
            );
          });
        }
      }
    },
    [onAlignmentMetricChange, onAlignmentTypeChange, selectedIds],
  );

  const alignmentOptions: ISelectOption[] = React.useMemo(() => {
    let metricOptions: { value: string; label: string; group: string }[] = [];
    if (selectFormOptions) {
      for (let option of selectFormOptions) {
        if (
          option?.value?.option_name &&
          option?.value?.context === null &&
          !isSystemMetric(option.value.option_name)
        ) {
          metricOptions.push({
            value: option.label,
            label: option.label,
            group: 'METRIC',
          });
        }
      }
    }
    return METRICS_ALIGNMENT_LIST.concat(metricOptions);
  }, [selectFormOptions]);

  const selected = React.useMemo(() => {
    const filtered = alignmentConfigs.filter((alignment, index) =>
      selectedIds.includes(index),
    );
    if (filtered.length === 0) {
      return null;
    }
    return filtered.every(
      (alignmentConfig) =>
        alignmentConfig?.type === AlignmentOptionsEnum.CUSTOM_METRIC,
    )
      ? filtered[0].metric
      : filtered[0].type;
  }, [alignmentConfigs, selectedIds]);

  const axesProps = React.useMemo(
    () => ({
      xAxis: {
        scaleRange: xScaleRange,
        setScaleRange: setXScaleRange,
        setIsScaleRangeValid: setIsXScaleRangeValid,
      },
      yAxis: {
        scaleRange: yScaleRange,
        setScaleRange: setYScaleRange,
        setIsScaleRangeValid: setIsYScaleRangeValid,
      },
    }),
    [xScaleRange, yScaleRange],
  );

  const onScaleRangeChange = React.useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      value: any,
      metadata: any = { isValid: true },
    ) => {
      const [axisType, key] = (e.target?.id || '').split('-') as [
        axisType: 'xAxis' | 'yAxis',
        key: 'min' | 'max',
      ];
      if (axisType && key) {
        const { setScaleRange, setIsScaleRangeValid, scaleRange } =
          axesProps[axisType];
        setScaleRange((prev) => ({
          ...prev,
          [key]: value,
        }));
        setIsScaleRangeValid({
          min: true,
          max: true,
          [key]: metadata.isValid,
        });
        if (metadata.isValid) {
          selectedIds.forEach((selectedId) => {
            onAxesScaleRangeChange(selectedId, {
              [axisType]: { ...scaleRange, [key]: value },
            });
          });
        }
      }
    },
    [onAxesScaleRangeChange, axesProps],
  );

  const onResetRange = React.useCallback(
    (axisType: 'xAxis' | 'yAxis') => {
      selectedIds.forEach((selectedId) => {
        onAxesScaleRangeChange(selectedId, {
          [axisType]: { min: undefined, max: undefined },
        });
      });
    },
    [onAxesScaleRangeChange, selectedIds],
  );

  const validationPatterns = React.useMemo(
    () => ({
      min: (max?: number) => [
        {
          errorCondition: (value: number) =>
            max === undefined ? false : value > max,
          errorText: `Value should be equal or smaller than ${max}`,
        },
      ],
      max: (min?: number) => [
        {
          errorCondition: (value: number) =>
            min === undefined ? false : value < min,
          errorText: `Value should be equal or greater than ${min}`,
        },
      ],
    }),
    [],
  );

  React.useEffect(() => {
    selectedIds.forEach((selectedId) => {
      setXScaleRange((prevState) => {
        if (axesScaleRanges[selectedId] !== undefined) {
          return _.isEqual(axesScaleRanges[selectedId].xAxis, prevState)
            ? prevState
            : axesScaleRanges[selectedId].xAxis;
        } else {
          return prevState;
        }
      });
      setYScaleRange((prevState) => {
        if (axesScaleRanges[selectedId] !== undefined) {
          return _.isEqual(axesScaleRanges[selectedId].yAxis, prevState)
            ? prevState
            : axesScaleRanges[selectedId].yAxis;
        } else {
          return prevState;
        }
      });
    });
  }, [selectedIds, axesScaleRanges]);

  React.useEffect(() => {
    if (selectedIds.length > 1) {
      onResetRange('xAxis');
      onResetRange('yAxis');
    }
  }, [selectedIds]);

  const xResetBtnDisabled = React.useMemo(
    () => xScaleRange.min === undefined && xScaleRange.max === undefined,
    [xScaleRange],
  );
  const yResetBtnDisabled = React.useMemo(
    () => yScaleRange.min === undefined && yScaleRange.max === undefined,
    [yScaleRange],
  );
  const isDisabled = selectedIds.length === 0;
  return (
    <ErrorBoundary>
      <div className='AxesPropsPopover'>
        <div className='AxesPropsPopover__alignment'>
          <Text component='p' tint={50} className='AxesPropsPopover__subtitle'>
            X AXIS ALIGNMENT:
          </Text>
          <SelectDropdown
            selectOptions={alignmentOptions}
            handleSelect={handleAlignmentChange}
            ListboxProps={{
              style: { height: DROPDOWN_LIST_HEIGHT, padding: 0 },
            }}
            disabled={isDisabled}
            selected={selected}
          />
        </div>
        <Divider className='AxesPropsPopover__divider' />
        <div className='AxesPropsPopover__range'>
          <Text component='p' tint={50} className='AxesPropsPopover__subtitle'>
            SET AXES RANGE:
          </Text>
          <div className='AxesPropsPopover__range__container xAxis'>
            <Text size={14} className='scaleRangeInputs__label'>
              X-axis
            </Text>
            <InputWrapper
              id='xAxis-min'
              key='xAxis-min'
              label='Min'
              type='number'
              InputLabelProps={{ shrink: true }}
              wrapperClassName='scaleRangeInputs__min'
              value={xScaleRange.min}
              showMessageByTooltip
              tooltipPlacement='bottom'
              isRequiredNumberValue={false}
              isNumberValueFloat
              debounceDelay={RANGE_DEBOUNCE_DELAY}
              onChange={onScaleRangeChange}
              validationPatterns={validationPatterns.min(xScaleRange.max)}
              isValid={isXScaleRangeValid.min}
              disabled={isDisabled}
            />
            <InputWrapper
              id='xAxis-max'
              key='xAxis-max'
              label='Max'
              type='number'
              InputLabelProps={{ shrink: true }}
              wrapperClassName='scaleRangeInputs__max'
              value={xScaleRange.max}
              showMessageByTooltip
              tooltipPlacement='bottom'
              isRequiredNumberValue={false}
              isNumberValueFloat
              debounceDelay={RANGE_DEBOUNCE_DELAY}
              onChange={onScaleRangeChange}
              validationPatterns={validationPatterns.max(xScaleRange.min)}
              isValid={isXScaleRangeValid.max}
              disabled={isDisabled}
            />
            <Button
              disabled={xResetBtnDisabled}
              className='scaleRangeInputs__resetButton'
              onClick={() => !xResetBtnDisabled && onResetRange('xAxis')}
              withOnlyIcon={true}
            >
              <Icon name='reset' />
            </Button>
          </div>
          <div className='AxesPropsPopover__range__container yAxis'>
            <Text size={14} className='scaleRangeInputs__label'>
              Y-axis
            </Text>
            <InputWrapper
              id='yAxis-min'
              key='yAxis-min'
              label='Min'
              type='number'
              InputLabelProps={{ shrink: true }}
              wrapperClassName='scaleRangeInputs__min'
              value={yScaleRange.min}
              showMessageByTooltip
              tooltipPlacement='bottom'
              isRequiredNumberValue={false}
              isNumberValueFloat
              debounceDelay={RANGE_DEBOUNCE_DELAY}
              onChange={onScaleRangeChange}
              validationPatterns={validationPatterns.min(yScaleRange.max)}
              isValid={isYScaleRangeValid.min}
              disabled={isDisabled}
            />
            <InputWrapper
              id='yAxis-max'
              key='yAxis-max'
              label='Max'
              type='number'
              InputLabelProps={{ shrink: true }}
              wrapperClassName='scaleRangeInputs__max'
              value={yScaleRange.max}
              showMessageByTooltip
              tooltipPlacement='bottom'
              isRequiredNumberValue={false}
              isNumberValueFloat
              debounceDelay={RANGE_DEBOUNCE_DELAY}
              onChange={onScaleRangeChange}
              validationPatterns={validationPatterns.max(yScaleRange.min)}
              isValid={isYScaleRangeValid.max}
              disabled={isDisabled}
            />
            <Button
              disabled={yResetBtnDisabled}
              className='scaleRangeInputs__resetButton'
              onClick={() => !yResetBtnDisabled && onResetRange('yAxis')}
              withOnlyIcon={true}
            >
              <Icon name='reset' />
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(AxesPropsPopover);
