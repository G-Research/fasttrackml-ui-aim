import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';

import onColumnsVisibilityChange from './onColumnsVisibilityChange';

export function onTableDiffShow<M extends State>({
  model,
  appName,
  updateModelData,
}: {
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}): void {
  const sameValueColumns = model.getState()?.sameValueColumns;
  if (sameValueColumns && typeof onColumnsVisibilityChange === 'function') {
    onColumnsVisibilityChange({
      hiddenColumns: sameValueColumns,
      model,
      appName,
      updateModelData,
    });
  }
  // @ts-ignore
  analytics.trackEvent(ANALYTICS_EVENT_KEYS[appName].table.showDiff);
}
