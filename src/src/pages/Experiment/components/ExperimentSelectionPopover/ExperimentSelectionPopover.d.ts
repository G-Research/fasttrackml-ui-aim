import { IExperimentData } from 'modules/core/api/experimentsApi/types';

export interface IExperimentSelectionPopoverProps {
  experimentsData: IExperimentData[] | null;
  selectedExperiments: string[];
  isExperimentsLoading: boolean;
  getExperimentsData: () => void;
  setSelectedExperiments: (selectedExperiments: string[]) => void;
  onSelectExperimentNamesChange: (experimentName: string) => void;
  onToggleAllExperiments: (experimentNames: string[]) => void;
}
