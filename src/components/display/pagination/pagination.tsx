import { Pagination, PaginationProps } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import AppHandledButton from '../button/handle-button';

/**
 * A customized pagination component integrated with Ant Design's Pagination, supporting additional customization options.
 * @typedef {import('antd/es/pagination').PaginationProps} PaginationProps
 *
 * @param {PaginationProps} props - Props for the AppPagination component.
 * @returns {JSX.Element} - JSX element representing the AppPagination component.
 *
 * @example
 * Usage example
 * import React from 'react';
 * import AppPagination from './AppPagination';
 *
 * function ExampleComponent() {
 *   return (
 *     <AppPagination
 *       defaultCurrent={1}
 *       total={50}
 *       pageSize={10}
 *       onChange={(page, pageSize) => console.log(`Page changed to: ${page}, Page size: ${pageSize}`)}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */

function AppPagination(props: PaginationProps) {
  return (
    <Pagination
      style={{ marginTop: '20px', marginBottom: '20px' }}
      showQuickJumper={{
        goButton: (
          <AppHandledButton
            size="small"
            type="dashed"
            icon={<RightCircleOutlined rev={undefined} />}
          />
        )
      }}
      locale={{
        jump_to: '',
        page: ''
      }}
      size="small"
      showSizeChanger={false}
      {...props}
    />
  );
}

export default AppPagination;
