import { IModel, State } from 'types/services/models/model';

import { setItem } from 'utils/storage';

export default function onToggleAllExperiments<M extends State>({
  experimentNames,
  model,
}: {
  experimentNames: string[];
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;

  if (experimentNames.length === 0) {
    setItem('selectedExperimentNames', '');
  } else {
    setItem('selectedExperimentNames', experimentNames);
  }

  if (configData?.select) {
    const newConfig = {
      ...configData,
      select: { ...configData.select, experimentNames },
    };
    model.setState({ config: newConfig });
  }
}
