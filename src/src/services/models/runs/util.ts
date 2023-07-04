import bs58check from 'bs58check';
import _ from 'lodash-es';

import { IMenuItem } from 'components/kit/Menu';

import {
  IImageData,
  IProcessedImageData,
} from 'types/services/models/imagesExplore/imagesExploreAppModel';

import contextToString from 'utils/contextToString';
import alphabeticalSortComparator from 'utils/alphabeticalSortComparator';
import { encode } from 'utils/encoder/encoder';
import getObjectPaths from 'utils/getObjectPaths';
import { getDataAsMediaSetNestedObject } from 'utils/app/getDataAsMediaSetNestedObject';
import { float64FromUint8, getValue } from 'utils/helper';
import getGroupingSelectOptions from 'utils/app/getGroupingSelectOptions';

import {
  DistributionsData,
  DistributionValue,
  ImagesData,
  IPlotlyData,
  TextsData,
  TraceProcessedData,
  TraceRawDataItem,
  TraceType,
} from './types';

/**
 * getMenuItemFromRawInfo
 * --------- Complexity analyse -----------
 *   The runtime is quadratic
 *   O(n) - Best case
 *   O(n * k) - Worst case where k is the maximum length of all children
 * --------- Complexity analyse -----------
 * We assume info already has length
 * @param info {TraceRawDataItem[]} - raw info data
 * @param separator {string} - key value separator
 * @returns - compatible Menu data, availableIds for the first layer
 */
export function getMenuItemFromRawInfo(
  info: TraceRawDataItem[],
  separator: string = '=',
): {
  data: IMenuItem[];
  availableIds: string[];
} {
  // for checking duplications
  const checkedItemIds: string[] = [];

  const data: IMenuItem[] = [];

  const sortOrder = alphabeticalSortComparator({
    orderBy: 'name',
    additionalCompare: (name1: string, name2: string) => {
      if (name2 === 'EMPTY CONTEXT') {
        return 0;
      }

      return null;
    },
  });
  // doesn't destructuring item, because we are not sure it has context
  info.forEach((item: TraceRawDataItem) => {
    const id: string = bs58check.encode(Buffer.from(`${item.name}`));
    let menuItem: IMenuItem = {
      name: item.name,
      id,
    };

    // this check is for ensure raw data has context
    if (item.context) {
      const keys: string[] = Object.keys(item.context);
      if (keys.length) {
        const children: IMenuItem[] = [];
        const child: IMenuItem = {
          name: `${contextToString(item.context)}`,
          id: bs58check.encode(Buffer.from(JSON.stringify(item.context))),
        };
        children.push(child);
        /*keys.forEach((key: string) => {
          const childItem = {
            name: `${key} ${separator} ${item.context[key]}`,
            // remove whitespaces from id
            id: `${key}${separator}${item.context[key]}`,
          };
          children.push(childItem);
        });*/

        menuItem.children = children;
      } else {
        menuItem.children = [
          {
            name: 'empty context',
            id: bs58check.encode(Buffer.from(JSON.stringify({}))),
          },
        ];
      }
    }
    /* Group children under the same id
     * Currently this function supports only the first layer of the array
     * To solve problem for nested items run recursively, not checked, that is not reliable right now
     * Or iterate through the children and remove if duplicate
     */
    if (checkedItemIds.includes(id)) {
      data.forEach((it: IMenuItem, index: number) => {
        if (it.id === id) {
          const itemChildren = data[index].children || [];
          const currentChildren = menuItem.children || [];
          // spreading order will let to order "empty context" to the first of all
          // cause if there empty context it will be in currentChildren
          data[index].children = [...currentChildren, ...itemChildren].sort(
            sortOrder,
          );

          // clear empty array
          // @ts-ignore because we already set it minimum empty array
          if (!data[index].children.length) {
            delete data[index].children;
          }
        }
      });
    } else {
      data.push(menuItem);
      checkedItemIds.push(id);
    }
  });

  data.sort(sortOrder);

  return {
    availableIds: checkedItemIds,
    data,
  };
}

/**
 * Generates api call request compatible data from menu's active key
 * 'dist_test.subset:value' -> { name: 'dist_test', context: { subset: 'val' } }
 * @param key {String} - active key
 * @param data {IMenuItem[]} - data
 * @param separator {string} - key value separator
 * @returns TraceRawDataItem - the object compatible to api call
 */
export function getContextObjFromMenuActiveKey(
  key: string,
  data: string[],
  separator: string = '=',
): TraceRawDataItem {
  let name = '';
  let contextKey = '';
  let context = {};

  for (let i = 0; i < key.length; i++) {
    // check includes to ensure we have not a wrong string
    // It is the case when the actual name has '.' inside
    if (!data.includes(name)) {
      name += key[i];
    } else {
      contextKey += key[i];
    }
  }

  name = bs58check.decode(name).toString();
  if (contextKey) {
    // remove contextKey[0] because it is '.'
    context = JSON.parse(
      bs58check.decode(contextKey.substring(1, contextKey.length)).toString(),
    );
    // const keyValue: string[] = contextKey.split(separator);
    // assumed there are separated string width "->"
    // @TODO check if the actual string may have "separator" inside, it's very hard case
    // @ts-ignore
  }

  return {
    name,
    context,
  };
}

export function getMenuData(traceType: TraceType, traces: TraceRawDataItem[]) {
  let title =
    VisualizationMenuTitles[traceType as Exclude<TraceType, 'metric'>];

  let defaultActiveKey = '';
  let defaultActiveName = '';

  const { data, availableIds } = getMenuItemFromRawInfo(traces);

  if (data[0].children && data[0].children.length) {
    defaultActiveKey = data[0].id + '.' + data[0].children[0].id;
    defaultActiveName = data[0].children[0].name;
  } else {
    defaultActiveKey = data[0].id + ''; // make string
    defaultActiveName = data[0].name;
  }

  return { data, defaultActiveKey, availableIds, title, defaultActiveName };
}

/**
 * process distributions data
 */
export function processDistributionsData(data: Partial<DistributionsData>) {
  const { record_range_total, iters, values } = data;
  const processedValues: any[] = [];
  const originalValues: TraceProcessedData[] = [];

  if (values) {
    values.forEach((value: DistributionValue) => {
      const parsedBlob: number[] = [...float64FromUint8(value.data.blob)];

      const bin = [];
      const xMin = value.range[0];
      const xMax = value.range[1];
      const binSize = (xMax - xMin) / value.bin_count;
      for (let i = 0; i <= value.bin_count; i++) {
        bin.push(xMin + i * binSize);
      }

      processedValues.push([parsedBlob, bin]);
      originalValues.push({
        ...value,
        data: {
          blob: parsedBlob,
        },
      });
    });
  }

  return {
    iters,
    record_range: [record_range_total?.[0], (record_range_total?.[1] || 0) - 1],
    processedValues,
    originalValues,
    processedDataType: VisualizationMenuTitles.distributions,
  };
}

/**
 * process texts data
 */
export function processTextsData(data: Partial<TextsData>) {
  const { record_range_total, index_range_total, iters, values } = data;
  const processedValues: any[] = [];
  if (values) {
    let count = 0;
    values.forEach((stepValues, stepIndex) => {
      stepValues.forEach((text) => {
        processedValues.push({
          step: iters?.[stepIndex],
          index: text.index,
          text: text.data,
          key: count, // Table row ID
        });
        count++;
      });
    });
  }

  return {
    iters,
    record_range: [record_range_total?.[0], (record_range_total?.[1] || 0) - 1],
    index_range: [index_range_total?.[0], (index_range_total?.[1] || 0) - 1],
    processedValues: _.orderBy(processedValues, ['step'], ['desc']),
    processedDataType: VisualizationMenuTitles.texts,
  };
}

/**
 * process images data
 */
export function processImagesData(
  data: Partial<ImagesData>,
  params?: { [key: string]: unknown },
) {
  const {
    record_range_total,
    iters,
    values,
    index_range_total,
    context,
    name,
  } = data;
  const groupingSelectOptions = params
    ? getGroupingSelectOptions({
        params: getObjectPaths(params, params),
        sequenceName: 'images',
      })
    : [];
  let images: IProcessedImageData[] = [];
  values?.forEach((stepData: IImageData[], stepIndex: number) => {
    stepData.forEach((image: IImageData) => {
      const imageKey = encode({
        name,
        traceContext: context,
        index: image.index,
        step: iters?.[stepIndex],
        caption: image.caption,
      });
      const seqKey = encode({
        name,
        traceContext: context,
      });
      images.push({
        ...image,
        name,
        step: iters?.[stepIndex],
        context: context,
        key: imageKey,
        seqKey: seqKey,
      });
    });
  });
  const { mediaSetData, orderedMap } = getDataAsMediaSetNestedObject({
    data: groupData(_.orderBy(images)),
    groupingSelectOptions,
    defaultGroupFields: ['step'],
  });
  return {
    imageSetData: mediaSetData,
    orderedMap,
    record_range: [record_range_total?.[0], (record_range_total?.[1] || 0) - 1],
    index_range: [index_range_total?.[0], (index_range_total?.[1] || 0) - 1],
    processedDataType: VisualizationMenuTitles.images,
  };
}

export function processAudiosData(
  data: Partial<ImagesData>,
  params?: { [key: string]: unknown },
) {
  const {
    record_range_total,
    iters,
    values,
    index_range_total,
    context,
    name,
  } = data;
  const groupingSelectOptions = params
    ? getGroupingSelectOptions({
        params: getObjectPaths(params, params),
        sequenceName: 'audios',
      })
    : [];
  let audiosSetData: any[] = [];

  values?.forEach((stepData: IImageData[], stepIndex: number) => {
    stepData.forEach((audio: IImageData) => {
      const audioKey = encode({
        name,
        traceContext: context,
        index: audio.index,
        step: iters?.[stepIndex],
        caption: audio.caption,
      });
      const seqKey = encode({
        name,
        traceContext: context,
      });
      audiosSetData.push({
        ...audio,
        audio_name: name,
        step: iters?.[stepIndex],
        context: context,
        key: audioKey,
        seqKey: seqKey,
      });
    });
  });
  const { mediaSetData, orderedMap } = getDataAsMediaSetNestedObject({
    data: groupData(_.orderBy(audiosSetData)),
    groupingSelectOptions,
    defaultGroupFields: ['step'],
  });
  return {
    audiosSetData: mediaSetData,
    orderedMap,
    record_range: [record_range_total?.[0], (record_range_total?.[1] || 0) - 1],
    index_range: [index_range_total?.[0], (index_range_total?.[1] || 0) - 1],
    processedDataType: VisualizationMenuTitles.audios,
  };
}

function groupData(data: IProcessedImageData[]): {
  key: string;
  config: { [key: string]: string };
  data: IProcessedImageData[];
}[] {
  const groupValues: {
    [key: string]: {
      key: string;
      config: { [key: string]: string };
      data: IProcessedImageData[];
    };
  } = {};

  for (let i = 0; i < data.length; i++) {
    const groupValue: { [key: string]: string } = {};
    ['step'].forEach((field) => {
      groupValue[field] = getValue(data[i], field);
    });
    const groupKey = encode(groupValue);
    if (groupValues.hasOwnProperty(groupKey)) {
      groupValues[groupKey].data.push(data[i]);
    } else {
      groupValues[groupKey] = {
        key: groupKey,
        config: groupValue,
        data: [data[i]],
      };
    }
  }
  return Object.values(groupValues);
}

export function reformatArrayQueries(
  queryObj: Record<string, [number, number]> = {},
) {
  const formattedQueryObject: Record<string, string> = {};
  Object.keys(queryObj).forEach((key) => {
    const item = queryObj[key];
    formattedQueryObject[key] = `${item[0]}:${item[1] + 1}`;
  });

  return formattedQueryObject;
}

/**
 * process plotly data
 */
export function processPlotlyData(data: Partial<IPlotlyData>) {
  const { record_range_total, iters, values } = data;
  let processedValue = null;
  let originalValues = null;
  if (_.head(values)?.data) {
    processedValue = JSON.parse(_.head(values)?.data);
    originalValues = values;
    processedValue.layout.autosize = true;
  } else {
    processedValue = {};
    originalValues = [];
  }

  return {
    iters,
    record_range: [record_range_total?.[0], (record_range_total?.[1] || 0) - 1],
    processedValue,
    originalValues,
    processedDataType: VisualizationMenuTitles.figures,
  };
}

export const VisualizationMenuTitles = {
  images: 'Images',
  distributions: 'Distributions',
  audios: 'Audios',
  videos: 'Videos',
  texts: 'Texts',
  figures: 'Plotly',
};
