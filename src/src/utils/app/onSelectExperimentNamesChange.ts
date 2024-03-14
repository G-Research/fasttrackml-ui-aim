import { IModel, State } from 'types/services/models/model';

import { setItem } from 'utils/storage';

import { getSelectedExperimentNames } from './getSelectedExperimentNames';

export default function onSelectExperimentNamesChange<M extends State>({
  experimentName,
  model,
}: {
  experimentName: string;
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;
  const selectedExperimentNames = getSelectedExperimentNames();

  // If the experiment is already selected, remove it from the list
  // Otherwise, add it
  const index = selectedExperimentNames.indexOf(experimentName);

  if (index > -1) {
    selectedExperimentNames.splice(index, 1);
  } else {
    selectedExperimentNames.push(experimentName);
  }

  if (selectedExperimentNames.length === 0) {
    setItem('selectedExperimentNames', '');
  } else {
    setItem('selectedExperimentNames', selectedExperimentNames);
  }

  if (configData?.select) {
    const newConfig = {
      ...configData,
      select: { ...configData.select, selectedExperimentNames },
    };
    model.setState({ config: newConfig });
  }
}
