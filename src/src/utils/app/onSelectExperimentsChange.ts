import { IExperimentDataShort } from 'modules/core/api/experimentsApi';

import { IModel, State } from 'types/services/models/model';

import { setItem } from 'utils/storage';

import { getSelectedExperiments } from './getSelectedExperiments';

export default function onSelectExperimentChange<M extends State>({
  experiment,
  model,
}: {
  experiment: IExperimentDataShort;
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;
  const selectedExperiments = getSelectedExperiments();

  const index = selectedExperiments.findIndex((e) => e.id === experiment.id);

  // If the experiment is already selected, remove it from the list
  // Otherwise, add it
  if (index !== -1) {
    selectedExperiments.splice(index, 1);
  } else {
    selectedExperiments.push(experiment);
  }

  if (selectedExperiments.length === 0) {
    setItem('selectedExperiments', '[]');
  } else {
    setItem('selectedExperiments', JSON.stringify(selectedExperiments));
  }

  const selectedExperimentNames = selectedExperiments.map((e) => e.name);

  if (configData?.select) {
    const newConfig = {
      ...configData,
      select: {
        ...configData.select,
        selectedExperimentNames,
      },
    };
    model.setState({ config: newConfig });
  }
}
