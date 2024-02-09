import { IExperimentData } from 'modules/core/api/experimentsApi/types';

export interface IExperimentNavigationPopoverCompactProps {
  experimentsData: IExperimentData[] | null;
  experimentId: string;
  isExperimentsLoading: boolean;
  getExperimentsData: () => void;
  onExperimentChange: (experimentId: string) => void;
}
