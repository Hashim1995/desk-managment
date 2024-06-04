import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Checkbox } from 'antd';
import { CheckboxProps } from 'antd/es/checkbox';
import { ReactNode } from 'react';

/**
 * A custom checkbox component that integrates with React Hook Form for controlled input management, validation, and error handling.
 *
 * @param {IAppHandledCheckbox} props - Component properties
 * @param {string} props.label - Text label displayed next to the checkbox.
 * @param {string} props.name - Unique identifier for the checkbox field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} props.rules - Validation rules to be applied to the checkbox field. Excludes options specific to numeric or date values.
 * @param {boolean} [props.required=false] - Whether the checkbox is required.
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} [props.onChangeApp] - Callback function invoked when the checkbox state changes, allowing additional application-specific logic.
 * @param {CheckboxProps} [props.checkboxProps] - Additional props to be passed directly to the underlying Ant Design `Checkbox` component.
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component.
 * @param {ReactNode} [props.children] - Content to be displayed within the checkbox label (optional).
 * @param {boolean} [props.defaultValue=false] - Default checked state of the checkbox (optional).
 *
 * @returns {JSX.Element} - The rendered checkbox component with label, error handling, and optional custom content.
 */

interface IAppHandledCheckbox {
  label?: string;
  name: string;
  control?: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  errors?: any;
  onChangeApp?: any;
  checkboxProps?: CheckboxProps;
  formItemProps?: FormItemProps;
  children?: ReactNode;
  defaultValue?: boolean;
}

function AppHandledCheckbox({
  label,
  name,
  control,
  rules,
  required,
  errors,
  onChangeApp,
  checkboxProps,
  formItemProps,
  children,
  defaultValue
}: IAppHandledCheckbox) {
  return (
    <Form.Item
      label={label}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      valuePropName="checked"
      className="checkbox-item"
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <Checkbox
            {...checkboxProps}
            defaultChecked={defaultValue}
            id={name}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
          >
            {children}
          </Checkbox>
        )}
      />
    </Form.Item>
  );
}

export default AppHandledCheckbox;

/**
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledCheckbox from './AppHandledCheckbox'; // Assuming AppHandledCheckbox is imported

 * function MyForm() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   const handleSubmit = (data) => {
 *     console.log(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <AppHandledCheckbox
 *         label="Agree to terms and conditions"
 *         name="agreeToTerms"
 *         control={control}
 *         rules={{ required: true }}
 *         errors={errors}
 *         onChangeApp={(e) => console.log('Checkbox changed:', e.target.checked)}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */
