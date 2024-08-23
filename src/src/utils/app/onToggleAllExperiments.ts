import { IExperimentDataShort } from 'modules/core/api/experimentsApi';

import onSelectExperimentsChange from './onSelectExperimentsChange';

export default function onToggleAllExperiments(
  experiments: IExperimentDataShort[],
) {
  // jescalada: TODO: This should be refactored to avoid calling onSelectExperimentsChange multiple times
  // Toggle all experiments in list one by one
  experiments.forEach((experiment) => {
    onSelectExperimentsChange(experiment);
  });
}
