import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { DatePicker, Form, FormItemProps, DatePickerProps } from 'antd';

/**
 * A custom date picker component that integrates with React Hook Form and Ant Design for controlled input management, validation, error handling, and optional localization.
 *
 * @param {IAppHandledDate} props - Component properties
 * @param {string} props.label - Text label displayed next to the date picker.
 * @param {string} props.name - Unique identifier for the date picker field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the date field. Excludes options specific to numeric values.
 * @param {boolean} [props.required=false] - Whether the date picker is required.
 * @param {string} [props.placeholder] - Placeholder text displayed within the date picker (optional).
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {(event: React.MouseEvent<HTMLInputElement>) => void} [props.onChangeApp] - Callback function invoked when the date changes, allowing additional application-specific logic (optional).
 * @param {DatePickerProps} [props.dateProps] - Additional props to be passed directly to the underlying Ant Design `DatePicker` component (optional).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 *
 * @returns {JSX.Element} - The rendered date picker component with label, validation, error handling, and optional localization.
 *
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledDate from './AppHandledDate'; // Assuming AppHandledDate is imported
 * import moment from 'moment'; // Optional for date manipulation (replace with your preferred date library)
 *
 * function MyForm() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   const handleSubmit = (data) => {
 *     console.log('Form data:', data);
 *     const formattedDate = moment(data.dueDate).format('YYYY-MM-DD'); // Optional formatting
 *     console.log('Formatted due date:', formattedDate);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <AppHandledDate
 *         label="Due Date"
 *         name="dueDate"
 *         control={control}
 *         rules={{ required: true }}
 *         errors={errors}
 *         placeholder="Select Date"
 *         dateProps={{ format: 'YYYY-MM-DD' }} // Set date format (optional)
 *         onChangeApp={(date) => console.log('Date changed:', date)}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */
interface IAppHandledDate {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  dateProps?: DatePickerProps;
  formItemProps?: FormItemProps;
}

function AppHandledDate({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  dateProps,
  formItemProps
}: IAppHandledDate) {
  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      // labelCol={{ span: 24 }}
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
          <DatePicker
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            placeholder={placeholder}
            {...dateProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledDate;
