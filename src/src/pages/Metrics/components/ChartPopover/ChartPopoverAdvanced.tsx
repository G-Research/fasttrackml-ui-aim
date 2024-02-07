import React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  TextField,
} from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Box } from '@material-ui/core';

import { Badge, Icon, Text, ToggleButton } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary';

import { GroupNameEnum } from 'config/grouping/GroupingPopovers';

import { IGroupingSelectOption } from 'types/services/models/metrics/metricsAppModel';
import { IGroupingPopoverAdvancedProps } from 'types/components/GroupingPopover/GroupingPopover';

import './ChartPopoverAdvanced.scss';

function ChartPopoverAdvanced({
  onPersistenceChange,
  onGroupingPaletteChange,
  onShuffleChange,
  groupingData,
  groupingSelectOptions,
  onSelect,
  inputLabel,
}: IGroupingPopoverAdvancedProps): React.FunctionComponentElement<React.ReactNode> {
  const [conditions, setConditions] = React.useState<string[]>([]);

  function isShuffleDisabled(): boolean {
    if (groupingData?.chart.length) {
      return false;
    }
    return true;
  }

  function onAddCondition(condition: string) {
    setConditions([...conditions, condition]);
  }

  const [inputValue, setInputValue] = React.useState('');

  function onChange(e: any, value: IGroupingSelectOption | null): void {
    if (e?.code !== 'Backspace') {
      handleSelect(value);
    } else {
      if (inputValue.length === 0) {
        handleSelect(value);
      }
    }
  }

  function handleSelect(value: IGroupingSelectOption | null) {
    console.log('handleSelect - value: ', value);
    console.log('handleSelect - onSelect: ', onSelect);
    // if (onSelect) {
    //   onSelect({
    //     groupName: GroupNameEnum.CHART,
    //     list: values.map((item: IGroupingSelectOption) =>
    //       typeof item === 'string' ? item : item.value,
    //     ),
    //   });
    // }
  }

  const value: IGroupingSelectOption | null = React.useMemo(() => {
    let data: { value: string; group: string; label: string }[] = [];

    // Find and return the user's selected value (unique) from the groupingSelectOptions
    groupingSelectOptions?.forEach((option) => {
      if (groupingData?.chart.indexOf(option.value) !== -1) {
        data.push(option);
      }
    });

    return data[0] || null;
  }, [groupingData, groupingSelectOptions]);

  //ToDo reverse mode
  // function handleGroupingMode(val: string | number, id: any) {
  //   onGroupingModeChange({
  //     groupName,
  //     value: val === 'Reverse',
  //     options: groupingData?.reverseMode[groupName as GroupNameEnum]
  //       ? groupingSelectOptions
  //       : null,
  //   });
  // }

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
            Group charts by conditions such as run.epochs &gt; 30.
          </Text>
          <div className='flex fac fjb'>
            <Button
              onClick={() => onAddCondition('test')}
              variant='contained'
              size='medium'
            >
              Add Condition
            </Button>
            {/* Add textbox to allow grouping by condition */}
            {/* <AutocompleteInput
              advanced
              context={autocompleteContext.advancedSuggestions}
              value={query.advancedInput}
              onChange={onInputChange}
              onEnter={onSubmit}
              error={processedError}
              forceRemoveError={true}
            /> */}
          </div>
          <div>
            {conditions.map((condition, index) => (
              <Box
                key={index}
                className='ChartPopoverAdvanced__conditionalFilter__box'
              >
                <Autocomplete
                  openOnFocus
                  size='small'
                  options={options}
                  value={value}
                  onChange={onChange}
                  groupBy={(option) => option.group}
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option, value) =>
                    option.value === value.value
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
                  renderTags={(value, getTagProps) => (
                    <div className='GroupingPopover__container__select__selectedFieldsContainer'>
                      {value.map((selected, i) => (
                        <Badge
                          key={i}
                          {...getTagProps({ index: i })}
                          label={selected.label}
                          selectBadge={true}
                        />
                      ))}
                    </div>
                  )}
                  renderOption={(option, { selected }) => (
                    <div className='GroupingPopover__option'>
                      <Checkbox
                        color='primary'
                        size='small'
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBoxIcon />}
                        style={{ marginRight: 4 }}
                        checked={selected}
                      />
                      <Text
                        className='GroupingPopover__option__label'
                        size={14}
                      >
                        {option.label}
                      </Text>
                    </div>
                  )}
                />
                <Button variant='contained' size='small'>
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
