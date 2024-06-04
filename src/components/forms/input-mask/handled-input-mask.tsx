/* eslint-disable no-octal-escape */
/* eslint-disable no-nonoctal-decimal-escape */
import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { Form, FormItemProps, Input, InputProps } from 'antd';
import InputMask from 'react-input-mask';

/**
 * A custom input component that integrates with React Hook Form and Ant Design for controlled input management, validation, error handling, and masked input functionality.
 *
 * @param {IAppHandledInputMask} props - Component properties
 * @param {string} props.label - Text label displayed next to the input field.
 * @param {string} props.name - Unique identifier for the input field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the input field. Excludes options specific to numeric values or dates.
 * @param {boolean} [props.required=false] - Whether the input field is required.
 * @param {string} [props.inputType='text'] - The type of input (e.g., 'text'). Defaults to 'text'.
 * @param {string} [props.placeholder] - Placeholder text displayed within the input field (optional).
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {string} props.mask - The mask pattern to format the input value (required).
 * @param {string | null} [props.maskChar=null] - Optional character to be used as a placeholder within the mask (defaults to null).
 * @param {(string) => void} [props.onChangeApp] - Callback function invoked when the input value changes, allowing additional application-specific logic (optional).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 *
 * @returns {JSX.Element} - The rendered input component with label, validation, error handling, and masked input functionality.
 *
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledInputMask from './AppHandledInputMask';
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
 *       <AppHandledInputMask
 *         label="Phone Number"
 *         name="phone"
 *         control={control}
 *         rules={{ required: true }} // Ensure phone number is provided
 *         errors={errors}
 *         mask="(999) 999-9999" // Phone number mask with parentheses
 *         placeholder="Enter your phone number"
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */

interface IAppHandledInputMask {
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
  mask: string;
  maskChar?: string | null;
  onChangeApp?: any;
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
}
// @ts-ignore: Unreachable code error
function AppHandledInputMask({
  label,
  name,
  control,
  rules,
  required,
  inputType,
  placeholder,
  errors,
  onChangeApp,
  formItemProps,
  mask,
  inputProps,
  maskChar = null
}: IAppHandledInputMask) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
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
          <InputMask
            mask={mask}
            maskChar={maskChar}
            alwaysShowMask
            value={value}
            onChange={(e: any) => {
              const rawValue: string =
                e?.target?.value?.replace(/[\s()\-_]/g, '') || '';
              onChange(rawValue);
              onChangeApp && onChangeApp(rawValue);
            }}
          >
            {/* 
// @ts-ignore */}
            <Input
              {...inputProps}
              status={required && errors[name] ? 'error' : undefined}
              id={name}
              type={inputType || 'text'}
              value={value}
              placeholder={placeholder || ''}
            />
          </InputMask>
        )}
      />
    </Form.Item>
  );
}

export default AppHandledInputMask;
