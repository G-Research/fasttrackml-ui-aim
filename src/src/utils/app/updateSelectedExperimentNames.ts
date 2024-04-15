import { IModel, State } from 'types/services/models/model';

import { setItem } from 'utils/storage';

import { getSelectedExperimentNames } from './getSelectedExperimentNames';

export default function updateSelectedExperimentNames<M extends State>({
  model,
}: {
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;
  const selectedExperimentNames = getSelectedExperimentNames();
  console.log(selectedExperimentNames);
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
