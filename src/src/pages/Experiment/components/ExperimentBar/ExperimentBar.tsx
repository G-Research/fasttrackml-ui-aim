import React from 'react';
import classNames from 'classnames';

import { Skeleton } from '@material-ui/lab';
import { Tooltip } from '@material-ui/core';

import { Button, Icon, Text } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import ExperimentSelectionPopover from '../ExperimentSelectionPopover';

import { IExperimentBarProps } from '.';

import './ExperimentBar.scss';

function ExperimentBar({
  isExperimentLoading,
  experimentData,
  isExperimentsLoading,
  experimentsData,
  selectedExperimentNames,
  getExperimentsData,
  onSelectExperimentNamesChange,
}: IExperimentBarProps): React.FunctionComponentElement<React.ReactNode> {
  return (
    <ErrorBoundary>
      <div className='ExperimentBar__headerContainer compact'>
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
                        <Tooltip title={`${experimentData?.name || 'default'}`}>
                          <div className='ExperimentBar__headerContainer__appBarTitleBox__container'>
                            <Text
                              tint={100}
                              size={16}
                              weight={600}
                              className='ExperimentBar__headerContainer__appBarTitleBox__title'
                            >
                              {`${experimentData?.name || 'default'}`}
                            </Text>
                          </div>
                        </Tooltip>

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
                      </div>
                    </>
                  ) : (
                    <div className='flex'>
                      <Skeleton
                        className='ExperimentBar__headerContainer__appBarTitleBox__Skeleton'
                        variant='rect'
                        height={24}
                        width={340}
                      />
                      <Skeleton variant='rect' height={24} width={70} />
                    </div>
                  )}
                </div>
              )}
              component={
                <ExperimentSelectionPopover
                  isExperimentsLoading={isExperimentsLoading}
                  experimentsData={experimentsData}
                  selectedExperimentNames={selectedExperimentNames}
                  getExperimentsData={getExperimentsData}
                  onSelectExperimentNamesChange={onSelectExperimentNamesChange}
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
