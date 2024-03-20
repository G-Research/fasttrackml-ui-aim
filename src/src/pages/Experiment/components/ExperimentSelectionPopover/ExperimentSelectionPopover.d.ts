import { IExperimentData } from 'modules/core/api/experimentsApi/types';

export interface IExperimentSelectionPopoverProps {
  experimentsData: IExperimentData[] | null;
  selectedExperimentNames: string[];
  isExperimentsLoading: boolean;
  getExperimentsData: () => void;
  onSelectExperimentNamesChange: (experimentName: string) => void;
  onToggleAllExperiments: (experimentNames: string[]) => void;
}
