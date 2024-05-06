import { ISyntaxErrorDetails } from 'types/components/NotificationContainer/NotificationContainer';
import { ISelectConfig } from 'types/services/models/explorer/createAppModel';
import { IContext } from 'types/services/models/metrics/metricsAppModel';

export default function getMetricsListFromSelect(
  selectData: ISelectConfig,
  error?: ISyntaxErrorDetails,
): Array<{ key: string; context: IContext }> {
  const metricsList: Array<{ key: string; context: IContext }> = [];

  if (selectData === undefined) {
    return metricsList;
  }

  selectData.options?.forEach((option) => {
    const metricName = option.value?.option_name ?? '';
    const context: IContext = option.value?.context ?? {};

    metricsList.push({ key: metricName, context: context });
  });

  return metricsList;
}
