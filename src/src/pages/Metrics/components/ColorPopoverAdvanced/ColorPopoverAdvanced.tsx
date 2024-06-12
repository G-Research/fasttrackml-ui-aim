import { useMemo, useState } from 'react';

import { Box, Button, Checkbox, Radio, TextField } from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { Icon, Switcher, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import COLORS from 'config/colors/colors';
import { GroupNameEnum } from 'config/grouping/GroupingPopovers';

import {
  IGroupingCondition,
  IGroupingSelectOption,
} from 'types/services/models/metrics/metricsAppModel';
import { IGroupingPopoverAdvancedProps } from 'types/components/GroupingPopover/GroupingPopover';

import './ColorPopoverAdvanced.scss';

export enum IOperator {
  '==' = '==',
  '!=' = '!=',
  '>' = '>',
  '<' = '<',
  '>=' = '>=',
  '<=' = '<=',
}

function ColorPopoverAdvanced({
  onPersistenceChange,
  onGroupingPaletteChange,
  onShuffleChange,
  onGroupingConditionsChange,
  groupingSelectOptions,
  persistence,
  paletteIndex,
  groupingData,
}: IGroupingPopoverAdvancedProps): React.FunctionComponentElement<React.ReactNode> {
  const [inputValue, setInputValue] = useState('');
  const [selectedField, setSelectedField] =
    useState<IGroupingSelectOption | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<IOperator>(
    IOperator['=='],
  );
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [conditions, setConditions] = useState<IGroupingCondition[]>(
    groupingData?.conditions?.color || [],
  );

  const onAddCondition = () => {
    const condition: IGroupingCondition = {
      fieldName: selectedField?.label || '',
      operator: selectedOperator ?? IOperator['=='],
      value: selectedValue,
    };
    const conditionIndex = conditions.findIndex(
      (c) => c.fieldName === condition.fieldName,
    );
    const newConditions =
      conditionIndex === -1
        ? [...conditions, condition]
        : conditions.map((c, index) =>
            index === conditionIndex ? condition : c,
          );
    setConditions(newConditions);
    onGroupingConditionsChange?.(newConditions, GroupNameEnum.COLOR);
  };

  const onChangeField = (e: any, value: IGroupingSelectOption | null): void => {
    if (!e || e.code !== 'Backspace' || inputValue.length === 0)
      handleSelectField(value);
  };

  const onChangeOperator = (e: any, value: IOperator): void => {
    handleSelectOperator(value || IOperator['==']);
  };

  const handleSelectField = (value: IGroupingSelectOption | null) => {
    const newSelectedField =
      selectedField?.value === value?.value ? null : value;
    setInputValue(newSelectedField?.label || '');
    setSelectedField(newSelectedField);
  };

  const handleSelectOperator = (value?: IOperator) => {
    setSelectedOperator(value ?? IOperator['==']);
  };

  const handleSelectValue = (value: string) => {
    setSelectedValue(value);
  };

  const options = useMemo(() => {
    const filteredOptions = groupingSelectOptions?.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    return (
      filteredOptions?.sort(
        (a, b) =>
          a.label.toLowerCase().indexOf(inputValue.toLowerCase()) -
          b.label.toLowerCase().indexOf(inputValue.toLowerCase()),
      ) || []
    );
  }, [groupingSelectOptions, inputValue]);

  function onPaletteChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = e.target;
    if (onGroupingPaletteChange) {
      onGroupingPaletteChange(parseInt(value));
    }
  }
  function isShuffleDisabled(): boolean {
    //ToDo reverse mode
    // if (groupingData?.reverseMode.color || groupingData?.color.length) {
    if (groupingData?.color.length) {
      return false;
    }
    return true;
  }

  return (
    <ErrorBoundary>
      <div className='ColorPopoverAdvanced'>
        <div className='ColorPopoverAdvanced__persistence'>
          <Text component='h3' size={12} tint={50}>
            colors persistence
          </Text>
          <Text
            component='p'
            size={14}
            className='ColorPopoverAdvanced__persistence__p'
          >
            Enable persistent coloring mode so that each item always has the
            same color regardless of its order.
          </Text>
          <div className='flex fac fjb'>
            <div className='ColorPopoverAdvanced__Switcher__button__container'>
              <Switcher
                onChange={() => onPersistenceChange('color')}
                checked={persistence}
                size='large'
                variant='contained'
              />
              <Text size={14} className='ColorPopoverAdvanced__span'>
                Enable
              </Text>
            </div>
            {persistence && (
              <Button
                disabled={isShuffleDisabled()}
                onClick={() => onShuffleChange('color')}
                variant='contained'
                size='small'
              >
                Shuffle
              </Button>
            )}
          </div>
        </div>
        <div className='ColorPopoverAdvanced__preferred__colors'>
          <Text component='h3' tint={50}>
            Preferred color palette
          </Text>
          <div>
            {COLORS.map((options, index) => (
              <ErrorBoundary key={index}>
                <Box display='flex' alignItems='center'>
                  <Radio
                    color='primary'
                    checked={paletteIndex === index}
                    onChange={onPaletteChange}
                    size='small'
                    value={index}
                  />
                  <Text size={14} className='ColorPopoverAdvanced__span'>
                    {index === 0 ? '8 distinct colors' : '24 colors'}{' '}
                  </Text>
                  <div
                    className={`ColorPopoverAdvanced__paletteColors__container ${
                      paletteIndex === index ? 'active' : ''
                    }`}
                  >
                    {options.map((color) => (
                      <Box
                        key={color}
                        component='span'
                        className='ColorPopoverAdvanced__paletteColors__colorItem'
                        bgcolor={color}
                      />
                    ))}
                  </div>
                </Box>
              </ErrorBoundary>
            ))}
          </div>
        </div>
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
              value={selectedField || undefined}
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
              options={Object.values(IOperator)}
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
                  className='ChartPopoverAdvanced__conditionalFilter__box__button'
                  onClick={() => {
                    const newConditions = [...conditions];
                    newConditions.splice(index, 1);
                    setConditions(newConditions);
                    if (onGroupingConditionsChange) {
                      onGroupingConditionsChange(
                        newConditions,
                        GroupNameEnum.COLOR,
                      );
                    }
                  }}
                  variant='text'
                  size='small'
                >
                  <Icon name='close' fontSize={8} />
                </Button>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ColorPopoverAdvanced;
