import React from 'react';
import _ from 'lodash-es';
import { VariableSizeList as List, areEqual } from 'react-window';
import classNames from 'classnames';

import { Tooltip } from '@material-ui/core';

import MediaList from 'components/MediaList';
import { JsonViewPopover } from 'components/kit';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import { MediaTypeEnum } from 'components/MediaPanel/config';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import DepthDropdown from 'components/DepthDropdown/DepthDropdown';
import DepthSlider from 'components/DepthSlider/DepthSlider';

import {
  MEDIA_ITEMS_SIZES,
  MEDIA_SET_SIZE,
  MEDIA_SET_SLIDER_HEIGHT,
  MEDIA_SET_TITLE_HEIGHT,
  MEDIA_SET_WRAPPER_PADDING_HEIGHT,
} from 'config/mediaConfigs/mediaConfigs';

import { formatValue } from 'utils/formatValue';
import { jsonParse } from 'utils/jsonParse';
import { SortField } from 'utils/getSortedFields';
import getBiggestImageFromList from 'utils/getBiggestImageFromList';

import { IMediaSetProps } from './MediaSet.d';

import './MediaSet.scss';

const MediaSet = ({
  data,
  onListScroll,
  addUriToList,
  index = 0,
  mediaSetKey,
  wrapperOffsetHeight,
  wrapperOffsetWidth,
  orderedMap,
  focusedState,
  additionalProperties,
  tableHeight,
  tooltip,
  mediaType,
  sortFieldsDict,
  sortFields,
  selectOptions,
  onRunsTagsChange,
}: IMediaSetProps): React.FunctionComponentElement<React.ReactNode> => {
  const [depthMap, setDepthMap] = React.useState<number[]>([]);
  let content: [(string | {})[], [] | [][]][] = []; // the actual items list to be passed to virtualized list component
  let keysMap: { [key: string]: number } = {}; // cache for checking whether the group title is already added to list

  fillContent(data, [''], orderedMap);

  function setStackedList(list: [], stackedList: [][]): void {
    for (let j = 0; j < list.length; j++) {
      if (!stackedList[j]) {
        stackedList[j] = [];
      }
      stackedList[j].push(list[j]);
    }
  }

  function setStackedContent(list: [], path: (string | {})[]): void {
    const [lastContentPath, lastContentList] = content[content.length - 1];
    const [orderedMapKey, value] = (path[path.length - 1] as string).split(
      ' = ',
    );
    if (path.length === lastContentPath.length) {
      (lastContentPath[lastContentPath.length - 1] as any)[orderedMapKey].push(
        value,
      );
      setStackedList(list, lastContentList);
    } else {
      let stackedList: [][] = [];
      setStackedList(list, stackedList);
      path[path.length - 1] = { [orderedMapKey]: [value] };
      content.push([path, stackedList]);
    }
  }

  function getOrderedContentList(list: []): [] {
    const listKeys: string[] = [];
    const listOrderTypes: any[] = [];
    sortFields?.forEach((sortField: SortField) => {
      listKeys.push(sortField.value);
      listOrderTypes.push(sortField.order);
    });
    return _.orderBy(list, listKeys, listOrderTypes) as [];
  }

  function fillContent(
    list: [] | { [key: string]: [] | {} },
    path: (string | {})[] = [''],
    orderedMap: { [key: string]: any },
  ) {
    if (Array.isArray(list)) {
      const orderedContentList = getOrderedContentList(list);
      if (additionalProperties.stacking && content.length) {
        setStackedContent(orderedContentList, path);
      } else {
        content.push([path, orderedContentList]);
      }
    } else {
      const fieldSortedValues = _.orderBy(
        [...(orderedMap?.ordering || [])].reduce((acc: any, value: any) => {
          acc.push({ [orderedMap.key]: value });
          return acc;
        }, []),
        [orderedMap?.key || ''],
        [sortFieldsDict?.[orderedMap?.orderKey]?.order || 'asc'],
      ).map((value: any) => value[orderedMap?.key]);
      fieldSortedValues.forEach((val: any) => {
        const fieldName = `${orderedMap.key} = ${formatValue(val)}`;
        if (!keysMap.hasOwnProperty(path.join(''))) {
          content.push([path, []]);
          keysMap[path.join('')] = 1;
        }
        fillContent(
          list[fieldName],
          path.concat([fieldName]),
          orderedMap[fieldName],
        );
      });
    }
  }

  function getItemSize(index: number): number {
    let [path, items] = content[index];
    const { maxHeight, maxWidth } = getBiggestImageFromList(items.flat());
    const { mediaItemSize, alignmentType, stacking } = additionalProperties;
    const lastPath = path[path.length - 1];
    const isStackedPath = stacking && typeof lastPath === 'object';
    const { pathValue } = getPathDetails({
      isStackedPath,
      lastPath,
    });
    if (path.length === 1) {
      return 0;
    }
    if (items.length > 0) {
      if (mediaType === MediaTypeEnum.IMAGE) {
        return MEDIA_SET_SIZE[mediaType]({
          maxHeight,
          maxWidth,
          mediaItemHeight,
          alignmentType,
          wrapperOffsetWidth,
          mediaItemSize,
          stacking: isStackedPath && pathValue.length > 1,
        });
      }
      if (mediaType === MediaTypeEnum.AUDIO) {
        return MEDIA_SET_SIZE[mediaType]();
      }
    }
    return MEDIA_SET_TITLE_HEIGHT + MEDIA_SET_WRAPPER_PADDING_HEIGHT;
  }

  const onDepthChange = React.useCallback(
    (value: number, index: number): void => {
      if (value !== depthMap[index]) {
        let tmpDepthMap = [...depthMap];
        tmpDepthMap[index] = value;
        setDepthMap(tmpDepthMap);
      }
    },
    [depthMap, setDepthMap],
  );

  const mediaItemHeight = React.useMemo(() => {
    if (mediaType === MediaTypeEnum.AUDIO) {
      return MEDIA_ITEMS_SIZES[mediaType]()?.height;
    } else {
      return MEDIA_ITEMS_SIZES[mediaType]({
        data,
        additionalProperties,
        wrapperOffsetWidth,
        wrapperOffsetHeight,
      })?.height;
    }
  }, [
    additionalProperties,
    data,
    mediaType,
    wrapperOffsetHeight,
    wrapperOffsetWidth,
  ]);

  React.useEffect(() => {
    if (additionalProperties.stacking && content.length) {
      setDepthMap(Array(content.length).fill(0));
    }
  }, [additionalProperties.stacking, data, content.length]);

  return (
    <ErrorBoundary>
      <List
        key={content.length + tableHeight + mediaSetKey}
        height={wrapperOffsetHeight || 0}
        itemCount={content.length}
        itemSize={getItemSize}
        width={'100%'}
        onScroll={onListScroll}
        itemData={{
          data: content,
          addUriToList,
          wrapperOffsetWidth,
          wrapperOffsetHeight,
          index,
          mediaSetKey,
          mediaItemHeight,
          focusedState,
          additionalProperties,
          tooltip,
          mediaType,
          depthMap,
          onDepthChange,
          selectOptions,
          onRunsTagsChange,
        }}
      >
        {MediaGroupedList}
      </List>
    </ErrorBoundary>
  );
};

function propsComparator(
  prevProps: IMediaSetProps,
  nextProps: IMediaSetProps,
): boolean {
  if (
    prevProps.mediaSetKey !== nextProps.mediaSetKey ||
    prevProps.focusedState !== nextProps.focusedState ||
    prevProps.sortFieldsDict !== nextProps.sortFieldsDict
  ) {
    return false;
  }
  return true;
}

export default React.memo(MediaSet, propsComparator);

const MediaGroupedList = React.memo(function MediaGroupedList({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: { [key: string]: any };
}) {
  const [path, items] = data.data[index];
  const lastPath = path[path.length - 1];
  const depth = data.depthMap[index] || 0;
  const isStackedPath =
    data.additionalProperties.stacking && typeof lastPath === 'object';
  const { pathKey, pathValue } = getPathDetails({
    isStackedPath,
    lastPath,
  });
  const { currentValue, currentItems } = getCurrentContent({
    isStackedPath,
    pathValue,
    depth,
    items,
  });
  const json: string | object = jsonParse(currentValue);
  const isJson: boolean = typeof json === 'object';
  const renderStacking =
    currentItems.length > 0 && isStackedPath && pathValue.length > 1;
  return (
    <ErrorBoundary>
      <div
        className='MediaSet'
        style={{
          paddingLeft: `calc(0.625rem * ${path.length - 2})`,
          ...style,
        }}
      >
        {path.slice(2).map((key: string, i: number) => (
          <ErrorBoundary key={key}>
            <div
              className='MediaSet__connectorLine'
              style={{ left: `calc(0.625rem * ${i})` }}
            />
          </ErrorBoundary>
        ))}
        <div
          className={`MediaSet__container ${path.length > 2 ? 'withDash' : ''}`}
        >
          {path.length > 1 && (
            <ErrorBoundary>
              <ControlPopover
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                anchor={({ onAnchorClick }) => (
                  <span className='MediaSet__container__path'>
                    <Tooltip
                      placement='top-start'
                      title={`${pathKey} = ${currentValue}`}
                    >
                      <span
                        className='MediaSet__container__path__title'
                        style={{
                          height: MEDIA_SET_TITLE_HEIGHT,
                          width: renderStacking ? '' : '100%',
                        }}
                      >
                        <span
                          className={classNames(
                            'MediaSet__container__path__title__key',
                            {
                              stacked: renderStacking,
                            },
                          )}
                        >
                          {pathKey}
                        </span>
                        =
                        <span
                          onClick={isJson ? onAnchorClick : undefined}
                          className={classNames(
                            'MediaSet__container__path__title__value',
                            {
                              stacked: renderStacking,
                              MediaSet__container__path__title__pointer: isJson,
                            },
                          )}
                        >
                          {currentValue}
                        </span>
                      </span>
                    </Tooltip>
                    {renderStacking && (
                      <DepthDropdown
                        index={index}
                        pathValue={pathValue}
                        depth={depth}
                        onDepthChange={data.onDepthChange}
                      />
                    )}
                  </span>
                )}
                component={<JsonViewPopover json={json as object} />}
              />
            </ErrorBoundary>
          )}
          {renderStacking && (
            <DepthSlider
              index={index}
              items={pathValue as string[]}
              depth={depth}
              onDepthChange={data.onDepthChange}
              style={{ height: MEDIA_SET_SLIDER_HEIGHT }}
            />
          )}
          {currentItems.length > 0 && (
            <div className='MediaSet__container__mediaItemsList'>
              <MediaList
                key={`${index}-${depth}`}
                data={currentItems}
                addUriToList={data.addUriToList}
                wrapperOffsetWidth={data.wrapperOffsetWidth}
                wrapperOffsetHeight={data.wrapperOffsetHeight}
                mediaItemHeight={data.mediaItemHeight}
                focusedState={data.focusedState}
                additionalProperties={data.additionalProperties}
                tooltip={data.tooltip}
                mediaType={data.mediaType}
                selectOptions={data.selectOptions}
                onRunsTagsChange={data.onRunsTagsChange}
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
},
areEqual);

function getPathDetails({
  isStackedPath,
  lastPath,
}: {
  isStackedPath: boolean;
  lastPath: any;
}) {
  let pathKey = '';
  let pathValue: string | string[] = '';
  if (isStackedPath) {
    pathKey = Object.keys(lastPath)[0];
    pathValue = lastPath[pathKey];
  } else {
    [pathKey = '', pathValue = ''] = lastPath?.split(' = ');
  }
  return { pathKey, pathValue };
}

function getCurrentContent({
  isStackedPath,
  pathValue,
  depth,
  items,
}: {
  isStackedPath: boolean;
  pathValue: string | string[];
  depth: number;
  items: [] | [][];
}) {
  let currentValue = '';
  let currentItems: [] = [];

  if (isStackedPath) {
    currentValue = (pathValue[depth] as string)?.trim();
    for (let item of items) {
      if (item[depth]) {
        currentItems.push(item[depth]);
      }
    }
  } else {
    currentValue = (pathValue as string)?.trim();
    currentItems = items as [];
  }
  return { currentValue, currentItems };
}
