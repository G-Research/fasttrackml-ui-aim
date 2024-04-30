import { IExperimentDataShort } from 'modules/core/api/experimentsApi';

import { IModel, State } from 'types/services/models/model';

import onSelectExperimentsChange from './onSelectExperimentsChange';

export default function onToggleAllExperiments<M extends State>({
  experiments,
  model,
}: {
  experiments: IExperimentDataShort[];
  model: IModel<M>;
}) {
  // jescalada: TODO: This should be refactored to avoid calling onSelectExperimentsChange multiple times
  // Toggle all experiments in list one by one
  experiments.forEach((experiment) => {
    onSelectExperimentsChange({ experiment, model });
  });
}
