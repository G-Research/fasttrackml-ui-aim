import React from 'react';
import classNames from 'classnames';

import { Skeleton } from '@material-ui/lab';
import { Chip, Tooltip } from '@material-ui/core';

import { Button, Icon, Text } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import ExperimentSelectionPopover from '../ExperimentSelectionPopover';

import { IExperimentBarProps } from '.';

import './ExperimentBar.scss';

function ExperimentBar({
  isExperimentLoading,
  isExperimentsLoading,
  experimentsData,
  selectedExperimentNames,
  getExperimentsData,
  onSelectExperimentNamesChange,
  onToggleAllExperiments,
}: IExperimentBarProps): React.FunctionComponentElement<React.ReactNode> {
  function shortenExperimentName(name?: string): string {
    if (!name) {
      return 'default';
    } else if (name.length > 18) {
      return `${name.slice(0, 8)}...${name.slice(-8)}`;
    }
    return name;
  }

  // Selected experiments are the ones that are checked
  const [selectedExperiments, setSelectedExperiments] = React.useState<
    string[]
  >(selectedExperimentNames);

  // Update selected experiments in UI when selectedExperimentNames change
  React.useEffect(() => {
    setSelectedExperiments(selectedExperimentNames);
  }, [selectedExperimentNames]);

  return (
    <ErrorBoundary>
      <div className='ExperimentBar__headerContainer'>
        <div className='container ExperimentBar__headerContainer__appBarBox'>
          <div className='ExperimentBar__headerContainer__appBarBox__navigationContainer'>
            <ControlPopover
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              anchor={({ onAnchorClick, opened }) => (
                <div
                  className='ExperimentBar__headerContainer__appBarTitleBox'
                  onClick={onAnchorClick}
                >
                  {!isExperimentLoading ? (
                    <>
                      <div className='ExperimentBar__headerContainer__appBarTitleBox__appBarTitleBoxWrapper'>
                        <Button
                          disabled={isExperimentLoading}
                          color={opened ? 'primary' : 'default'}
                          size='xSmall'
                          className={classNames(
                            'ExperimentBar__headerContainer__appBarTitleBox__buttonSelectToggler',
                            { opened: opened },
                          )}
                          withOnlyIcon
                        >
                          <Icon name={opened ? 'arrow-up' : 'arrow-down'} />
                        </Button>

                        {selectedExperiments.length === 0 ? (
                          <Text className='ExperimentBar__headerContainer__appBarTitleBox__text'>
                            Select Experiments
                          </Text>
                        ) : null}

                        <div className='ExperimentBar__headerContainer__appBarTitleBox__chipContainer'>
                          {selectedExperiments.map((experimentName) => (
                            <Tooltip
                              key={experimentName}
                              title={experimentName}
                            >
                              <Chip
                                className='ExperimentBar__headerContainer__appBarTitleBox__chipContainer__chip'
                                variant='outlined'
                                size='small'
                                label={shortenExperimentName(experimentName)}
                                onDelete={() =>
                                  onSelectExperimentNamesChange(experimentName)
                                }
                              />
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='flex'>
                      <Skeleton
                        className='ExperimentBar__headerContainer__appBarTitleBox__Skeleton'
                        variant='rect'
                        height={24}
                        width={160}
                      />
                    </div>
                  )}
                </div>
              )}
              component={
                <ExperimentSelectionPopover
                  isExperimentsLoading={isExperimentsLoading}
                  experimentsData={experimentsData}
                  selectedExperiments={selectedExperiments}
                  setSelectedExperiments={setSelectedExperiments}
                  getExperimentsData={getExperimentsData}
                  onSelectExperimentNamesChange={onSelectExperimentNamesChange}
                  onToggleAllExperiments={onToggleAllExperiments}
                />
              }
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
export default ExperimentBar;
