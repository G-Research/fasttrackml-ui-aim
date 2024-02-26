// @ts-nocheck
/* eslint-disable react/prop-types */
import React from 'react';

import ToggleButton from '@material-ui/lab/ToggleButton';
import {
  Checkbox,
  InputBase,
  Popper,
  Snackbar,
  Tooltip,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiAlert from '@material-ui/lab/Alert';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { Text } from 'components/kit';

import {
  ISelectConfig,
  ISelectOption,
} from 'types/services/models/explorer/createAppModel';

interface ISelectFormPopperProps {
  id: string | undefined;
  open: boolean;
  disablePortal: boolean;
  anchorEl: HTMLElement | null;
  options: ISelectOption[];
  selectedData?: ISelectConfig;
  onSelect: (event: React.ChangeEvent<{}>, value: ISelectOption[]) => void;
  searchValue: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose(event: any, reason: any): void;
  regexError: string | null;
  setRegexError: (value: string | null) => void;
  isRegexSearch: boolean;
  setIsRegexSearch: (value: boolean) => void;
  classes: { [key: string]: string };
}

const SelectFormPopper: React.FC<ISelectFormPopperProps> = ({
  id,
  open,
  disablePortal = true,
  anchorEl,
  options,
  selectedData,
  onSelect,
  searchValue,
  handleSearchInputChange,
  handleClose,
  regexError,
  setRegexError,
  isRegexSearch,
  setIsRegexSearch,
  classes,
}) => {
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement='bottom-start'
      className='Metrics__SelectForm__Popper'
    >
      <Autocomplete
        open
        onClose={handleClose}
        multiple
        size='small'
        disablePortal
        disableCloseOnSelect
        options={options}
        value={selectedData?.options}
        onChange={onSelect}
        classes={{
          popper: classes.popper,
        }}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => option.label}
        renderTags={() => null}
        disableClearable={true}
        ListboxProps={{
          style: {
            height: 400,
          },
        }}
        renderInput={(params) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Select all'>
              <Checkbox
                color='primary'
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBoxIcon />}
                checked={selectedData?.options.length === options.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelect(event, options);
                  } else {
                    onSelect(event, []);
                  }
                }}
                size='small'
              />
            </Tooltip>
            <InputBase
              ref={params.InputProps.ref}
              inputProps={{
                ...params.inputProps,
                value: searchValue,
                onChange: handleSearchInputChange,
              }}
              spellCheck={false}
              placeholder='Search'
              autoFocus={true}
              style={{ flex: 1 }}
              className='Metrics__SelectForm__metric__select'
            />
            <Snackbar
              open={!!regexError}
              autoHideDuration={6000}
              onClose={() => setRegexError(null)}
            >
              <MuiAlert
                elevation={6}
                variant='filled'
                severity='error'
                onClose={() => setRegexError(null)}
              >
                {regexError}
              </MuiAlert>
            </Snackbar>
            <Tooltip title='Use Regular Expression'>
              <ToggleButton
                value='check'
                selected={isRegexSearch}
                onChange={() => {
                  setIsRegexSearch(!isRegexSearch);
                }}
                className='RegexToggle'
              >
                .*
              </ToggleButton>
            </Tooltip>
          </div>
        )}
        renderOption={(option) => {
          let selected: boolean = !!selectedData?.options.find(
            (item: ISelectOption) => item.key === option.key,
          )?.key;
          return (
            <div className='SelectForm__option'>
              <Checkbox
                color='primary'
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBoxIcon />}
                checked={selected}
                size='small'
              />
              <Text className='Metrics__SelectForm__option__label' size={14}>
                {option.label}
              </Text>
            </div>
          );
        }}
      />
    </Popper>
  );
};

export default SelectFormPopper;
