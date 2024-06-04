import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { CheckboxOptionType, Form, FormItemProps, Radio } from 'antd';
import { RadioProps, RadioGroupProps } from 'antd/es/radio';
import { ReactNode } from 'react';

/**
 * A custom radio or radio group component that integrates with React Hook Form and Ant Design for controlled radio input management, validation, error handling, and customization options.
 *
 * @param {IAppHandledRadio} props - Component properties
 * @param {string} props.label - Text label displayed next to the radio or radio group.
 * @param {string} props.name - Unique identifier for the radio or radio group within the form.
 * @param {Controller<any, any>} [props.control] - The `control` object provided by `useForm` from React Hook Form (required for radio group).
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the radio input (optional). Excludes options specific to numeric values or dates.
 * @param {boolean} [props.required=false] - Whether the radio or radio group is required.
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {(React.ChangeEvent<HTMLInputElement>) => void} [props.onChangeApp] - Callback function invoked when the radio selection changes, allowing additional application-specific logic (optional).
 * @param {RadioProps} [props.radioProps] - Additional props to be passed directly to the underlying Ant Design `Radio` component (optional for single radio).
 * @param {RadioGroupProps} [props.radioGroupProps] - Additional props to be passed directly to the underlying Ant Design `Radio.Group` component (optional for radio group).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 * @param {boolean} [props.isGroup=false] - Flag indicating whether to render a radio group or a single radio button. Defaults to false.
 * @param {ReactNode} [props.children] - Content to be rendered within the radio group (required for radio group).
 * @param {string | number} props.val - The value assigned to the single radio button (required for single radio).
 * @param {Array<CheckboxOptionType | string | number>} [props.options] - An array of options for the radio group (required for radio group). Each option can be an object with label and value, or just a string or number representing the value (optional for radio group).
 *
 * @returns {JSX.Element} - The rendered radio component (single or group) with label, validation, error handling, and customization options.
 */

interface IAppHandledRadio {
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
  radioProps?: RadioProps;
  radioGroupProps?: RadioGroupProps;
  formItemProps?: FormItemProps;
  isGroup?: boolean;
  children?: ReactNode;
  val?: string | number;
  options?: Array<CheckboxOptionType | string | number>;
}

function AppHandledRadio({
  label,
  name,
  control,
  rules,
  required,
  errors,
  onChangeApp,
  radioProps,
  radioGroupProps,
  formItemProps,
  isGroup,
  children,
  options,
  val
}: IAppHandledRadio) {
  return isGroup ? (
    <Form.Item
      label={label}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={{ ...rules, required }}
        render={({ field: { onChange, value } }) => (
          <Radio.Group
            {...radioGroupProps}
            id={name}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            value={value}
            options={options}
          >
            {children}
          </Radio.Group>
        )}
      />
    </Form.Item>
  ) : (
    <Radio id={name} value={val} {...radioProps}>
      {label}
    </Radio>
  );
}

export default AppHandledRadio;
