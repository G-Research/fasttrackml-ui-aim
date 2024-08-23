import { RowHeightEnum } from 'config/enums/tableEnums';
import { RowHeightSize } from 'config/table/tableConfigs';
import { ANALYTICS_EVENT_KEYS } from 'config/analytics/analyticsKeysMap';

import * as analytics from 'services/analytics';

import { IModel, State } from 'types/services/models/model';

import { encode } from 'utils/encoder/encoder';
import { setItem } from 'utils/storage';

export default function onRowHeightChange<M extends State>({
  height,
  model,
  appName,
}: {
  height: RowHeightSize;
  model: IModel<M>;
  appName: string;
}): void {
  const configData = model.getState()?.config;
  if (configData?.table) {
    const table = {
      ...configData.table,
      rowHeight: height,
    };
    const config = {
      ...configData,
      table,
    };
    model.setState({ config });
    setItem(`${appName}Table`, encode(table));
  }
  analytics.trackEvent(
    `${
      // @ts-ignore
      ANALYTICS_EVENT_KEYS[appName].table.changeTableRowHeight
    } to "${RowHeightEnum[height].toLowerCase()}"`,
  );
}
