// src/utils/restrictToGridAndBounds.ts

import { Modifier } from '@dnd-kit/core';

export const restrictToGridAndBounds: Modifier = ({
  transform,
  activeNodeRect,
  containerNodeRect
}) => {
  const gridSize = 50;
  let x = Math.round(transform.x / gridSize) * gridSize;
  let y = Math.round(transform.y / gridSize) * gridSize;

  const maxX = containerNodeRect?.width - activeNodeRect?.width;
  const maxY = containerNodeRect?.height - activeNodeRect?.height;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  return {
    ...transform,
    x,
    y
  };
};
