import React from 'react';
import classNames from 'classnames';

import { Box, Divider, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Button, Icon, Badge, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import AutocompleteInput from 'components/AutocompleteInput';
import SelectFormPopper from 'components/SelectFormPopper/SelectFormPopper';

import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import metricAppModel from 'services/models/metrics/metricsAppModel';
import { trackEvent } from 'services/analytics';

import { ISelectFormProps } from 'types/pages/metrics/components/SelectForm/SelectForm';
import { ISelectOption } from 'types/services/models/explorer/createAppModel';

import './SelectForm.scss';

const useStyles = makeStyles({
  popper: {
    width: '100% !important',
  },
});

function SelectForm({
  requestIsPending,
  isDisabled = false,
  selectedMetricsData,
  selectFormData,
  onMetricsSelectChange,
  onSelectRunQueryChange,
  onSelectAdvancedQueryChange,
  toggleSelectAdvancedMode,
  onSearchQueryCopy,
}: ISelectFormProps): React.FunctionComponentElement<React.ReactNode> {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [isRegexSearch, setIsRegexSearch] = React.useState(false);
  const [regexError, setRegexError] = React.useState<string | null>(null);
  const searchRef: any = React.useRef<React.MutableRefObject<any>>(null);
  const autocompleteRef: any = React.useRef<React.MutableRefObject<any>>(null);
  const advancedAutocompleteRef: any =
    React.useRef<React.MutableRefObject<any>>(null);
  React.useEffect(() => {
    return () => {
      searchRef.current?.abort();
    };
  }, []);
  const classes = useStyles();

  function handleMetricSearch(): void {
    if (requestIsPending) {
      return;
    }
    let query = selectedMetricsData?.advancedMode
      ? advancedAutocompleteRef?.current?.getValue()
      : autocompleteRef?.current?.getValue();
    if (selectedMetricsData?.advancedMode) {
      onSelectAdvancedQueryChange(advancedAutocompleteRef.current.getValue());
    } else {
      onSelectRunQueryChange(autocompleteRef.current.getValue());
    }
    searchRef.current = metricAppModel.getMetricsData(true, true, query ?? '');
    searchRef.current.call();
    trackEvent(ANALYTICS_EVENT_KEYS.metrics.searchClick);
  }

  function handleRequestAbort(e: React.SyntheticEvent): void {
    e.preventDefault();
    if (!requestIsPending) {
      return;
    }
    searchRef.current?.abort();
    metricAppModel.abortRequest();
  }

  function onSelect(
    event: React.ChangeEvent<{}>,
    value: ISelectOption[],
  ): void {
    if (event.type === 'click' || event.type === 'change') {
      const lookup = value.reduce(
        (acc: { [key: string]: number }, curr: ISelectOption) => {
          acc[curr.key] = ++acc[curr.key] || 0;
          return acc;
        },
        {},
      );
      onMetricsSelectChange(value.filter((option) => lookup[option.key] === 0));
    }
  }

  function handleDelete(field: string): void {
    let fieldData = [...(selectedMetricsData?.options || [])].filter(
      (opt: ISelectOption) => opt.key !== field,
    );
    onMetricsSelectChange(fieldData);
  }

  function toggleEditMode(): void {
    toggleSelectAdvancedMode();
  }

  function handleClick(event: React.ChangeEvent<any>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event: any, reason: any) {
    if (reason === 'toggleInput') {
      return;
    }
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
    setSearchValue('');
  }

  function handleResetSelectForm(): void {
    onMetricsSelectChange([]);
    onSelectRunQueryChange('');
    onSelectAdvancedQueryChange('');
  }

  function handleSearchInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setSearchValue(e.target.value);
  }

  const options = React.useMemo(() => {
    if (isRegexSearch) {
      try {
        const regex = new RegExp(searchValue, 'i');
        setRegexError(null);
        return (
          selectFormData?.options?.filter((option) =>
            regex.test(option.label),
          ) ?? []
        );
      } catch (error) {
        setRegexError('Invalid Regex');
        return [];
      }
    } else {
      return (
        selectFormData?.options?.filter(
          (option) => option.label.indexOf(searchValue) !== -1,
        ) ?? []
      );
    }
  }, [searchValue, selectFormData?.options, isRegexSearch]);

  const open: boolean = !!anchorEl;
  const id = open ? 'select-metric' : undefined;
  return (
    <ErrorBoundary>
      <div className='Metrics__SelectForm'>
        <div className='Metrics__SelectForm__container__metrics'>
          <Box
            width='100%'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            {selectedMetricsData?.advancedMode ? (
              <div className='Metrics__SelectForm__textarea'>
                <AutocompleteInput
                  advanced
                  error={selectFormData.advancedError}
                  refObject={advancedAutocompleteRef}
                  context={selectFormData?.advancedSuggestions}
                  value={selectedMetricsData?.advancedQuery}
                  onEnter={handleMetricSearch}
                  disabled={isDisabled}
                />
              </div>
            ) : (
              <>
                <Box display='flex' alignItems='center'>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleClick}
                    aria-describedby={id}
                    disabled={isDisabled}
                  >
                    <Icon name='plus' style={{ marginRight: '0.5rem' }} />
                    Metrics
                  </Button>
                  <SelectFormPopper
                    id={id}
                    type='metrics'
                    open={open}
                    anchorEl={anchorEl}
                    options={options}
                    selectedData={selectedMetricsData}
                    onSelect={onSelect}
                    searchValue={searchValue}
                    handleSearchInputChange={handleSearchInputChange}
                    handleClose={handleClose}
                    regexError={regexError}
                    setRegexError={setRegexError}
                    isRegexSearch={isRegexSearch}
                    setIsRegexSearch={setIsRegexSearch}
                    className='Metrics__SelectForm__Popper'
                    classes={classes}
                  />
                  <Divider
                    style={{ margin: '0 1rem' }}
                    orientation='vertical'
                    flexItem
                  />
                  {selectedMetricsData?.options.length === 0 && (
                    <Text tint={50} size={14} weight={400}>
                      No metrics are selected
                    </Text>
                  )}
                  <Box
                    className='Metrics__SelectForm__tags ScrollBar__hidden'
                    flex={1}
                  >
                    {selectedMetricsData?.options?.map((tag: ISelectOption) => {
                      return (
                        <Badge
                          size='large'
                          key={tag.label}
                          label={tag.label}
                          value={tag.key}
                          onDelete={handleDelete}
                          disabled={isDisabled}
                        />
                      );
                    })}
                  </Box>
                </Box>
                {selectedMetricsData?.options &&
                  selectedMetricsData.options.length > 1 && (
                    <Button
                      onClick={() => onMetricsSelectChange([])}
                      withOnlyIcon
                      className={classNames('Metrics__SelectForm__clearAll', {
                        disabled: isDisabled,
                      })}
                      size='xSmall'
                      disabled={isDisabled}
                    >
                      <Icon name='close' />
                    </Button>
                  )}
              </>
            )}
          </Box>
          {selectedMetricsData?.advancedMode ? null : (
            <div className='Metrics__SelectForm__TextField'>
              <AutocompleteInput
                refObject={autocompleteRef}
                error={selectFormData.error}
                value={selectedMetricsData?.query}
                context={selectFormData.suggestions}
                onEnter={handleMetricSearch}
                disabled={isDisabled}
              />
            </div>
          )}
        </div>
        <div className='Metrics__SelectForm__container__search'>
          <Button
            fullWidth
            key={`${requestIsPending}`}
            color='primary'
            variant={requestIsPending ? 'outlined' : 'contained'}
            startIcon={
              <Icon
                name={requestIsPending ? 'close' : 'search'}
                fontSize={requestIsPending ? 12 : 14}
              />
            }
            className='Metrics__SelectForm__search__button'
            onClick={requestIsPending ? handleRequestAbort : handleMetricSearch}
          >
            {requestIsPending ? 'Cancel' : 'Search'}
          </Button>
          <div className='Metrics__SelectForm__search__actions'>
            <Tooltip title='Reset query'>
              <div>
                <Button
                  onClick={handleResetSelectForm}
                  withOnlyIcon={true}
                  disabled={isDisabled}
                >
                  <Icon name='reset' />
                </Button>
              </div>
            </Tooltip>
            <Tooltip
              title={
                selectedMetricsData?.advancedMode
                  ? 'Switch to default mode'
                  : 'Enable advanced search mode '
              }
            >
              <div>
                <Button
                  className={selectedMetricsData?.advancedMode ? 'active' : ''}
                  withOnlyIcon={true}
                  onClick={toggleEditMode}
                  disabled={isDisabled}
                >
                  <Icon name='edit' />
                </Button>
              </div>
            </Tooltip>
            <Tooltip title='Copy search query'>
              <div>
                <Button
                  onClick={onSearchQueryCopy}
                  withOnlyIcon={true}
                  disabled={isDisabled}
                >
                  <Icon name='copy' />
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(SelectForm);
