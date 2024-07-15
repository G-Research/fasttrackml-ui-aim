import React from 'react';

import { IPoint } from 'components/ScatterPlot';

import { IAxisScale } from './getAxisScale';

export interface IDrawPointsArgs {
  index: number;
  nameKey: string;
  pointsRef: React.MutableRefObject<>;
  pointsNodeRef: React.MutableRefObject<>;
  data: IPoint[];
  xScale: IAxisScale;
  yScale: IAxisScale;
}
