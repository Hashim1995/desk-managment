import React from 'react';
import { Col, EmptyProps, PaginationProps, Row, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import {
  RowSelectionType,
  TablePaginationConfig
} from 'antd/es/table/interface';
import AppPagination from '../pagination/pagination';
import AppEmpty from '../empty/app-empty';

/**
 * A custom table component integrated with Ant Design's Table, supporting pagination, row selection, and customization.
 * @typedef {import('antd/es/table').ColumnsType} ColumnsType
 * @typedef {import('antd/es/table').TableProps} TableProps
 * @typedef {import('antd/es/table/interface').RowSelectionType} RowSelectionType
 * @typedef {import('antd/es/table/interface').TablePaginationConfig} TablePaginationConfig
 * @typedef {import('antd').EmptyProps} EmptyProps
 *
 * @typedef {Object} IProps
 * @property {ColumnsType<any>} columns - The columns configuration of the table.
 * @property {any[]} data - The data to be rendered in the table.
 * @property {false | TablePaginationConfig | undefined} [pagination] - Pagination configuration for the table.
 * @property {Object} [rowSelection] - Row selection configuration for the table.
 * @property {RowSelectionType} [rowSelection.type] - The type of row selection.
 * @property {() => void} [rowSelection.onChange] - Callback function triggered when the selection changes.
 * @property {() => void} [rowSelection.onSelect] - Callback function triggered when a row is selected.
 * @property {number} [currentPage] - The current page number of the pagination.
 * @property {(page: number, pageSize: number) => void} [onChangePage] - Callback function triggered when the page changes.
 * @property {number} [totalPage] - The total number of pages in the pagination.
 * @property {TableProps<any>} [tableProps] - Props to be passed to the Ant Design Table component.
 * @property {PaginationProps} [paginationProps] - Props to be passed to the pagination component.
 * @property {EmptyProps} [emptyDataProps] - Props to be passed to the AppEmpty component when no data is available.
 *
 * @param {IProps} props - Props for the AppHandledTable component.
 * @returns {JSX.Element} - JSX element representing the AppHandledTable component.
 *
 * @example
 * // Usage example
 * import React from 'react';
 * import AppHandledTable from './AppHandledTable';
 *
 * function ExampleComponent() {
 *   const columns = [
 *     { title: 'Name', dataIndex: 'name', key: 'name' },
 *     { title: 'Age', dataIndex: 'age', key: 'age' },
 *     { title: 'Address', dataIndex: 'address', key: 'address' },
 *   ];
 *
 *   const data = [
 *     { id: 1, name: 'John', age: 30, address: 'New York' },
 *     { id: 2, name: 'Jane', age: 25, address: 'Los Angeles' },
 *     { id: 3, name: 'Doe', age: 35, address: 'Chicago' },
 *   ];
 *
 *   return (
 *     <AppHandledTable
 *       columns={columns}
 *       data={data}
 *       pagination={{ pageSize: 10 }}
 *       currentPage={1}
 *       totalPage={5}
 *       onChangePage={(page, pageSize) => console.log(`Page changed to: ${page}, Page size: ${pageSize}`)}
 *       rowSelection={{
 *         type: 'checkbox',
 *         onChange: () => console.log('Selection changed'),
 *         onSelect: () => console.log('Row selected')
 *       }}
 *       emptyDataProps={{ description: 'No data available' }}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */
interface IProps extends TableProps<any> {
  columns: ColumnsType<any>;
  data: any;
  pagination?: false | TablePaginationConfig | undefined;
  rowSelection?: {
    type?: RowSelectionType | undefined;
    onChange?: () => void;
    onSelect?: () => void;
  };
  currentPage?: number;
  // eslint-disable-next-line no-unused-vars
  onChangePage?: (page: number, pageSize: number) => void;
  totalPage?: number;
  tableProps?: TableProps<any>;
  paginationProps?: PaginationProps;
  emptyDataProps?: EmptyProps;
}

// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
//     console.log(
//       `selectedRowKeys: ${selectedRowKeys}`,
//       'selectedRows: ',
//       selectedRows
//     );
//   }
// };

function AppHandledTable({
  columns,
  data,
  rowSelection,
  pagination = false,
  currentPage,
  totalPage,
  emptyDataProps,
  onChangePage,
  ...tableProps
}: IProps) {
  return (
    <div>
      <Row className="pb-10">
        <Col span={24}>
          <Table
            pagination={pagination}
            rowSelection={
              rowSelection
                ? {
                    ...rowSelection
                  }
                : undefined
            }
            columns={columns}
            locale={{
              emptyText: <AppEmpty {...emptyDataProps} />
            }}
            dataSource={data}
            {...tableProps}
          />
        </Col>
      </Row>
      <Row justify="end" className="generalPagination">
        <Col>
          <AppPagination
            current={currentPage}
            total={totalPage}
            onChange={onChangePage}
            {...tableProps.paginationProps}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AppHandledTable;
