import { ISyntaxErrorDetails } from 'types/components/NotificationContainer/NotificationContainer';
import { ISelectConfig } from 'types/services/models/explorer/createAppModel';

import { jsValidVariableRegex } from 'utils/getObjectPaths';

import { formatValue } from '../formatValue';

export default function getMetricsListFromSelect(
  selectData: ISelectConfig,
  error?: ISyntaxErrorDetails,
): Array<[string, string | null]> {
  const metricsList: Array<[string, string | null]> = [];

  if (selectData === undefined) {
    return metricsList;
  }

  selectData.options?.forEach((option) => {
    const metricName = option.value?.option_name.replaceAll('"', '\\"') ?? '';
    const context: string | null =
      option.value?.context === null
        ? null
        : Object.keys(option.value?.context)
            .map((item) => {
              const contextKey = !jsValidVariableRegex.test(item)
                ? `['${item.replaceAll('"', '\\"')}']`
                : `${item}`;
              const contextValue = (option.value?.context as any)[item];
              return `${contextKey}: ${formatValue(contextValue)}`;
            })
            .join(', ');

    metricsList.push([metricName, context]);
  });

  return metricsList;
}
