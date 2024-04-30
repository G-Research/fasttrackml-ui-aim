import { IExperimentDataShort } from 'modules/core/api/experimentsApi';

import { getItem } from 'utils/storage';

export function getSelectedExperiments(): IExperimentDataShort[] {
  const rawNames = getItem('selectedExperiments') ?? '[]';
  const parsedExperiments = JSON.parse(rawNames) as IExperimentDataShort[];
  return parsedExperiments ?? [];
}
