import { IAxesScaleRange } from 'components/AxesPropsPopover';

import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';

import updateURL from './updateURL';

const onAxesScaleRangeChange = <M extends State>({
  chartId,
  range,
  model,
  appName,
}: {
  chartId: number;
  range: Partial<IAxesScaleRange>;
  model: IModel<M>;
  appName: string;
}): void => {
  let configData = model?.getState()?.config;
  if (configData?.chart) {
    const updatedAxesScaleRanges = configData.chart.axesScaleRanges.map(
      (axesScaleRange: { yAxis: any; xAxis: any }, index: any) => {
        if (index === chartId) {
          return {
            yAxis: {
              ...axesScaleRange.yAxis,
              ...(range.yAxis || {}),
            },
            xAxis: {
              ...axesScaleRange.xAxis,
              ...(range.xAxis || {}),
            },
          };
        }
        return axesScaleRange;
      },
    );

    configData = {
      ...configData,
      chart: {
        ...configData.chart,
        axesScaleRanges: updatedAxesScaleRanges,
      },
    };
    model.setState({ config: configData });
    updateURL({ configData, appName });
  }
  analytics.trackEvent(
    // @ts-ignore
    `${ANALYTICS_EVENT_KEYS[appName].chart.controls.changeAxesScaleRange} to "${range.yAxis}"`,
  );
};

export default onAxesScaleRangeChange;
