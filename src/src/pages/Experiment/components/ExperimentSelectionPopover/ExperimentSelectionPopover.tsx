import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import ToggleButton from '@material-ui/lab/ToggleButton';
import { Button, InputBase, Tooltip } from '@material-ui/core';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Icon, Spinner, Text } from 'components/kit';

import { DATE_WITH_SECONDS } from 'config/dates/dates';

import { IExperimentData } from 'modules/core/api/experimentsApi';

import { IExperimentSelectionPopoverProps } from '.';

import './ExperimentSelectionPopover.scss';

function ExperimentSelectionPopover({
  experimentsData,
  selectedExperimentNames,
  isExperimentsLoading,
  getExperimentsData,
  onSelectExperimentNamesChange,
  onToggleAllExperiments,
}: IExperimentSelectionPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  React.useEffect(() => {
    if (!experimentsData) {
      getExperimentsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add forceUpdate to force re-render (to update selected experiments)
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [isRegexSearch, setIsRegexSearch] = React.useState(false);
  const [invalidRegex, setInvalidRegex] = React.useState<boolean>(false);
  const [visibleExperiments, setVisibleExperiments] = React.useState<
    IExperimentData[]
  >([]);

  React.useEffect(() => {
    setVisibleExperiments(experimentsData || []);
  }, [experimentsData]);

  // TODO: Add shortening in the middle rather than at the end
  function shortenExperimentName(name?: string): string {
    if (!name) {
      return 'default';
    } else if (name.length > 57) {
      return `${name.slice(0, 57)}...`;
    }
    return name;
  }

  function handleExperimentClick(experimentName: string): void {
    onSelectExperimentNamesChange(experimentName);
    // TODO: Figure out a better way to re-render
    forceUpdate();
  }

  function experimentInList(
    experimentName: string,
    selectedExperimentNames: string[],
  ): boolean {
    return selectedExperimentNames.includes(experimentName);
  }

  function handleSearchInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setSearchValue(e.target.value);

    if (isRegexSearch) {
      try {
        const regex = new RegExp(e.target.value, 'i');
        setInvalidRegex(false);
        const options = experimentsData?.filter((experiment) =>
          regex.test(experiment.name),
        );
        setVisibleExperiments(options || []);
      } catch (error) {
        setInvalidRegex(true);
      }
    } else {
      const options = experimentsData?.filter((experiment) =>
        experiment.name.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setVisibleExperiments(options || []);
    }
  }

  function selectAllExperiments() {
    const allExperimentNames = experimentsData?.map(
      (experiment) => experiment.name,
    );
    onToggleAllExperiments(allExperimentNames || []);
  }

  function removeAllExperiments() {
    onToggleAllExperiments([]);
  }

  return (
    <ErrorBoundary>
      <div className='ExperimentSelectionPopover'>
        <div className='ExperimentSelectionPopover__headerContainer'>
          <div className='ExperimentSelectionPopover__headerContainer__titleContainer'>
            <Text size={14} tint={100} weight={700}>
              Experiments
            </Text>
            <div className='ExperimentSelectionPopover__headerContainer__buttons'>
              <Button
                onClick={selectAllExperiments}
                className='ExperimentSelectionPopover__headerContainer__selectAllButton'
              >
                <Text size={12} tint={5} weight={500}>
                  Select All
                </Text>
              </Button>
              <Button
                onClick={removeAllExperiments}
                className='ExperimentSelectionPopover__headerContainer__removeAllButton'
                size='small'
              >
                <Text size={12} tint={5} weight={500}>
                  Remove All
                </Text>
              </Button>
            </div>
          </div>
        </div>
        <div className='ExperimentSelectionPopover__contentContainer'>
          <div className='ExperimentSelectionPopover__contentContainer__experimentsListContainer'>
            <div className='ExperimentSelectionPopover__contentContainer__experimentsListContainer__experimentList ScrollBar__hidden'>
              <div
                className={
                  invalidRegex
                    ? 'ExperimentSelectionPopover__searchContainer error'
                    : 'ExperimentSelectionPopover__searchContainer'
                }
              >
                <InputBase
                  placeholder='Search'
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  inputProps={{ 'aria-label': 'search' }}
                  className='ExperimentSelectionPopover__searchContainer__inputBase'
                />
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
              {!isExperimentsLoading ? (
                visibleExperiments?.map((experiment) => (
                  <Button
                    key={experiment.id}
                    onClick={() => handleExperimentClick(experiment.name)}
                    className={classNames('experimentBox', {
                      selected: experimentInList(
                        experiment.name,
                        selectedExperimentNames,
                      ),
                    })}
                  >
                    <Text
                      size={16}
                      tint={
                        experimentInList(
                          experiment.name,
                          selectedExperimentNames,
                        )
                          ? 100
                          : 80
                      }
                      weight={500}
                      className='experimentBox__experimentName'
                    >
                      {shortenExperimentName(experiment?.name)}
                    </Text>
                    <div className='experimentBox__date'>
                      <Icon
                        name='calendar'
                        color={
                          experimentInList(
                            experiment.name,
                            selectedExperimentNames,
                          )
                            ? '#414B6D'
                            : '#606986'
                        }
                        fontSize={12}
                      />
                      <Text
                        size={14}
                        tint={
                          experimentInList(
                            experiment.name,
                            selectedExperimentNames,
                          )
                            ? 80
                            : 70
                        }
                        weight={500}
                      >
                        {`${moment(experiment.creation_time * 1000).format(
                          DATE_WITH_SECONDS,
                        )}`}
                      </Text>
                    </div>
                  </Button>
                ))
              ) : (
                <div className='ExperimentSelectionPopover__loaderContainer'>
                  <Spinner size={34} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
export default ExperimentSelectionPopover;
