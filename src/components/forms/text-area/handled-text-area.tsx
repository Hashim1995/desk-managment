import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Input } from 'antd';

/**
 * A custom textarea component integrated with React Hook Form and Ant Design's Form.
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
 * @typedef {Object} IAppHandledInput
 * @property {string} [label] - The label for the textarea field.
 * @property {string} name - The name of the textarea field.
 * @property {any} control - The React Hook Form control object.
 * @property {RegisterOptions} [rules] - The validation rules for the textarea field.
 * @property {boolean} [required] - Whether the textarea field is required.
 * @property {string} [textareaType] - The type of textarea (e.g., 'text', 'password').
 * @property {string} [placeholder] - Placeholder text for the textarea field.
 * @property {any} [errors] - Object containing validation errors.
 * @property {Function} [onChangeApp] - Callback function for textarea field value changes.
 * @property {any} [textareaProps] - Props to pass to the Ant Design TextArea component.
 * @property {FormItemProps} [formItemProps] - Props to pass to the Ant Design Form.Item component.
 *
 * @param {IAppHandledInput} props - Props for the AppHandledTextArea component.
 * @returns {JSX.Element} - JSX element representing the AppHandledTextArea component.
 *
 * @example
 *  Usage example
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledTextArea from './AppHandledTextArea';
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
 *       <AppHandledTextArea
 *         label="Description"
 *         name="description"
 *         control={control}
 *         required
 *         placeholder="Enter description"
 *         onChangeApp={(value) => console.log(value)}
 *         textareaProps={{ rows: 4 }}
 *         formItemProps={{ required: true }}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 */

interface IAppHandledInput {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  textareaType?: string;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  textareaProps?: any;
  formItemProps?: FormItemProps;
}

function AppHandledTextArea({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  textareaProps,
  formItemProps
}: IAppHandledInput) {
  const { TextArea } = Input;
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
          <TextArea
            id={name}
            onInput={(e: any) => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            placeholder={placeholder || ''}
            {...textareaProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledTextArea;
