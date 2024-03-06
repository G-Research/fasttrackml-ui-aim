import { ISyntaxErrorDetails } from 'types/components/NotificationContainer/NotificationContainer';
import { ISelectConfig } from 'types/services/models/explorer/createAppModel';

export default function getInputQueryStringFromSelect(
  selectData: ISelectConfig,
  error?: ISyntaxErrorDetails,
) {
  let query = '()';
  if (selectData === undefined) {
    return query;
  }
  query =
    selectData.query?.trim() && !error?.message
      ? `(${selectData.query.trim()})`
      : '';
  return query.trim() || '()';
}
