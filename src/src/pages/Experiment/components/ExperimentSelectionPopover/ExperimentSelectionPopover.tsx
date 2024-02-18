import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { Button } from '@material-ui/core';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Icon, Spinner, Text } from 'components/kit';

import { DATE_WITH_SECONDS } from 'config/dates/dates';

import { IExperimentSelectionPopoverProps } from '.';

import './ExperimentSelectionPopover.scss';

function ExperimentSelectionPopover({
  experimentsData,
  selectedExperimentNames,
  isExperimentsLoading,
  getExperimentsData,
  onSelectExperimentNamesChange,
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
              {!isExperimentsLoading ? (
                experimentsData?.map((experiment) => (
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
