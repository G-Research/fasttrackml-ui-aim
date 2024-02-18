import { IExperimentData } from 'modules/core/api/experimentsApi/types';

export interface IExperimentBarProps {
  isExperimentLoading: boolean;
  experimentData: IExperimentData | null;
  isExperimentsLoading: boolean;
  experimentsData: IExperimentData[] | null;
  selectedExperimentNames: string[];
  getExperimentsData: () => void;
  onSelectExperimentNamesChange: (experimentName: string) => void;
}
