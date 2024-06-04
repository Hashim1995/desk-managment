import React from 'react';
import { Tooltip, TooltipProps } from 'antd';

interface IProps {
  title: string;
  children: React.ReactNode;
  tooltipProps?: TooltipProps;
}

function AppHandledTooltip({ title, children, tooltipProps }: IProps) {
  return (
    <Tooltip title={title} {...tooltipProps}>
      {children}
    </Tooltip>
  );
}

export default AppHandledTooltip;
