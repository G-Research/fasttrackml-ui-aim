import ChartPopoverAdvanced from 'pages/Metrics/components/ChartPopover/ChartPopoverAdvanced';
import ColorPopoverAdvanced from 'pages/Metrics/components/ColorPopoverAdvanced/ColorPopoverAdvanced';
import StrokePopoverAdvanced from 'pages/Metrics/components/StrokePopover/StrokePopoverAdvanced';

import { IGroupingPopovers } from 'types/pages/components/Grouping/Grouping';

export enum GroupNameEnum {
  COLOR = 'color',
  STROKE = 'stroke',
  CHART = 'chart',
  ROW = 'row',
}

const GroupingPopovers: IGroupingPopovers[] = [
  {
    groupName: GroupNameEnum.COLOR,
    title: 'Group by color',
    AdvancedComponent: ColorPopoverAdvanced,
  },
  {
    groupName: GroupNameEnum.STROKE,
    title: 'Group by stroke style',
    AdvancedComponent: StrokePopoverAdvanced,
  },
  {
    groupName: GroupNameEnum.CHART,
    title: 'Divide into charts',
    AdvancedComponent: ChartPopoverAdvanced,
  },
  {
    groupName: GroupNameEnum.ROW,
    title: 'Group by row',
  },
];

export default GroupingPopovers;
