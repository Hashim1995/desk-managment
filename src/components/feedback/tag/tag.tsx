import { Tag, theme } from 'antd';
import { useTranslation } from 'react-i18next';

/**
 * A custom tag component for displaying labels with optional colors, integrated with Ant Design's Tag.
 * @typedef {Object} StatusOption
 * @property {number} value - The value of the status option.
 * @property {string} label - The label of the status option.
 *
 * @typedef {Object} CustomTagProps
 * @property {number|string|null} [id] - The ID of the status option.
 * @property {string} [color] - The color of the tag.
 * @property {string} [label] - The label to display in the tag.
 * @property {string} [fontSize] - The font size of the tag.
 * @property {StatusOption[]} [statusOptions] - Array of status options.
 * @property {Record<string, string>} [statusColors] - Object containing status labels and their corresponding colors.
 *
 * @param {CustomTagProps} props - Props for the AppTag component.
 * @returns {JSX.Element} - JSX element representing the AppTag component.
 *
 * @example
 * Usage example with status options and colors provided as props
 * import React from 'react';
 * import AppTag from './AppTag';
 *
 * function ExampleComponent() {
 *   const statusOptions = [
 *     { value: 1, label: 'Pending' },
 *     { value: 2, label: 'Returned' },
 *     { value: 3, label: 'Agreed' }
 *   ];
 *
 *   const statusColors = {
 *     'Pending': '#fa8c16',
 *     'Returned': '#f5222d',
 *     'Agreed': '#52c41a'
 *   };
 *
 *   return (
 *     <div>
 *       <AppTag id={1} statusOptions={statusOptions} statusColors={statusColors} />
 *       <AppTag id={2} statusOptions={statusOptions} statusColors={statusColors} />
 *       <AppTag id={3} statusOptions={statusOptions} statusColors={statusColors} />
 *     </div>
 *   );
 * }
 *
 * export default ExampleComponent;
 *
 * @example
 * Usage example with custom label and color provided as props
 * import React from 'react';
 * import AppTag from './AppTag';
 *
 * function ExampleComponent() {
 *   return (
 *     <div>
 *       <AppTag label="Custom" color="#1890ff" />
 *     </div>
 *   );
 * }
 *
 * export default ExampleComponent;
 */

interface StatusOption {
  value: number;
  label: string;
}

interface CustomTagProps {
  id?: number | string | null;
  color?: string;
  label?: string;
  fontSize?: string;
  statusOptions?: StatusOption[];
  statusColors?: Record<string, string>;
}

function AppTag({
  id,
  color,
  label,
  fontSize,
  statusOptions = [],
  statusColors = {}
}: CustomTagProps) {
  const { useToken } = theme;
  const { token } = useToken();
  const { t } = useTranslation();

  // Find the corresponding status object in the statusOptions array
  const matchedStatus = statusOptions.find(status => status.value === id);

  // If id is provided and matches a value in the statusOptions array, use its label and color
  if (id && matchedStatus) {
    return (
      <Tag
        style={{
          margin: 0,
          fontSize,
          padding: token.paddingXS
        }}
        color={statusColors[matchedStatus.label]}
      >
        {matchedStatus.label?.toLocaleUpperCase('tr-TR') ??
          t('noDataText')?.toLocaleUpperCase('tr-TR')}
      </Tag>
    );
  }

  // If id is not provided or doesn't match, use the provided label and color
  if (label && color) {
    return (
      <Tag
        style={{
          fontSize,
          margin: 0,
          padding: token.paddingXS
        }}
        color={color}
      >
        {label?.toLocaleUpperCase('tr-TR') ??
          t('noDataText')?.toLocaleUpperCase('tr-TR')}
      </Tag>
    );
  }

  // If neither id nor label and color are provided, return an empty span
  return (
    <Tag
      style={{
        fontSize,
        padding: token.paddingXS
      }}
      color={'blue'}
    >
      {t('noDataText')?.toLocaleUpperCase('tr-TR')}
    </Tag>
  );
}

export default AppTag;
