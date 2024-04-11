// @ts-nocheck
/* eslint-disable react/prop-types */
import React from 'react';
import { VariableSizeList as List } from 'react-window';

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

import { ISelectOption } from 'types/services/models/explorer/createAppModel';

const Row = React.forwardRef(({ index, children, setSize }, ref) => {
  const rowRef = React.useRef();
  React.useEffect(() => {
    setSize(index, rowRef.current.getBoundingClientRect().height);
  }, [setSize, index]);
  return <div ref={rowRef}>{children[index]}</div>;
});

const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref,
) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const listRef = React.useRef();
  const sizeMap = React.useRef({});
  const setSize = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);
  const getSize = (index) => {
    return sizeMap.current[index] || 50;
  };

  return (
    <div {...other}>
      <List
        height={380}
        width='100%'
        itemCount={itemCount}
        itemSize={getSize}
        ref={listRef}
      >
        {({ index, style }) => (
          <div style={style}>
            <Row index={index} setSize={setSize}>
              {children}
            </Row>
          </div>
        )}
      </List>
    </div>
  );
});

const SelectFormPopper: React.FC<ISelectFormPopperProps> = ({
  id,
  open,
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
  className,
  classes,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.stopPropagation();
    }
  };

  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement='bottom-start'
      className={className}
    >
      <Autocomplete
        open
        onClose={handleClose}
        multiple
        disablePortal
        disableCloseOnSelect
        options={options}
        ListboxProps={{
          style: {
            maxHeight: 400,
          },
        }}
        value={selectedData?.options}
        onChange={onSelect}
        classes={{
          popper: classes.popper,
        }}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => option.label}
        renderTags={() => null}
        disableClearable={true}
        disableListWrap
        ListboxComponent={ListboxComponent}
        renderOption={(option) => {
          let selected: boolean = !!selectedData?.options.find(
            (item: ISelectOption) => item.key === option.key,
          )?.key;
          return (
            <div className='Popper__SelectForm__option'>
              <Checkbox
                color='primary'
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBoxIcon />}
                checked={selected}
                size='small'
              />
              <Text className='Popper__SelectForm__option__label' size={14}>
                {option.label}
              </Text>
            </div>
          );
        }}
        renderInput={(params) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Select all visible'>
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
                onKeyDown: handleKeyDown,
              }}
              spellCheck={false}
              placeholder='Search'
              autoFocus={true}
              style={{ flex: 1 }}
              className='Popper__SelectForm__select'
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
      />
    </Popper>
  );
};

export default SelectFormPopper;
