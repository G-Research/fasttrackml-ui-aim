import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import ToggleButton from '@material-ui/lab/ToggleButton';
import { Button, Checkbox, InputBase, Tooltip } from '@material-ui/core';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

  function shortenExperimentName(name?: string): string {
    if (!name) {
      return 'default';
    } else if (name.length > 56) {
      // Slice the name in the middle
      return `${name.slice(0, 27)}...${name.slice(-26)}`;
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
      handleRegexSearch(e.target.value);
    } else {
      handleSimpleSearch(e.target.value);
    }
  }

  function handleRegexSearch(search: string): void {
    try {
      const regex = new RegExp(search, 'i');
      setInvalidRegex(false);
      const options = experimentsData?.filter((experiment) =>
        regex.test(experiment.name),
      );
      setVisibleExperiments(options || []);
    } catch (error) {
      setInvalidRegex(true);
    }
  }

  function handleSimpleSearch(search: string): void {
    setInvalidRegex(false);
    const options = experimentsData?.filter((experiment) =>
      experiment.name.toLowerCase().includes(search.toLowerCase()),
    );
    setVisibleExperiments(options || []);
  }

  function toggleAllExperiments(checked: boolean): void {
    const visibleExperimentNames = visibleExperiments?.map(
      (experiment) => experiment.name,
    );
    // If all experiments are selected, deselect all
    // otherwise, select all that are unselected
    if (checked) {
      onToggleAllExperiments(visibleExperimentNames);
    } else {
      const unselectedExperiments = visibleExperimentNames?.filter(
        (experimentName) => !selectedExperimentNames.includes(experimentName),
      );
      onToggleAllExperiments(unselectedExperiments);
    }
  }

  function allExperimentsSelected(): boolean {
    return (
      visibleExperiments.length > 0 &&
      visibleExperiments.every((experiment) =>
        selectedExperimentNames.includes(experiment.name),
      )
    );
  }

  return (
    <ErrorBoundary>
      <div className='ExperimentSelectionPopover'>
        <div className='ExperimentSelectionPopover__headerContainer'>
          <div className='ExperimentSelectionPopover__headerContainer__titleContainer'>
            <Text size={14} tint={100} weight={700}>
              Experiments
            </Text>
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
                <Tooltip
                  title={
                    allExperimentsSelected()
                      ? 'Deselect all visible'
                      : 'Select all visible'
                  }
                >
                  <Checkbox
                    color='primary'
                    icon={<CheckBoxOutlineBlank />}
                    checkedIcon={<CheckBoxIcon />}
                    checked={allExperimentsSelected()}
                    onChange={() => {
                      const checked = allExperimentsSelected();
                      toggleAllExperiments(checked);
                    }}
                    size='small'
                  />
                </Tooltip>

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

                      if (!isRegexSearch) {
                        handleRegexSearch(searchValue);
                      } else {
                        handleSimpleSearch(searchValue);
                      }
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
                    <div className='experimentBox__leftContainer'>
                      <Checkbox
                        color='primary'
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBoxIcon />}
                        checked={experimentInList(
                          experiment.name,
                          selectedExperimentNames,
                        )}
                        size='small'
                        className='experimentBox__checkbox'
                      />
                    </div>
                    <div className='experimentBox__rightContainer'>
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
