import { IModel, State } from 'types/services/models/model';

import onSelectOptionsChange from './onSelectOptionsChange';

// Remove selected metrics whose experiment is not present in the fetched experiments
export function removeOldSelectedMetrics<M extends State>(model: IModel<M>) {
  const selectedMetricsData = model.getState()?.config?.select;
  if (selectedMetricsData) {
    const selectedMetrics = selectedMetricsData.options;
    const selectOptions = model.getState()?.selectFormData?.options;
    if (selectOptions) {
      const newSelectedMetrics = selectedMetrics.filter((metric: any) =>
        selectOptions.find((option: any) => option.key === metric.key),
      );
      if (selectedMetrics.length !== newSelectedMetrics.length) {
        onSelectOptionsChange({ data: newSelectedMetrics, model });
      }
    }
  }
}
