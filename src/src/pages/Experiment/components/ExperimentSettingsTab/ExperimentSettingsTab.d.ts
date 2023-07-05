export interface IExperimentSettingsTabProps {
  experimentId: string;
  experimentName: string;
  description: string;
  updateExperiment: (name: string, description: string) => void;
  deleteExperiment: (successCallback: () => void) => void;
}
