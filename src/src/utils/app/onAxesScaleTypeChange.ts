import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IAxesScaleState } from 'types/components/AxesScalePopover/AxesScalePopover';
import { IModel, State } from 'types/services/models/model';
import { IAppModelConfig } from 'types/services/models/explorer/createAppModel';

export default function onAxesScaleTypeChange<M extends State>({
  args,
  model,
  appName,
  updateModelData,
}: {
  args: IAxesScaleState;
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
        axesScaleType: args,
      },
    };
    model.setState({ config: configData });
    updateModelData(configData, true);
  }
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeAxesScale} to "${args.xAxis}"`,
  );
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeAxesScale} to "${args.yAxis}"`,
  );
}
