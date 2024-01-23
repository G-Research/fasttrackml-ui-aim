import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IParamsScaleStates } from 'types/components/ParamsScalePopover/ParamsScalePopover';
import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';

export default function onParamsScaleTypeChange<M extends State>({
  args,
  model,
  appName,
  updateModelData,
}: {
  args: IParamsScaleStates;
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
      chart: {
        ...configData.chart,
        paramsScaleType: args,
      },
    };
    model.setState({ config: configData });
    updateModelData(configData, true);
  }
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeParamsScale} to "${args.xAxis}"`,
  );
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeParamsScale} to "${args.yAxis}"`,
  );
}
