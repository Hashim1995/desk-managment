import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Col, Form, FormItemProps, Input, Row } from 'antd';
import { InputProps } from 'antd/es/input';
import { ReactNode } from 'react';

/**
 * A custom input component that integrates with React Hook Form and Ant Design for controlled input management, validation, error handling, and optional button placement.
 *
 * @param {IAppHandledInput} props - Component properties
 * @param {string} props.label - Text label displayed next to the input field.
 * @param {string} props.name - Unique identifier for the input field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the input field. Excludes options specific to numeric values or dates.
 * @param {boolean} [props.required=false] - Whether the input field is required.
 * @param {string} [props.inputType='text'] - The type of input (e.g., 'text', 'password', 'email').
 * @param {string} [props.placeholder] - Placeholder text displayed within the input field (optional).
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {(event: React.MouseEvent<HTMLInputElement>) => void} [props.onChangeApp] - Callback function invoked when the input value changes, allowing additional application-specific logic (optional).
 * @param {InputProps} [props.inputProps] - Additional props to be passed directly to the underlying Ant Design `Input` component (optional).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 * @param {ReactNode} [props.btn] - React node to be rendered as a button within the input field (optional).
 *
 * @returns {JSX.Element} - The rendered input component with label, validation, error handling, and optional button.
 *
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledInputWithButton from './AppHandledInputWithButton';
 *
 * function MyForm() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   const handleSubmit = (data) => {
 *     console.log('Form data:', data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <AppHandledInputWithButton
 *         label="Email Address"
 *         name="email"
 *         control={control}
 *         rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }} // Email validation
 *         errors={errors}
 *         inputType="email"
 *         placeholder="Enter your email"
 *         inputProps={{ maxLength: 50 }} // Set max length for email
 *         btn={<button type="button">Clear</button>} // Optional button
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
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
  inputType?: string;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  btn?: ReactNode;
}

function AppHandledInputWithButton({
  label,
  name,
  control,
  rules,
  required,
  inputType,
  placeholder,
  errors,
  onChangeApp,
  inputProps,
  formItemProps,
  btn
}: IAppHandledInput) {
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
      <Row justify="space-between" align="middle">
        <Col span={22}>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value } }) => (
              <Input
                type={inputType || 'text'}
                id={name}
                onChange={e => {
                  onChange(e);
                  onChangeApp && onChangeApp(e);
                }}
                value={value}
                status={required && errors[name] ? 'error' : undefined}
                placeholder={placeholder || ''}
                {...inputProps}
              />
            )}
          />
        </Col>
        <Col span={2}>
          <Row justify="end">{btn}</Row>
        </Col>
      </Row>
    </Form.Item>
  );
}

export default AppHandledInputWithButton;
