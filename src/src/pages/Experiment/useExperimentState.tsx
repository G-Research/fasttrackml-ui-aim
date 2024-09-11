import React from 'react';

import { IResourceState } from 'modules/core/utils/createResource';
import { IExperimentData } from 'modules/core/api/experimentsApi';

import { getSelectedExperiments } from 'utils/app/getSelectedExperiments';
import onSelectExperimentChange from 'utils/app/onSelectExperimentsChange';

import experimentEngine from './ExperimentStore';

function useExperimentState(experimentId?: string) {
  const { current: engine } = React.useRef(experimentEngine);
  const experimentState: IResourceState<IExperimentData> =
    engine.experimentState((state) => state);
  const experimentsState: IResourceState<IExperimentData[]> =
    engine.experimentsState((state) => state);

  React.useEffect(() => {
    return () => {
      engine.destroyExperiment();
      engine.destroyExperiments();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (experimentId) {
      engine.fetchExperimentData(experimentId as any);
    } else {
      // Fetch the default experiment in the namespace
      engine.fetchExperimentsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  if (!experimentsState.loading) {
    // Remove selected experiments that are not in the list of fetched experiments
    const selectedExperiments = getSelectedExperiments();
    selectedExperiments.forEach((experiment) => {
      if (
        !experimentsState.data?.find(
          (fetchedExperiment) => fetchedExperiment.id === experiment.id,
        )
      ) {
        onSelectExperimentChange(experiment);
      }
    });
  }

  return {
    experimentState,
    experimentsState,
    selectedExperiments: getSelectedExperiments(),
    getExperimentsData: engine.fetchExperimentsData,
    updateExperiment: engine.updateExperiment,
    deleteExperiment: engine.deleteExperiment,
  };
}

export default useExperimentState;
