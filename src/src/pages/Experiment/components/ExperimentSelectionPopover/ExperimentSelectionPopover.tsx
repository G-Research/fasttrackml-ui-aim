import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import ToggleButton from '@material-ui/lab/ToggleButton';
import { Button, Checkbox, InputBase, Link, Tooltip } from '@material-ui/core';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Icon, Spinner, Text } from 'components/kit';

import { DATE_WITH_SECONDS } from 'config/dates/dates';
import { getBaseHost } from 'config/config';

import {
  IExperimentData,
  IExperimentDataShort,
} from 'modules/core/api/experimentsApi';

import namespacesService from 'services/api/namespaces/namespacesService';

import { IExperimentSelectionPopoverProps } from '.';

import './ExperimentSelectionPopover.scss';

function ExperimentSelectionPopover({
  experimentsData,
  selectedExperiments,
  isExperimentsLoading,
  getExperimentsData,
  setSelectedExperiments,
  onSelectExperimentsChange,
  onToggleAllExperiments,
}: IExperimentSelectionPopoverProps): React.FunctionComponentElement<React.ReactNode> {
  React.useEffect(() => {
    if (!experimentsData) {
      getExperimentsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [isRegexSearch, setIsRegexSearch] = React.useState(false);
  const [invalidRegex, setInvalidRegex] = React.useState<boolean>(false);

  // Visible experiments are the ones that match the search query
  const [visibleExperiments, setVisibleExperiments] = React.useState<
    IExperimentData[]
  >([]);

  const [selectedNamespace, setSelectedNamespace] = React.useState<string>('');
  React.useEffect(() => {
    namespacesService.fetchCurrentNamespacePath().then((data) => {
      setSelectedNamespace(data);
    });
  }, []);

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

  function handleExperimentClick(experiment: IExperimentDataShort): void {
    // Update model
    onSelectExperimentsChange(experiment);

    // Update view
    if (selectedExperiments.some((e) => e.id === experiment.id)) {
      setSelectedExperiments(
        selectedExperiments.filter((e) => e.name !== experiment.name),
      );
    } else {
      setSelectedExperiments([...selectedExperiments, experiment]);
    }
  }

  function experimentIsSelected(experiment: IExperimentDataShort): boolean {
    return selectedExperiments.some(
      (selectedExperiment) => selectedExperiment.id === experiment.id,
    );
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
    // If all experiments are selected, deselect all
    // otherwise, select all that are unselected
    if (checked) {
      // Update model
      onToggleAllExperiments(visibleExperiments);

      // Update view
      setSelectedExperiments(
        selectedExperiments.filter(
          (experiment) =>
            !visibleExperiments.some((e) => e.id === experiment.id),
        ),
      );
    } else {
      // Update model
      const unselectedExperiments = visibleExperiments?.filter(
        (experiment) =>
          !selectedExperiments.some((e) => e.id === experiment.id),
      );
      onToggleAllExperiments(unselectedExperiments);

      // Update view
      setSelectedExperiments([
        ...selectedExperiments,
        ...unselectedExperiments,
      ]);
    }
  }

  function allExperimentsSelected(): boolean {
    // Create a set of selected experiment IDs
    const selectedExperimentIds = new Set(
      selectedExperiments.map((experiment) => experiment.id),
    );

    // Check if all visible experiments are selected by their IDs
    return (
      visibleExperiments.length > 0 &&
      visibleExperiments.every((experiment) =>
        selectedExperimentIds.has(experiment.id),
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
                  autoFocus={true}
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
                    onClick={() => handleExperimentClick(experiment)}
                    className={classNames('experimentBox', {
                      selected: experimentIsSelected(experiment),
                    })}
                  >
                    <div className='experimentBox__leftContainer'>
                      <Checkbox
                        color='primary'
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBoxIcon />}
                        checked={experimentIsSelected(experiment)}
                        size='small'
                        className='experimentBox__checkbox'
                      />
                    </div>
                    <div className='experimentBox__rightContainer'>
                      <Text
                        size={16}
                        tint={experimentIsSelected(experiment) ? 100 : 80}
                        weight={500}
                        className='experimentBox__experimentName'
                      >
                        {shortenExperimentName(experiment?.name)}
                      </Text>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <div className='experimentBox__date'>
                          <Icon
                            name='calendar'
                            color={
                              experimentIsSelected(experiment)
                                ? '#414B6D'
                                : '#606986'
                            }
                            fontSize={12}
                          />
                          <Text
                            size={14}
                            tint={experimentIsSelected(experiment) ? 80 : 70}
                            weight={500}
                          >
                            {`${moment(experiment.creation_time * 1000).format(
                              DATE_WITH_SECONDS,
                            )}`}
                          </Text>
                        </div>
                        <Link
                          href={
                            getBaseHost() +
                            selectedNamespace +
                            '/mlflow/#/experiments/' +
                            experiment.id
                          }
                          target='_blank'
                          onClick={(e) => e.stopPropagation()}
                          style={{ marginLeft: '1rem' }}
                        >
                          <div style={{ fontSize: '0.8rem' }}>
                            <Icon
                              name='live-demo'
                              style={{ marginRight: '0.3rem' }}
                            />
                            Open in Classic UI
                          </div>
                        </Link>
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
