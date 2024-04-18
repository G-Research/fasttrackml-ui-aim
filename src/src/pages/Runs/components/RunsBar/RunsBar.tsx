import React from 'react';

import { MenuItem } from '@material-ui/core';

import AppBar from 'components/AppBar/AppBar';
import LiveUpdateSettings from 'components/LiveUpdateSettings/LiveUpdateSettings';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Button, Icon } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';

import pageTitlesEnum from 'config/pageTitles/pageTitles';
import { DOCUMENTATIONS } from 'config/references';

import { IResourceState } from 'modules/core/utils/createResource';
import { IExperimentData } from 'modules/core/api/experimentsApi';

import createExperimentEngine from 'pages/Dashboard/components/ExploreSection/ExperimentsCard/ExperimentsStore';
import ExperimentBar from 'pages/Experiment/components/ExperimentBar';
import useExperimentState from 'pages/Experiment/useExperimentState';

import { getSelectedExperimentNames } from 'utils/app/getSelectedExperimentNames';
import onSelectExperimentNamesChange from 'utils/app/onSelectExperimentNamesChange';
import onToggleAllExperiments from 'utils/app/onToggleAllExperiments';

import 'pages/Metrics/components/MetricsBar/MetricsBar.scss';

function RunsBar(props: {
  enabled: boolean;
  delay: number;
  onLiveUpdateConfigChange: () => void;
  disabled: boolean;
  onSelectExperimentNamesChange: (experimentName: string) => void;
  onToggleAllExperiments: (experimentNames: string[]) => void;
}): React.FunctionComponentElement<React.ReactNode> {
  const { current: experimentsEngine } = React.useRef(createExperimentEngine);

  const experimentsStore: IResourceState<IExperimentData[]> =
    experimentsEngine.experimentsState((state) => state);

  React.useEffect(() => {
    experimentsEngine.fetchExperiments();
    return () => {
      experimentsEngine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedExperimentNames, setSelectedExperimentNames] = React.useState<
    string[]
  >(getSelectedExperimentNames());

  // Fetch all experiments along with default
  const { experimentState, experimentsState, getExperimentsData } =
    useExperimentState(experimentsStore.data?.[0]?.id);

  const { data: experimentData, loading: isExperimentLoading } =
    experimentState;

  const { data: experimentsData, loading: isExperimentsLoading } =
    experimentsState;

  function handleExperimentNamesChange(experimentName: string): void {
    onSelectExperimentNamesChange(experimentName);
    setSelectedExperimentNames(getSelectedExperimentNames());
  }

  return (
    <ErrorBoundary>
      <AppBar title={pageTitlesEnum.RUNS_EXPLORER} disabled={props.disabled}>
        <ExperimentBar
          experimentsData={experimentsData}
          isExperimentLoading={isExperimentLoading}
          isExperimentsLoading={isExperimentsLoading}
          selectedExperimentNames={selectedExperimentNames}
          getExperimentsData={getExperimentsData}
          onSelectExperimentNamesChange={handleExperimentNamesChange}
          onToggleAllExperiments={onToggleAllExperiments}
        />
        <LiveUpdateSettings {...props} />
        <div className='MetricsBar__menu'>
          <ErrorBoundary>
            <ControlPopover
              title='Menu'
              anchor={({ onAnchorClick }) => (
                <Button
                  withOnlyIcon
                  color='secondary'
                  size='small'
                  onClick={onAnchorClick}
                >
                  <Icon
                    fontSize={16}
                    name='menu'
                    className='MetricsBar__item__bookmark__Icon'
                  />
                </Button>
              )}
              component={
                <div className='MetricsBar__popover'>
                  <a
                    href={DOCUMENTATIONS.EXPLORERS.RUNS.MAIN}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <MenuItem>Explorer Documentation</MenuItem>
                  </a>
                </div>
              }
            />
          </ErrorBoundary>
        </div>
      </AppBar>
    </ErrorBoundary>
  );
}

export default React.memo(RunsBar);
