import { IModel, State } from 'types/services/models/model';

export default function onSelectExperimentIdChange<M extends State>({
  selectedExperimentId,
  model,
}: {
  selectedExperimentId: string;
  model: IModel<M>;
}) {
  const configData = model.getState()?.config;
  if (configData?.select) {
    const newConfig = {
      ...configData,
      select: { ...configData.select, selectedExperimentId },
    };
    model.setState({ config: newConfig });
  }
}
