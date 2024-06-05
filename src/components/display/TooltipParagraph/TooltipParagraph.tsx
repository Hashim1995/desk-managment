import React, { useState } from 'react';
import Paragraph, { ParagraphProps } from 'antd/es/typography/Paragraph';
import { Tooltip } from 'antd';

interface IProps extends React.FC<ParagraphProps> {
  children?: React.ReactNode;
  ellipsis?: () => void;
}

function TooltipParagraph({
  children,
  ellipsis,
  ...props
}: IProps): React.ReactElement {
  const [truncated, setTruncated] = useState(false);

  return (
    <Tooltip title={truncated ? children : undefined}>
      <Paragraph
        {...props}
        ellipsis={{ ...ellipsis, onEllipsis: setTruncated }}
      >
        {/* NOTE: Fragment is necessary to avoid showing the title */}
        <span>{children}</span>
      </Paragraph>
    </Tooltip>
  );
}

export default TooltipParagraph;
