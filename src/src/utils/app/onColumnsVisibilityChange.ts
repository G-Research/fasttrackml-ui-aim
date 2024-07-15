import _ from 'lodash-es';

import { HideColumnsEnum } from 'config/enums/tableEnums';
import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';
import { AVOID_COLUMNS_TO_HIDE_LIST } from 'config/table/tableConfigs';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';
import {
  IAppModelConfig,
  ISelectOption,
} from 'types/services/models/explorer/createAppModel';
import { ITableColumn } from 'types/pages/metrics/components/TableColumns/TableColumns';

import { encode } from 'utils/encoder/encoder';
import { setItem } from 'utils/storage';

import getSystemMetricsFromColumns from './getSystemMetricsFromColumns';
import getFilteredSystemMetrics from './getFilteredSystemMetrics';

export default function onColumnsVisibilityChange<M extends State>({
  hiddenColumns,
  model,
  appName,
  updateModelData,
}: {
  hiddenColumns: string[] | string;
  model: IModel<M>;
  appName: string;
  updateModelData: (
    configData: IAppModelConfig | any,
    shouldURLUpdate?: boolean,
  ) => void;
}): void {
  const modelState = model.getState();
  const configData = modelState?.config;
  const columnsData = modelState!.tableColumns!;
  const systemMetrics: string[] = getSystemMetricsFromColumns(
    columnsData as ITableColumn[],
  );
  let params: ISelectOption[] = [];
  let metrics: ISelectOption[] = [];

  let columnKeys: string[] = Array.isArray(hiddenColumns)
    ? [...hiddenColumns]
    : [];
  let hideSystemMetrics: boolean | undefined =
    configData?.table.hideSystemMetrics;

  if (configData?.table) {
    const filteredFromSystem = getFilteredSystemMetrics(
      configData?.table?.hiddenColumns,
      true,
    );
    if (hiddenColumns === HideColumnsEnum.HideSystemMetrics) {
      columnKeys = [...filteredFromSystem, ...systemMetrics];
    }
    if (hiddenColumns === HideColumnsEnum.ShowSystemMetrics) {
      columnKeys = [...filteredFromSystem];
    }

    if (hideSystemMetrics !== undefined) {
      hideSystemMetrics =
        getFilteredSystemMetrics(columnKeys).length === systemMetrics.length;
    }
    switch (hiddenColumns) {
      case HideColumnsEnum.All:
        columnKeys = columnsData.map((col) => {
          if (!AVOID_COLUMNS_TO_HIDE_LIST.has(col.key)) {
            return col.label ?? col.key;
          }
          return false;
        });
        break;
      case HideColumnsEnum.HideMetrics:
        metrics = modelState.sortOptions?.filter((option: ISelectOption) => {
          return option.group === 'metrics';
        });
        // Set columnkeys to all metrics plus the already hidden columns from config.table.hiddencolumns
        columnKeys = _.uniq([
          ...configData?.table.hiddenColumns,
          ...metrics.map((metric: ISelectOption) => metric.label),
        ]);
        break;
      case HideColumnsEnum.ShowMetrics:
        columnKeys = configData?.table.hiddenColumns.filter((col: string) => {
          return !modelState.sortOptions?.some(
            (option: ISelectOption) => option.label === col,
          );
        });
        break;
      case HideColumnsEnum.HideParams:
        params = modelState.sortOptions?.filter((option: any) => {
          return option.group === 'run' && option.value?.includes('params');
        });
        columnKeys = _.uniq([
          ...configData?.table.hiddenColumns,
          ...params.map((param: ISelectOption) => param.label.split('.')[1]),
        ]);
        break;
    }
    const table = {
      ...configData.table,
      hiddenColumns: columnKeys,
      hideSystemMetrics,
    };

    const config = {
      ...configData,
      table,
    };
    model.setState({ config });
    setItem(`${appName}Table`, encode(table));
    updateModelData(config);
  }
  if (hiddenColumns[0] === 'all') {
    // @ts-ignore
    analytics.trackEvent(ANALYTICS_EVENT_KEYS[appName].table.showAllColumns);
  } else if (_.isEmpty(hiddenColumns)) {
    // @ts-ignore
    analytics.trackEvent(ANALYTICS_EVENT_KEYS[appName].table.hideAllColumns);
  }
}
