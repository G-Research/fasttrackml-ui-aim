import _ from 'lodash-es';
import moment from 'moment';

import { DATE_WITH_SECONDS } from 'config/dates/dates';

import {
  IChartTitle,
  IChartTitleData,
  IGroupingCondition,
  IGroupingSelectOption,
  IMetricsCollection,
} from 'types/services/models/metrics/metricsAppModel';
import { IModel, State } from 'types/services/models/model';

import { formatValue } from '../formatValue';
import getValueByField from '../getValueByField';

export default function getChartTitleData<D, M extends State>({
  processedData,
  groupingSelectOptions,
  model,
}: {
  processedData: IMetricsCollection<D>[];
  groupingSelectOptions: IGroupingSelectOption[];
  model: IModel<M>;
}): IChartTitleData {
  if (!processedData) {
    return {};
  }
  const groupData = model.getState()?.config?.grouping;
  let chartTitleData: IChartTitleData = {};

  // Get the list of conditions as strings
  const conditions: IGroupingCondition[] = groupData.conditions?.chart?.map(
    (condition: IGroupingCondition) =>
      `${condition.fieldName} ${condition.operator} ${condition.value}`,
  );

  // Add the conditions to the chart names array
  const chartNames = groupData.chart.concat(conditions || []);

  processedData.forEach((metricsCollection) => {
    if (!chartTitleData[metricsCollection.chartIndex]) {
      chartTitleData[metricsCollection.chartIndex] = chartNames.reduce(
        (acc: IChartTitle, groupItemKey: string) => {
          if (metricsCollection.config?.hasOwnProperty(groupItemKey)) {
            const value = metricsCollection.config[groupItemKey];
            if (
              groupItemKey === 'run.props.creation_time' ||
              groupItemKey === 'run.props.end_time'
            ) {
              acc[getValueByField(groupingSelectOptions || [], groupItemKey)] =
                formatValue(
                  !_.isNil(value) && typeof value === 'number'
                    ? moment(value * 1000).format(DATE_WITH_SECONDS)
                    : value,
                );
            } else {
              acc[
                getValueByField(groupingSelectOptions || [], groupItemKey) ||
                  groupItemKey
              ] = formatValue(value);
            }
          }
          return acc;
        },
        {},
      );
    }
  });
  return chartTitleData;
}
