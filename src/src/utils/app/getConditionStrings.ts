import { IGroupingCondition } from 'types/services/models/metrics/metricsAppModel';

/**
 * Get the list of conditions as strings
 * @param conditions the list of IGroupingCondition
 * @returns the list of conditions as strings
 */
export function getConditionStrings(conditions: IGroupingCondition[]) {
  return conditions.map((condition) => {
    return `${condition.fieldName} ${condition.operator} ${condition.value}`;
  });
}
