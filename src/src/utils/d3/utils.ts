import { IChartTitle } from 'types/services/models/metrics/metricsAppModel';

import { formatSystemMetricName } from 'utils/formatSystemMetricName';
import { isSystemMetric } from 'utils/isSystemMetric';

export function chartTitleToText(chartTitle: IChartTitle) {
  return Object.entries(chartTitle || {})
    .map(
      ([key, value]) =>
        `${key}=${
          isSystemMetric(value) ? formatSystemMetricName(value) : value
        }`,
    )
    .join(', ');
}
