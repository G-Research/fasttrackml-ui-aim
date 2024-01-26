import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import {
  IAppModelConfig,
  ISelectOption,
} from 'types/services/models/explorer/createAppModel';

export default function onParamsScaleTypeChange<M extends State>({
  args,
  model,
  appName,
  updateModelData,
}: {
  args: ISelectOption[];
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}): void {
  let configData = model?.getState()?.config;
  if (configData?.chart) {
    configData = {
      ...configData,
      select: {
        ...configData.select,
        options: args,
      },
    };
    model.setState({ config: configData });
    updateModelData(configData, true);
  }
  // todo create analytics keys and change this
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeParamsScale} to "${args}"`,
  );
}
