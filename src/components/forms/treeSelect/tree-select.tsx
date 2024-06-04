import { Form, FormItemProps, TreeSelect, TreeSelectProps } from 'antd';
import React from 'react';
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';

/**
 * A custom tree select component integrated with React Hook Form and Ant Design's TreeSelect.
 * @typedef {Object} RegisterOptions
 * @property {boolean} required - Whether the field is required.
 * @property {string} message - The error message to display if validation fails.
 *
 * @typedef {Object} FormItemProps
 * @property {boolean} required - Whether the field is required.
 * @property {string} label - The label to display for the field.
 * @property {string} htmlFor - The id of the form element associated with the label.
 * @property {string} tooltip - The tooltip message to display for validation errors.
 *
 * @typedef {Object} TreeSelectProps
 * @property {boolean} multiple - Whether multiple selections are allowed.
 * @property {boolean} disabled - Whether the tree select is disabled.
 * @property {string} showCheckedStrategy - Strategy for displaying checked items.
 * @property {boolean} allowClear - Whether to show clear button.
 * @property {React.ReactNode} notFoundContent - Content to display when no data is found.
 * @property {boolean} showSearch - Whether to show search input in dropdown.
 *
 * @typedef {Object} IProps
 * @property {string} [placeholder] - Placeholder text for the tree select field.
 * @property {boolean} [defaultTreeAllDataShow] - Whether to expand all tree nodes by default.
 * @property {string} label - The label for the tree select field.
 * @property {boolean} required - Whether the tree select field is required.
 * @property {string} name - The name of the tree select field.
 * @property {any} [errors] - Object containing validation errors.
 * @property {Function} [onChangeApp] - Callback function for tree select field value changes.
 * @property {TreeSelectProps} [treeSelectProps] - Props to pass to the Ant Design TreeSelect component.
 * @property {FormItemProps} [formItemProps] - Props to pass to the Ant Design Form.Item component.
 * @property {any} control - The React Hook Form control object.
 * @property {RegisterOptions} [rules] - The validation rules for the tree select field.
 * @property {any[]} [treeData] - Data to populate the tree select.
 * @property {boolean} [isMulti] - Whether multiple selections are allowed.
 * @property {boolean} [isDisabled] - Whether the tree select is disabled.
 * @property {boolean} [isClearable] - Whether to show clear button in the tree select.
 * @property {React.ReactNode} [notFoundContent] - Content to display when no data is found.
 * @property {boolean} [showSearch] - Whether to show search input in dropdown.
 * @property {boolean} [isParent] - Whether to show parent items in the tree select.
 *
 * @param {IProps} props - Props for the AppHandledTreeSelect component.
 * @returns {JSX.Element} - JSX element representing the AppHandledTreeSelect component.
 *
 * @example
 * // Usage example
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledTreeSelect from './AppHandledTreeSelect';
 *
 * function MyForm() {
 *   const { control, handleSubmit } = useForm();
 *
 *   const onSubmit = (data) => {
 *     console.log(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <AppHandledTreeSelect
 *         label="Select"
 *         name="treeSelectField"
 *         control={control}
 *         required
 *         placeholder="Select an option"
 *         onChangeApp={(value) => console.log(value)}
 *         treeData={[
 *           { title: 'Node1', value: '0-0', children: [
 *             { title: 'Child Node1', value: '0-0-1' },
 *             { title: 'Child Node2', value: '0-0-2' }
 *           ] },
 *           { title: 'Node2', value: '0-1' }
 *         ]}
 *         formItemProps={{ required: true }}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 */

const defaultData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1'
      },
      {
        title: 'Child Node2',
        value: '0-0-2'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1'
  }
];

interface IProps {
  placeholder?: string;
  defaultTreeAllDataShow?: boolean;
  label: string;
  required: boolean;
  name: string;
  errors?: any;
  onChangeApp?: any;
  treeSelectProps?: TreeSelectProps;
  formItemProps?: FormItemProps;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  treeData: any;
  isMulti?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  notFoundContent?: React.ReactNode;
  showSearch?: boolean;
  isParent?: boolean;
}

function AppHandledTreeSelect({
  placeholder,
  defaultTreeAllDataShow,
  label,
  required,
  name,
  onChangeApp,
  errors,
  formItemProps,
  control,
  rules,
  treeSelectProps,
  treeData,
  isMulti,
  isDisabled,
  isClearable,
  notFoundContent,
  showSearch,
  isParent
}: IProps) {
  return (
    <Form.Item
      label={label}
      // labelCol={{ span: 24, }}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TreeSelect
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData || defaultData}
            placeholder={placeholder}
            treeDefaultExpandAll={defaultTreeAllDataShow}
            multiple={isMulti}
            disabled={isDisabled}
            showCheckedStrategy={isParent ? 'SHOW_PARENT' : 'SHOW_CHILD'}
            allowClear={isClearable}
            onChange={(e: any) => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            notFoundContent={notFoundContent}
            showSearch={showSearch}
            {...treeSelectProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledTreeSelect;
