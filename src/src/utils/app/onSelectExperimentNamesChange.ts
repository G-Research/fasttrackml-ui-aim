import { IModel, State } from 'types/services/models/model';

export default function onSelectExperimentNamesChange<M extends State>({
  experimentName,
  model,
}: {
  experimentName: string;
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;
  const selectedExperimentNames =
    configData?.select?.selectedExperimentNames || [];

  // If the experiment is already selected, remove it from the list
  // Otherwise, add it
  const index = selectedExperimentNames.indexOf(experimentName);

  if (index > -1) {
    selectedExperimentNames.splice(index, 1);
  } else {
    selectedExperimentNames.push(experimentName);
  }

  if (configData?.select) {
    const newConfig = {
      ...configData,
      select: { ...configData.select, selectedExperimentNames },
    };
    model.setState({ config: newConfig });
  }
}
