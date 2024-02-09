import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { Button } from '@material-ui/core';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Icon, Spinner, Text } from 'components/kit';

import { DATE_WITH_SECONDS } from 'config/dates/dates';

import { IExperimentNavigationPopoverCompactProps } from './ExperimentNavigationPopover';

import './ExperimentNavigationPopoverCompact.scss';

function ExperimentNavigationPopoverCompact({
  experimentsData,
  experimentId,
  isExperimentsLoading,
  getExperimentsData,
  onExperimentChange,
}: IExperimentNavigationPopoverCompactProps): React.FunctionComponentElement<React.ReactNode> {
  React.useEffect(() => {
    if (!experimentsData) {
      getExperimentsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className='ExperimentNavigationPopover'>
        <div className='ExperimentNavigationPopover__headerContainer'>
          <div className='ExperimentNavigationPopover__headerContainer__titleContainer'>
            <Text size={14} tint={100} weight={700}>
              Experiments
            </Text>
          </div>
        </div>
        <div className='ExperimentNavigationPopover__contentContainer'>
          <div className='ExperimentNavigationPopover__contentContainer__experimentsListContainer'>
            <div className='ExperimentNavigationPopover__contentContainer__experimentsListContainer__experimentList ScrollBar__hidden'>
              {!isExperimentsLoading ? (
                experimentsData?.map((experiment) => (
                  <Button
                    key={experiment.id}
                    onClick={() => onExperimentChange(experiment.id)}
                    className={classNames('experimentBox', {
                      selected: experimentId === experiment.id,
                    })}
                  >
                    <Text
                      size={16}
                      tint={experimentId === experiment.id ? 100 : 80}
                      weight={500}
                      className='experimentBox__experimentName'
                    >
                      {experiment?.name ?? 'default'}
                    </Text>
                    <div className='experimentBox__date'>
                      <Icon
                        name='calendar'
                        color={
                          experimentId === experiment.id ? '#414B6D' : '#606986'
                        }
                        fontSize={12}
                      />
                      <Text
                        size={14}
                        tint={experimentId === experiment.id ? 80 : 70}
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
                <div className='ExperimentNavigationPopover__loaderContainer'>
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
export default ExperimentNavigationPopoverCompact;
