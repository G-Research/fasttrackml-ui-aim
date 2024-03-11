import { IExperimentData } from 'modules/core/api/experimentsApi/types';

export interface IExperimentBarProps {
  isExperimentLoading: boolean;
  isExperimentsLoading: boolean;
  experimentsData: IExperimentData[] | null;
  selectedExperimentNames: string[];
  getExperimentsData: () => void;
  onSelectExperimentNamesChange: (experimentName: string) => void;
  onToggleAllExperiments: (experimentNames: string[]) => void;
}
