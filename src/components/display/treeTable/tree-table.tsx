/* eslint-disable no-unused-vars */
import { MenuProps, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsPrinter } from 'react-icons/bs';
import './style.scss';
import AppHandledTooltip from '../tooltip/tooltip';
import AppHandledDropdown from '../dropdown/app-handled-dropdown';
import AppPagination from '../pagination/pagination';

/**
 * A custom tree table component integrated with Ant Design's Table, supporting additional functionalities such as dropdown menus, icons, and pagination.
 * @typedef {import('antd/es/table').ColumnsType} ColumnsType
 * @typedef {import('antd/es/table').TableProps} TableProps
 * @typedef {import('antd').MenuProps} MenuProps
 *
 * @typedef {Object} IProps
 * @property {ColumnsType<any>} column - The columns configuration of the table.
 * @property {any[]} data - The data to be rendered in the table.
 * @property {string} [dropdownTitle] - The title of the dropdown menu.
 * @property {string} [controlDropdownTitle] - The title of the control dropdown menu.
 * @property {MenuProps['items']} [dropdownItems] - The items to be displayed in the dropdown menu.
 * @property {MenuProps['items']} [controlDropdownItems] - The items to be displayed in the control dropdown menu.
 * @property {boolean} [showIcon] - Whether to show icons in the header.
 * @property {number} [currentPage] - The current page number of the pagination.
 * @property {number} [totalPage] - The total number of pages in the pagination.
 * @property {(e: number) => void} [onChangePage] - Callback function triggered when the page changes.
 * @property {TableProps<any>} [tableProps] - Props to be passed to the Ant Design Table component.
 * @property {() => void} [onClickExportFile] - Callback function triggered when exporting a file.
 *
 * @param {IProps} props - Props for the AppHandledTreeTable component.
 * @returns {JSX.Element} - JSX element representing the AppHandledTreeTable component.
 *
 * @example
 * // Usage example
 * import React from 'react';
 * import AppHandledTreeTable from './AppHandledTreeTable';
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
 *     <AppHandledTreeTable
 *       column={columns}
 *       data={data}
 *       dropdownTitle="Actions"
 *       dropdownItems={[
 *         { key: '1', label: 'Action 1' },
 *         { key: '2', label: 'Action 2' },
 *         { key: '3', label: 'Action 3' },
 *       ]}
 *       showIcon
 *       currentPage={1}
 *       totalPage={5}
 *       onChangePage={(page) => console.log(`Page changed to: ${page}`)}
 *       onClickExportFile={() => console.log('Exporting file...')}
 *     />
 *   );
 * }
 *
 * export default ExampleComponent;
 */

interface IProps {
  column: ColumnsType<any>;
  data: any;
  dropdownTitle?: string;
  controlDropdownTitle?: string;
  dropdownItems?: MenuProps['items'];
  controlDropdownItems?: MenuProps['items'];
  showIcon?: boolean;
  currentPage?: number;
  totalPage?: number;
  onChangePage?: (e: number) => void;
  tableProps?: TableProps<any>;
  onClickExportFile?: () => void;
}

function AppHandledTreeTable({
  column,
  data,
  dropdownTitle,
  dropdownItems,
  showIcon,
  controlDropdownTitle,
  controlDropdownItems,
  currentPage,
  totalPage,
  onChangePage,
  onClickExportFile,
  tableProps
}: IProps) {
  return (
    <div className="treeTableContainer">
      <div className="treeTableHeader">
        {controlDropdownTitle && (
          <AppHandledDropdown
            title={controlDropdownTitle}
            items={controlDropdownItems}
            otherMenuProps={{
              selectable: true,
              multiple: true,
              defaultSelectedKeys: ['3']
            }}
          />
        )}
        {dropdownTitle && (
          <AppHandledDropdown title={dropdownTitle} items={dropdownItems} />
        )}
        {showIcon && (
          <div className="treeTableIconContainer">
            <AppHandledTooltip title="Export excel">
              <IoDocumentTextOutline
                className="icon"
                onClick={onClickExportFile}
              />
            </AppHandledTooltip>
            <AppHandledTooltip title="Print">
              <BsPrinter className="icon" />
            </AppHandledTooltip>
          </div>
        )}
      </div>
      <div className="mb-10">
        <Table
          columns={column}
          dataSource={data?.map((item: any) => ({ ...item, key: item.id }))}
          pagination={false}
          {...tableProps}
        />
      </div>
      <div className="treeTablePagination">
        <AppPagination
          current={currentPage}
          total={totalPage}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

export default AppHandledTreeTable;
