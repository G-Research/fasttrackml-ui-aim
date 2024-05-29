import { IGroupingCondition } from 'types/services/models/metrics/metricsAppModel';

export default function evaluateCondition(
  value: string,
  condition: IGroupingCondition,
): boolean {
  const { operator, value: conditionValue } = condition;

  if (operator === '==') {
    return value === conditionValue;
  }

  if (operator === '!=') {
    return value !== conditionValue;
  }

  if (operator === '>=') {
    return Number(value) >= Number(conditionValue);
  }

  if (operator === '<=') {
    return Number(value) <= Number(conditionValue);
  }

  if (operator === '>') {
    return Number(value) > Number(conditionValue);
  }

  if (operator === '<') {
    return Number(value) < Number(conditionValue);
  }

  return false;
}
