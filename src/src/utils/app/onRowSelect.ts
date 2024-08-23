import _ from 'lodash-es';

import { IModel, State } from 'types/services/models/model';

/**
 * Select row in table and update selectedRows state
 * @param {string} key - key of table column
 * @param {any} data - nested data
 * @param {string} actionType - action type name
 * @param {number} rangeStart - start range for range selection
 * @param {number} rangeEnd - end range for range selection
 * @param {IModel<M extends State>} model - instance of create model
 */

export interface IRowSelectProps {
  actionType: 'single' | 'selectAll' | 'removeAll' | 'range';
  data?: any;
  rangeStart?: number;
  rangeEnd?: number;
  model: IModel<State>;
}

export default function onRowSelect({
  actionType,
  data,
  rangeStart = 0,
  rangeEnd = 0,
  model,
}: IRowSelectProps): any {
  let selectedRows = model.getState()?.selectedRows || {};
  let rawData =
    model.getState()?.rawData?.reduce((acc: any, item: any) => {
      acc[item.hash] = {
        runHash: item.hash,
        ...item.props,
      };
      return acc;
    }, {}) || {};
  switch (actionType) {
    case 'single':
      if (selectedRows[data.selectKey]) {
        selectedRows = _.omit(selectedRows, [data.selectKey]);
      } else {
        selectedRows[data.selectKey] = {
          selectKey: data.selectKey,
          isHidden: data.isHidden,
          key: data.key,
          ...rawData[sliceRunHash(data.selectKey)],
        };
      }
      break;
    case 'selectAll':
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          if (!selectedRows[item.selectKey]) {
            selectedRows[item.selectKey] = {
              selectKey: item.selectKey,
              isHidden: item.isHidden,
              key: item.key,
              ...rawData[sliceRunHash(item.selectKey)],
            };
          }
        });
      } else {
        Object.values(data)
          .reduce((acc: any[], value: any) => {
            return acc.concat(value.items);
          }, [])
          .forEach((item: any) => {
            if (!selectedRows[item.selectKey]) {
              selectedRows[item.selectKey] = {
                selectKey: item.selectKey,
                isHidden: item.isHidden,
                key: item.key,
                ...rawData[sliceRunHash(item.selectKey)],
              };
            }
          });
      }

      break;
    case 'removeAll':
      if (Array.isArray(data)) {
        const hashArray: string[] = data.map((item: any) => item.selectKey);
        selectedRows = _.omit(selectedRows, hashArray);
      } else {
        const hashArray: string[] = Object.values(data)
          .reduce((acc: any[], value: any) => {
            return acc.concat(value.items);
          }, [])
          .map((item: any) => item.selectKey);
        selectedRows = _.omit(selectedRows, hashArray);
      }

      break;
    case 'range':
      if (Array.isArray(data)) {
        // Compute min and max to allow reverse selection (from bottom to top)
        const rangeMin = Math.min(rangeStart, rangeEnd);
        const rangeMax = Math.max(rangeStart, rangeEnd);
        if (selectedRows[data[rangeEnd].selectKey]) {
          // Remove all rows in range if last row was already selected
          const hashes = data
            .slice(rangeMin, rangeMax + 1)
            .map((item: any) => item.selectKey);
          selectedRows = _.omit(selectedRows, hashes);
        } else {
          // Add all rows in range otherwise
          data.slice(rangeMin, rangeMax + 1).forEach((item: any) => {
            if (!selectedRows[item.selectKey]) {
              selectedRows[item.selectKey] = {
                selectKey: item.selectKey,
                isHidden: item.isHidden,
                key: item.key,
                ...rawData[sliceRunHash(item.selectKey)],
              };
            }
          });
        }
      }
      break;
  }

  model.setState({
    selectedRows: { ...selectedRows },
  });
  return selectedRows;
}

function sliceRunHash(key: string): string {
  return key.slice(0, key.indexOf('/'));
}
