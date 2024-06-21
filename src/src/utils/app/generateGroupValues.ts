import {
  IGroupingCondition,
  IMetricsCollection,
} from 'types/services/models/metrics/metricsAppModel';
import { IMetric } from 'types/services/models/metrics/metricModel';

import { getValue } from 'utils/helper';
import { encode } from 'utils/encoder/encoder';

import evaluateCondition from './evaluateCondition';
import { getConditionStrings } from './getConditionStrings';

export function generateGroupValues(
  data: IMetric[],
  allConditions: IGroupingCondition[],
  groupingFields: string[],
) {
  const groupValues: {
    [key: string]: IMetricsCollection<IMetric>;
  } = {};

  const allConditionStrings = getConditionStrings(allConditions);

  for (let i = 0; i < data.length; i++) {
    const groupValue: { [key: string]: any } = {};
    groupingFields.forEach((field) => {
      groupValue[field] = getValue(data[i], field);
    });

    // Evaluate the conditions and update the row
    allConditionStrings.forEach((conditionString, j) => {
      // Evaluate the condition
      const condition = allConditions[j];

      // Get everything after the first dot in the field name
      const fieldTypeAndName = condition.fieldName.split('.');
      const fieldType = fieldTypeAndName[0];
      const fieldName = fieldTypeAndName.slice(1).join('.');

      // Flatten default run attributes and store them in a single object
      const runAttributes = {
        ...data[i].run.params,
        ...data[i].run.props,
        hash: data[i].run.hash,
        name: fieldType === 'metric' ? data[i].name : data[i].run.props.name,
        tags: data[i].run.params.tags,
        experiment: data[i].run.props.experiment?.name,
        context: data[i].context,
      };

      // Get the relevant attribute's value
      const attributeValue = getValue(runAttributes, fieldName);
      groupValue[conditionString] = evaluateCondition(
        attributeValue,
        condition,
      );
    });

    const groupKey = encode(groupValue);
    if (groupValues.hasOwnProperty(groupKey)) {
      groupValues[groupKey].data.push(data[i]);
    } else {
      groupValues[groupKey] = {
        key: groupKey,
        config: groupValue,
        color: null,
        dasharray: null,
        chartIndex: 0,
        data: [data[i]],
      };
    }
  }

  return groupValues;
}
