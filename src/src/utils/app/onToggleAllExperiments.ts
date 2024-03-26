import { IModel, State } from 'types/services/models/model';

import onSelectExperimentNamesChange from './onSelectExperimentNamesChange';

export default function onToggleAllExperiments<M extends State>({
  experimentNames,
  model,
}: {
  experimentNames: string[];
  model: IModel<M>;
}) {
  // Toggle all experiments in list one by one
  experimentNames.forEach((experimentName) => {
    onSelectExperimentNamesChange({ experimentName, model });
  });
}
