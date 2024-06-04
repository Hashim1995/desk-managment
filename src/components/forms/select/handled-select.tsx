import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, SelectProps } from 'antd';
import { ReactNode } from 'react';
import AppSelect from './index';

/**
 * A custom select component integrated with React Hook Form, Ant Design's Form, and Ant Design's Select.
 * @typedef {Object} RegisterOptions
 * @property {boolean} required - Whether the field is required.
 * @property {string} message - The error message to display if validation fails.
 *
 * @typedef {Object} SelectProps
 * @property {boolean} allowClear - Whether to show clear button.
 * @property {string} placeholder - Placeholder text.
 *
 * @typedef {Object} FormItemProps
 * @property {boolean} required - Whether the field is required.
 * @property {React.ReactNode} label - The label to display for the field.
 * @property {string} htmlFor - The id of the form element associated with the label.
 * @property {string} tooltip - The tooltip message to display for validation errors.
 *
 * @typedef {Object} IAppHandledSelect
 * @property {string | React.ReactNode} [label] - The label for the select field.
 * @property {string} name - The name of the select field.
 * @property {any} [control] - The React Hook Form control object.
 * @property {RegisterOptions} [rules] - The validation rules for the select field.
 * @property {boolean} [required] - Whether the select field is required.
 * @property {string} [placeholder] - Placeholder text for the select field.
 * @property {any} [errors] - Object containing validation errors.
 * @property {Function} [onChangeApp] - Callback function for select field value changes.
 * @property {SelectProps} [selectProps] - Props to pass to the Ant Design Select component.
 * @property {FormItemProps} [formItemProps] - Props to pass to the Ant Design Form.Item component.
 * @property {boolean} [getLabelOnChange=false] - Whether to retrieve the label value on change.
 * @property {boolean} [IsDynamic=false] - Whether the select field is dynamic.
 * @property {Object} [fieldNames] - Custom field names for the select options.
 * @property {string} fieldNames.value - The key for the value field.
 * @property {string} fieldNames.label - The key for the label field.
 * @property {boolean} [allowClear=true] - Whether to show the clear button in the select field.
 *
 * @param {IAppHandledSelect} props - Props for the AppHandledSelect component.
 * @returns {JSX.Element} - JSX element representing the AppHandledSelect component.
 *
 * @example
 * Usage example
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledSelect from './AppHandledSelect';
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
 *       <AppHandledSelect
 *         label="Select"
 *         name="selectField"
 *         control={control}
 *         required
 *         placeholder="Select an option"
 *         onChangeApp={(value) => console.log(value)}
 *         selectProps={{ mode: 'multiple' }}
 *         formItemProps={{ required: true }}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 */

interface IAppHandledSelect {
  label?: string | ReactNode;
  name: string;
  control?: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
  getLabelOnChange?: boolean;
  IsDynamic?: boolean;
  fieldNames?: { value: string; label: string };
  allowClear?: boolean;
}

function AppHandledSelect({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  selectProps,
  formItemProps,
  IsDynamic,
  fieldNames,
  allowClear = true,
  getLabelOnChange = false
}: IAppHandledSelect) {
  let tooltip: string;
  let status: 'error' | 'warning' | undefined;
  if (IsDynamic) {
    const dynamicNameArray = name.split('.');
    const dynamicName = dynamicNameArray[0];
    const index = Number(dynamicNameArray[1]);
    const key = dynamicNameArray[2];

    status =
      required && errors[dynamicName] && errors[dynamicName][index]
        ? 'error'
        : undefined;
    tooltip =
      errors[dynamicName] &&
      errors[dynamicName][index] &&
      errors[dynamicName][index][key]?.message;
  } else {
    status = required && errors[name] ? 'error' : undefined;
    tooltip = errors[name] ? errors[name].message : '';
  }

  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      required={required}
      htmlFor={name}
      tooltip={tooltip}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <AppSelect
            value={
              getLabelOnChange && fieldNames && value
                ? value[`${fieldNames.value}`]
                : value
            }
            status={status}
            allowClear={allowClear}
            onChange={(e, a) => {
              onChange(e);
              if (onChangeApp) {
                getLabelOnChange ? onChangeApp(a) : onChangeApp(e);
              }
            }}
            fieldNames={fieldNames} // custom field names -> { value: 'customValueField', label: 'customLabelField', children: 'customChildrenField' }
            placeholder={placeholder}
            {...selectProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledSelect;
