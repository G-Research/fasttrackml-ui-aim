import { UnselectedColumnState } from 'config/table/tableConfigs';
import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';

import { encode } from 'utils/encoder/encoder';
import { setItem } from 'utils/storage';

export default function onDefaultColumnsVisibilityChange<M extends State>({
  unselectedColumnState,
  model,
  appName,
  updateModelData,
}: {
  unselectedColumnState: UnselectedColumnState;
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData?: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}): void {
  const configData = model.getState()?.config;
  if (configData?.table) {
    const table = {
      ...configData.table,
      unselectedColumnState,
    };
    const config = {
      ...configData,
      table,
    };
    model.setState({ config });
    setItem(`${appName}Table`, encode(table));
    updateModelData(config);
  }
  analytics.trackEvent(
    `${
      // @ts-ignore
      ANALYTICS_EVENT_KEYS[appName].table.changeDefaultColumnsVisibility
    } to "${unselectedColumnState.toString()}"`,
  );
}
