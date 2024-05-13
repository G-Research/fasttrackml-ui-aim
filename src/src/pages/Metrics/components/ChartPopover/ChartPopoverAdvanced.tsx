import React from 'react';

import { Checkbox, TextField } from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Box } from '@material-ui/core';

import { Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary';

import {
  IGroupingCondition,
  IGroupingSelectOption,
} from 'types/services/models/metrics/metricsAppModel';
import { IGroupingPopoverAdvancedProps } from 'types/components/GroupingPopover/GroupingPopover';

import './ChartPopoverAdvanced.scss';

export enum IOperator {
  '==' = '==',
  '!=' = '!=',
  '>' = '>',
  '<' = '<',
  '>=' = '>=',
  '<=' = '<=',
}

function ChartPopoverAdvanced({
  onGroupingConditionsChange,
  groupingData,
  groupingSelectOptions,
}: IGroupingPopoverAdvancedProps): React.FunctionComponentElement<React.ReactNode> {
  // Current value for selectedField
  const [inputValue, setInputValue] = React.useState('');

  // Controls for the condition inputs
  const [selectedField, setSelectedField] =
    React.useState<IGroupingSelectOption | null>(null);

  const [selectedOperator, setSelectedOperator] =
    React.useState<IOperator | null>(IOperator['==']);

  const [selectedValue, setSelectedValue] = React.useState<string>('');

  // Array of grouping conditions
  const [conditions, setConditions] = React.useState<IGroupingCondition[]>(
    groupingData?.conditions || [],
  );

  const operators = [
    IOperator['=='],
    IOperator['!='],
    IOperator['>'],
    IOperator['<'],
    IOperator['>='],
    IOperator['<='],
  ];

  function onAddCondition() {
    // Create a new condition object
    const condition: IGroupingCondition = {
      fieldName: selectedField?.label || '',
      operator: selectedOperator ?? IOperator['=='],
      value: selectedValue,
    };

    // If condition fieldName is not in array, add it, else replace
    const conditionIndex = conditions.findIndex(
      (c) => c.fieldName === condition.fieldName,
    );
    if (conditionIndex === -1) {
      const newConditions = [...conditions, condition];
      setConditions(newConditions);
      onGroupingConditionsChange?.(newConditions);
    } else {
      const newConditions = [...conditions];
      newConditions[conditionIndex] = condition;
      setConditions(newConditions);
      onGroupingConditionsChange?.(newConditions);
    }
  }

  function onChangeField(e: any, value: IGroupingSelectOption | null): void {
    if (e?.code !== 'Backspace') {
      handleSelectField(value);
    } else {
      if (inputValue.length === 0) {
        handleSelectField(value);
      }
    }
  }

  function onChangeOperator(e: any, value: IOperator): void {
    handleSelectOperator(value || IOperator['==']);
  }

  function handleSelectField(value: IGroupingSelectOption | null) {
    if (selectedField?.value === value?.value) {
      setInputValue('');
      setSelectedField(null);
      return;
    }

    setInputValue(value?.label || '');
    setSelectedField(value);
  }

  function handleSelectOperator(value?: IOperator) {
    setSelectedOperator(value ?? IOperator['==']);
  }

  function handleSelectValue(value: string) {
    setSelectedValue(value);
  }

  const options = React.useMemo(() => {
    if (inputValue.trim() !== '') {
      const filtered = groupingSelectOptions?.filter((item) => {
        return item.label.indexOf(inputValue) !== -1;
      });
      if (!filtered) {
        return [];
      }
      return filtered
        .slice()
        .sort(
          (a, b) => a.label.indexOf(inputValue) - b.label.indexOf(inputValue),
        );
    }
    return groupingSelectOptions || [];
  }, [groupingSelectOptions, inputValue]);

  return (
    <ErrorBoundary>
      <div className='ChartPopoverAdvanced'>
        <div className='ChartPopoverAdvanced__conditionalFilter'>
          <Text component='h3' size={12} tint={50}>
            group by condition
          </Text>
          <Text
            component='p'
            size={14}
            className='ChartPopoverAdvanced__conditionalFilter__p'
          >
            Group charts by conditions such as{' '}
            <span style={{ fontFamily: 'Courier New' }}>
              run.epochs &gt; 30
            </span>
            .
          </Text>
          <div className='flex fac'>
            {/* Add textbox to allow grouping by condition */}
            <Autocomplete
              className='ChartPopoverAdvanced__container__select__fieldName'
              openOnFocus
              size='small'
              disableClearable={true}
              options={options}
              value={selectedField ?? undefined}
              onChange={onChangeField}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) =>
                option.value === selectedField?.value
              }
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    value: inputValue,
                    onChange: (e: any) => {
                      setInputValue(e.target?.value);
                    },
                  }}
                  className='TextField__OutLined__Small'
                  variant='outlined'
                  placeholder='Select fields'
                />
              )}
              renderTags={() => null} // No tags for single selection
              renderOption={(option, { selected }) => (
                <div
                  className='GroupingPopover__option'
                  onClick={() => onChangeField(null, option)}
                >
                  <Checkbox
                    color='primary'
                    size='small'
                    icon={<CheckBoxOutlineBlank />}
                    checkedIcon={<CheckBoxIcon />}
                    style={{ marginRight: 4 }}
                    checked={selected}
                  />
                  <Text className='GroupingPopover__option__label' size={14}>
                    {option.label}
                  </Text>
                </div>
              )}
            />
            {/* Dropdown for operator */}
            <Autocomplete
              className='ChartPopoverAdvanced__container__select__operator'
              size='small'
              openOnFocus
              disableClearable={true}
              options={operators}
              value={selectedOperator ?? IOperator['==']}
              onChange={onChangeOperator}
              placeholder='Select operator'
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  className='TextField__OutLined__Small'
                  variant='outlined'
                  placeholder='Select operator'
                />
              )}
            />
            {/* Textbox for the condition value */}
            <TextField
              className='ChartPopoverAdvanced__container__select__value'
              variant='outlined'
              size='small'
              placeholder='Enter value'
              value={selectedValue}
              onChange={(e) => handleSelectValue(e.target.value)}
            />
          </div>
          <Button
            className='ChartPopoverAdvanced__container__select__button'
            onClick={() => onAddCondition()}
            variant='outlined'
            size='medium'
            disabled={!selectedField || !selectedOperator || !selectedValue}
          >
            Add Condition
          </Button>
          <div>
            {conditions.map((condition, index) => (
              <Box
                key={index}
                className='ChartPopoverAdvanced__conditionalFilter__box flex fac fjb'
              >
                {/* Show condition and button in same line */}
                <Text
                  size={14}
                  className='ChartPopoverAdvanced__conditionalFilter__box__p'
                >
                  {condition.fieldName} {condition.operator} {condition.value}
                </Text>
                <Button
                  onClick={() => {
                    const newConditions = [...conditions];
                    newConditions.splice(index, 1);
                    setConditions(newConditions);
                    if (onGroupingConditionsChange) {
                      onGroupingConditionsChange(newConditions);
                    }
                  }}
                  variant='contained'
                  size='small'
                >
                  Remove
                </Button>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ChartPopoverAdvanced;
