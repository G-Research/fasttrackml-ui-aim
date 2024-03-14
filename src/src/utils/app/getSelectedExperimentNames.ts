import { getItem } from 'utils/storage';

export function getSelectedExperimentNames(): string[] {
  const rawNames = getItem('selectedExperimentNames') ?? '';
  const selectedExperimentNames =
    rawNames.length > 0 ? rawNames.split(',') : [];
  return selectedExperimentNames.length > 0 ? selectedExperimentNames : [];
}
