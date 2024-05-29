import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';
import { IGroupingCondition } from 'types/services/models/metrics/metricsAppModel';

import resetChartZoom from './resetChartZoom';

export default function onGroupingConditionsChange<M extends State>({
  conditions,
  model,
  appName,
  updateModelData,
}: {
  conditions: IGroupingCondition[];
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}) {
  let configData = model.getState()?.config;

  if (configData?.grouping) {
    configData.grouping = { ...configData.grouping, conditions };
    configData = resetChartZoom({ configData, appName });
    updateModelData(configData, true);
  }
  analytics.trackEvent(
    `[${appName}Explorer] Group by condition: ${conditions}`,
  );
}
