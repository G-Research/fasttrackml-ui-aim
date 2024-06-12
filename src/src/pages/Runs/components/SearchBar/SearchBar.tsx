import React from 'react';
import classNames from 'classnames';

import { Divider } from '@material-ui/core';

import { Button, Icon } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import AutocompleteInput from 'components/AutocompleteInput';

import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import runAppModel from 'services/models/runs/runsAppModel';
import { trackEvent } from 'services/analytics';

import exceptionHandler from 'utils/app/exceptionHandler';
import { getSelectedExperiments } from 'utils/app/getSelectedExperiments';

import './SearchBar.scss';

function SearchBar({
  selectFormData,
  isRunsDataLoading,
  searchValue,
  onSearchInputChange,
  isDisabled,
}: any) {
  const searchRunsRef = React.useRef<any>(null);
  const autocompleteRef: any = React.useRef<React.MutableRefObject<any>>(null);
  React.useEffect(() => {
    return () => {
      searchRunsRef.current?.abort();
    };
  }, []);

  const selectedExperimentCount = getSelectedExperiments().length;
  let isSearchDisabled = selectedExperimentCount === 0;
  const handleRunSearch = React.useCallback(() => {
    if (isRunsDataLoading) {
      return;
    }
    const query = autocompleteRef?.current?.getValue();
    onSearchInputChange(query ?? '');
    searchRunsRef.current = runAppModel.getRunsData(
      true,
      true,
      true,
      query ?? '',
    );
    searchRunsRef.current
      .call((detail: any) => {
        exceptionHandler({ detail, model: runAppModel });
      })
      .catch();
    trackEvent(ANALYTICS_EVENT_KEYS.runs.searchClick);
  }, [isRunsDataLoading, onSearchInputChange]);

  function handleRequestAbort(e: React.SyntheticEvent): void {
    e.preventDefault();
    if (!isRunsDataLoading) {
      return;
    }
    searchRunsRef.current?.abort();
    runAppModel.abortRequest();
  }
  return (
    <ErrorBoundary>
      <div className='Runs_Search_Bar'>
        <form onSubmit={handleRunSearch}>
          <AutocompleteInput
            refObject={autocompleteRef}
            onEnter={handleRunSearch}
            error={selectFormData.error}
            context={selectFormData.suggestions}
            value={searchValue}
            disabled={isDisabled}
          />
        </form>
        <Divider style={{ margin: '0 1em' }} orientation='vertical' flexItem />
        <Button
          className={classNames('Runs__SearchBar__button', {
            disabled: isSearchDisabled,
          })}
          disabled={isSearchDisabled}
          color='primary'
          onClick={isRunsDataLoading ? handleRequestAbort : handleRunSearch}
          variant={isRunsDataLoading ? 'outlined' : 'contained'}
          startIcon={
            <Icon
              name={isRunsDataLoading ? 'close' : 'search'}
              fontSize={isRunsDataLoading ? 12 : 14}
            />
          }
        >
          {isRunsDataLoading ? 'Cancel' : 'Search'}
        </Button>
      </div>
    </ErrorBoundary>
  );
}

export default SearchBar;
