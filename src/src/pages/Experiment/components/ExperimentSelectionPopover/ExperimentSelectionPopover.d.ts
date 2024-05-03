import {
  IExperimentData,
  IExperimentDataShort,
} from 'modules/core/api/experimentsApi/types';

export interface IExperimentSelectionPopoverProps {
  experimentsData: IExperimentData[] | null;
  selectedExperiments: IExperimentDataShort[];
  isExperimentsLoading: boolean;
  getExperimentsData: () => void;
  setSelectedExperiments: (selectedExperiments: IExperimentDataShort[]) => void;
  onSelectExperimentsChange: (experiment: IExperimentDataShort) => void;
  onToggleAllExperiments: (experiments: IExperimentDataShort[]) => void;
}
