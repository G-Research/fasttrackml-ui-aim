import {
  IExperimentData,
  IExperimentDataShort,
} from 'modules/core/api/experimentsApi/types';

export interface IExperimentBarProps {
  isExperimentLoading: boolean;
  isExperimentsLoading: boolean;
  experimentsData: IExperimentData[] | null;
  selectedExperiments: IExperimentDataShort[];
  getExperimentsData: () => void;
  onSelectExperimentsChange: (experiment: IExperimentDataShort) => void;
  onToggleAllExperiments: (experiments: IExperimentDataShort[]) => void;
}
